<?php

namespace Database\Factories\Post;

use App\Models\Post\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post\PostsImage>
 */
class PostsImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'post_id' => Post::factory(),
            'name' => $this->faker->numberBetween(1, 137) . '.jpg',
            'url' => env('APP_URL') . '/storage/posts/images/'
        ];
    }
}
