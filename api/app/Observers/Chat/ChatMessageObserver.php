<?php

namespace App\Observers\Chat;

use App\Events\SendMessage;
use App\Models\Chat\ChatMessage;
use App\Models\User\Notification;
use Cache;
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
        $cached = Cache::remember('chat_' . $message->room_id . '_' . $message->user_id, 86400, function () use ($message) {
            return $message->load('user', 'chat.participants');
        });
        $cached->body = $message->body;

        // Save notification for all non active chat participants
        $cached->chat->participants->each(function ($participant) use ($cached) {

            // participant.user mustn't be cached
            if ($participant->user->is_active === 1) return;

            Notification::updateOrCreate([
                'user_id' => $participant->user_id,
                'source' => 'message',
                'source_id' => $cached->chat->id,
            ], [
                'source_data' => json_encode([
                    'source' => 'message',
                    'source_id' => $cached->chat->id,
                    'preview' => Str::limit($cached->body, 50),
                    'id' => $cached->user->id,
                    'name' => $cached->user->name,
                    'avatar' => $cached->user->avatar_name ? $cached->user->avatar_url . '40_' . $cached->user->avatar_name : null
                ]),
                'expire_at' => now()->addDays(7)
            ]);
        });

        broadcast(new SendMessage($message));
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
