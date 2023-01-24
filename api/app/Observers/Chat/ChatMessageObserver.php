<?php

namespace App\Observers\Chat;

use App\Events\SendMessage;
use App\Models\Chat\ChatMessage;
use App\Models\User\Notification;
use Cache;
use Broadcast;
use Str;

class ChatMessageObserver
{
    /**
     * Handle the ChatMessage "created" event.
     *
     * @param  \App\Models\Chat\ChatMessage  $message
     * @return void
     */
    public function created(ChatMessage $message)
    {
        // 1 day / add or delete participant -> clear cache
        $cached = Cache::remember('chat:' . $message->room_id . ':user:' . $message->user_id, 86400, function () use ($message) {
            return $message->load('user', 'chat.participants');
        });
        $cached->body = $message->body;

        $pusher = Broadcast::driver('pusher')->getPusher();
        $presenceUsers = $pusher->get('/channels/presence-chat-room.' . $message->room_id . '/users')->users ?? [];
        $presenceUsersIds = collect($presenceUsers)->pluck('id');

        // If there are more than 1 user (SENDER) in the room, then broadcast the message
        if ($presenceUsersIds->count() > 1) {
            broadcast(new SendMessage($message));
        }

        $cached->chat->participants->each(function ($participant) use ($cached, $pusher, $presenceUsersIds) {
            if (!$participant->user->is_active || ($participant->user->is_active && !$presenceUsersIds->contains($participant->user_id))) {
                $notification = Notification::updateOrCreate([
                    'user_id' => $participant->user_id,
                    'source' => 'message',
                    'source_id' => $cached->chat->id,
                ], [
                    'source_data' => json_encode([
                        'preview' => Str::limit($cached->body, 50),
                        'id' => $cached->user->id,
                        'name' => $cached->user->name,
                        'avatar' => $cached->user->avatar_name ? ($cached->user->avatar_url . '50_' . $cached->user->avatar_name) : null
                    ])
                ]);

                if ($participant->user->is_active && !$presenceUsersIds->contains($participant->user_id)) {
                    $pusher->trigger('private-user.' . $participant->user_id, 'new-notification', [
                        'id' =>  $notification->id,
                        'user_id' => $participant->user_id,
                        'source' => 'message',
                        'source_id' => $cached->chat->id,
                        'source_data' => json_encode([
                            'preview' => Str::limit($cached->body, 50),
                            'id' => $cached->user->id,
                            'name' => $cached->user->name,
                            'avatar' => $cached->user->avatar_name ? ($cached->user->avatar_url . '50_' . $cached->user->avatar_name) : null
                        ]),
                        'readed_at' => null,
                        'created_at' => now()->diffForHumans()
                    ]);
                }
            }
        });
    }

    /**
     * Handle the ChatMessage "updated" event.
     *
     * @param  \App\Models\Chat\ChatMessage  $message
     * @return void
     */
    public function updated(ChatMessage $message)
    {
        //
    }

    /**
     * Handle the ChatMessage "deleted" event.
     *
     * @param  \App\Models\Chat\ChatMessage  $message
     * @return void
     */
    public function deleted(ChatMessage $message)
    {
        //
    }

    /**
     * Handle the ChatMessage "restored" event.
     *
     * @param  \App\Models\Chat\ChatMessage  $message
     * @return void
     */
    public function restored(ChatMessage $message)
    {
        //
    }

    /**
     * Handle the ChatMessage "force deleted" event.
     *
     * @param  \App\Models\Chat\ChatMessage  $message
     * @return void
     */
    public function forceDeleted(ChatMessage $message)
    {
        //
    }
}
