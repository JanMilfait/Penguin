<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Friend\Friend;
use App\Models\User\User;
use App\Models\User\UsersProfile;
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
        User::factory(1)->create()->each(function ($user) {
            $user->profile()->save(UsersProfile::factory()->make());
        });
    }


    private function createFriends($count)
    {
        Friend::factory($count)->create();

        $duplicates = Friend::select('user_a', 'user_b')
            ->groupBy('user_a', 'user_b')
            ->havingRaw('count(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {
            Friend::where('user_a', $duplicate->user_a)
                ->where('user_b', $duplicate->user_b)
                ->where('id', '!=', $duplicate->id)
                ->delete();
        }
    }
}
