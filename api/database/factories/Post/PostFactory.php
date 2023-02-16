<?php

namespace Database\Factories\Post;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $body = $this->faker->paragraph($this->faker->numberBetween(1, 3));
        $created_at = $this->faker->dateTimeBetween('-1 year');

        return [
            'user_id' => User::factory(),
            'slug' => Str::slug(Str::limit($body, 30) . ' ' . Str::random(5)),
            'body' => $body,
            'interaction_score' => 0,
            'created_at' => $created_at,
            'updated_at' => $created_at
        ];
    }
}
