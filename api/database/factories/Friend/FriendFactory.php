<?php

namespace Database\Factories\Friend;

use App\Models\Friend\Friend;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class FriendFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $users = User::all()->pluck('id')->toArray();

        $user_a = fake()->randomElement($users);
        $user_b = fake()->randomElement(array_diff($users, [$user_a]));

        return [
            'user_a' => $user_a,
            'user_b' => $user_b,
        ];
    }
}
