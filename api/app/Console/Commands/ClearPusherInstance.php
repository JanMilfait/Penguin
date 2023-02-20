<?php

namespace App\Console\Commands;

use Broadcast;
use Illuminate\Console\Command;
use Pusher\Pusher;
use Pusher\PusherException;

class ClearPusherInstance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pusher:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all channels and users from a Pusher instance to correct misbehaving webhooks.';

    /**
     * Execute the console command.
     *
     * @return int
     * @throws PusherException
     */
    public function handle()
    {
        return Command::SUCCESS;
    }
}
