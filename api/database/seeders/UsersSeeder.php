<?php

namespace Database\Seeders;

use App\Models\User\Skill;
use App\Models\User\User;
use App\Models\User\UsersProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::factory(100)->create(); // max 600

        $users->random(50)->each(function ($user) { // max 50
            $user->skills_created()->save(Skill::factory()->make());
        });

        $users->each(function ($user) {
            $user->profile()->save(UsersProfile::factory()->make());
            $user->skills()->saveMany(Skill::all()->random(rand(10, 20)));
        });
    }
}
