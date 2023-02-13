<?php

namespace Database\Factories\UserProfile;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User\UsersProfile>
 */
class UserProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'age' => fake()->numberBetween(18,79),
            'description' => '',
            'telephone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'nationality' => fake()->country()
        ];
    }
}
