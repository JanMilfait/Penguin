<?php

namespace Database\Factories\User;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User\UsersProfile>
 */
class UsersProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'age' => rand(18, 78),
            'description' => '<p><strong>' . $this->faker->sentence() . '</p></strong><p>' . $this->faker->paragraph() . '</p>',
            'telephone' => $this->faker->phoneNumber(),
            'address' => $this->faker->city(),
            'nationality' => $this->faker->country()
        ];
    }
}
