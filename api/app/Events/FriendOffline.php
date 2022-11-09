<?php

namespace App\Events;

use App\Models\User\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FriendOffline implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user_id;
    public $friend_id;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user_id, $friend_id)
    {
        $this->user_id = $user_id;
        $this->friend_id = $friend_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('private-user.' . $this->user_id);
    }

    public function broadcastAs()
    {
        return 'friend-offline';
    }

    public function broadcastWith()
    {
        return [
            'friend_id' => $this->friend_id
        ];
    }

    public function broadcastWhen()
    {
        return User::where('id', $this->user_id)->where('is_active', 1)->exists();
    }
}

