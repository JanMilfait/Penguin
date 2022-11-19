<?php

namespace App\Observers\Chat;

use App\Events\SendNotification;
use App\Models\Chat\ChatParticipant;
use Cache;

class ChatParticipantObserver
{
    /**
     * Handle the ChatParticipant "created" event.
     *
     * @param  \App\Models\Chat\ChatParticipant  $participant
     * @return void
     */
    public function created(ChatParticipant $participant)
    {
        $participant->chat->participants->each(function ($participant) {
            Cache::forget('chat_' . $participant->room_id . '_' . $participant->user_id);
        });

        if ($participant->chat->participants->count() <= 2) return;

        $ids = $participant->chat->participants->pluck('user_id')->except($participant->user_id)->toArray();
        $names = $participant->chat->participants->pluck('user.name')->except($participant->user_id)->toArray();

        $participant->chat->participants->each(function ($item) use ($participant, $ids, $names) {
            broadcast(new SendNotification($item->user->id, 'chat', $participant->chat->id, [
                'source' => 'chat',
                'source_id' => $participant->chat->id,
                'state' => 'added',
                'ids' => $ids,
                'names' => $names,
                'id' => $participant->user->id,
                'name' => $participant->user->name,
                'avatar' => $participant->user->avatar_name ? $participant->user->avatar_url . '50_' . $participant->user->avatar_name : null
            ]));
        });
    }

    /**
     * Handle the ChatParticipant "updated" event.
     *
     * @param  \App\Models\Chat\ChatParticipant  $participant
     * @return void
     */
    public function updated(ChatParticipant $participant)
    {
        //
    }

    /**
     * Handle the ChatParticipant "deleted" event.
     *
     * @param  \App\Models\Chat\ChatParticipant  $participant
     * @return void
     */
    public function deleted(ChatParticipant $participant)
    {
        // add back removed participant to collection
        $participant->chat->participants->push($participant);

        $participant->chat->participants->each(function ($participant) {
            Cache::forget('chat_' . $participant->room_id . '_' . $participant->user_id);
        });

        $ids = $participant->chat->participants->pluck('user_id')->toArray();
        $names = $participant->chat->participants->pluck('user.name')->toArray();

        $participant->chat->participants->each(function ($item) use ($participant, $ids, $names) {
            broadcast(new SendNotification($item->user->id, 'chat', $participant->chat->id, [
                'source' => 'chat',
                'source_id' => $participant->chat->id,
                'state' => 'removed',
                'ids' => $ids,
                'names' => $names,
                'id' => $participant->user->id,
                'name' => $participant->user->name,
                'avatar' => $participant->user->avatar_name ? $participant->user->avatar_url . '50_' . $participant->user->avatar_name : null
            ]));
        });
    }

    /**
     * Handle the ChatParticipant "restored" event.
     *
     * @param  \App\Models\Chat\ChatParticipant  $participant
     * @return void
     */
    public function restored(ChatParticipant $participant)
    {
        //
    }

    /**
     * Handle the ChatParticipant "force deleted" event.
     *
     * @param  \App\Models\Chat\ChatParticipant  $participant
     * @return void
     */
    public function forceDeleted(ChatParticipant $participant)
    {
        //
    }
}
