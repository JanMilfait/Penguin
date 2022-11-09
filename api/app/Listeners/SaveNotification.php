<?php

namespace App\Listeners;

use App\Events\SendNotification;
use App\Models\User\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SaveNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\SendNotification  $event
     * @return void
     */
    public function handle(SendNotification $event)
    {
        Notification::create([
            'user_id' => $event->user_id,
            'source' => $event->source,
            'source_id' => $event->source_id,
            'source_data' => json_encode($event->source_data),
            'expire_at' => now()->addDays(7)
        ]);
    }
}
