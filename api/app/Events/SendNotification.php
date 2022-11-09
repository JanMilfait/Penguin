<?php

namespace App\Events;

use App\Models\User\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user_id;
    public $source;
    public $source_id;
    public $source_data;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user_id, $source, $source_id, array $source_data)
    {
        $this->user_id = $user_id;
        $this->source = $source;
        $this->source_id = $source_id;
        $this->source_data = $source_data;
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
        return 'new-notification';
    }

    public function broadcastWith()
    {
        return $this->source_data;
    }

    public function broadcastWhen()
    {
        return User::where('id', $this->user_id)->where('is_active', 1)->exists();
    }
}
