<?php

namespace App\Observers\Chat;

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
        Cache::forget('chat_' . $participant->room_id . '_' . $participant->user_id);
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
        //
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
