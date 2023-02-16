<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Friend\Friend;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Disable Pusher broadcasting
        app()->instance(\Illuminate\Contracts\Broadcasting\Broadcaster::class, new \Illuminate\Broadcasting\Broadcasters\NullBroadcaster);

        $this->call(UsersSeeder::class);
        $this->call(FriendsSeeder::class);
        $this->call(PostsSeeder::class);
        $this->call(DemoUserSeeder::class);
    }
}
