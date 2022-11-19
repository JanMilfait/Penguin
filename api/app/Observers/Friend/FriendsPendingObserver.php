<?php

namespace App\Observers\Friend;

use App\Events\SendNotification;
use App\Models\Friend\FriendsPending;
use App\Models\User\User;

class FriendsPendingObserver
{
    /**
     * Handle the FriendsPending "created" event.
     *
     * @param  \App\Models\Friend\FriendsPending  $pending
     * @return void
     */
    public function created(FriendsPending $pending)
    {
        $user = User::find($pending->user_id);

        broadcast(new SendNotification($pending->pending_user, 'pending', $pending->id, [
            'source' => 'pending',
            'source_id' => $pending->id,
            'state' => $pending->state,
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar_name ? $user->avatar_url . '50_' . $user->avatar_name : null
        ]));
    }

    /**
     * Handle the FriendsPending "updated" event.
     *
     * @param  \App\Models\Friend\FriendsPending  $pending
     * @return void
     */
    public function updated(FriendsPending $pending)
    {
        if ($pending->isDirty('state') && $pending->state == 'accepted') {

            $user = User::find($pending->pending_user);

            broadcast(new SendNotification($pending->user_id, 'pending', $pending->id, [
                'source' => 'pending',
                'source_id' => $pending->id,
                'state' => $pending->state,
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar_name ? $user->avatar_url . '50_' . $user->avatar_name : null
            ]));

        } elseif ($pending->isDirty('state') && $pending->state === 'declined') {

            $user = User::find($pending->pending_user);

            broadcast(new SendNotification($pending->user_id, 'pending', $pending->id, [
                'source' => 'pending',
                'source_id' => $pending->id,
                'state' => $pending->state,
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar_name ? $user->avatar_url . '50_' . $user->avatar_name : null
            ]));
        }
    }

    /**
     * Handle the FriendsPending "deleted" event.
     *
     * @param  \App\Models\Friend\FriendsPending  $pending
     * @return void
     */
    public function deleted(FriendsPending $pending)
    {
        //
    }

    /**
     * Handle the FriendsPending "restored" event.
     *
     * @param  \App\Models\Friend\FriendsPending  $pending
     * @return void
     */
    public function restored(FriendsPending $pending)
    {
        //
    }

    /**
     * Handle the FriendsPending "force deleted" event.
     *
     * @param  \App\Models\Friend\FriendsPending  $pending
     * @return void
     */
    public function forceDeleted(FriendsPending $pending)
    {
        //
    }
}
