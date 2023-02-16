<?php

namespace Database\Seeders;

use App\Models\Friend\Friend;
use App\Models\Friend\FriendsPending;
use App\Models\User\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FriendsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            $friends = $users->random(rand(0, (int) ceil($users->count() / 3)));

            foreach ($friends as $friend) {
                if ($friend->id !== $user->id) {
                    Friend::create(['user_a' => $user->id, 'user_b' => $friend->id]);
                    Friend::create(['user_a' => $friend->id, 'user_b' => $user->id]);
                }
            }
        }
    }
}

