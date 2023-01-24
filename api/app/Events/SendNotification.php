<?php

namespace App\Events;

use App\Models\User\Notification;
use App\Models\User\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $id;
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
        $this->id = Notification::latestInsertedId() + 1;
        $this->user_id = $user_id;
        $this->source = $source;
        $this->source_id = $source_id;
        $this->source_data = json_encode($source_data);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->user_id);
    }

    public function broadcastAs()
    {
        return 'new-notification';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'source' => $this->source,
            'source_id' => $this->source_id,
            'source_data' => $this->source_data,
            'readed_at' => null,
            'created_at' => now()->diffForHumans()
        ];
    }

    public function broadcastWhen()
    {
        return User::where('id', $this->user_id)->where('is_active', 1)->exists();
    }
}
