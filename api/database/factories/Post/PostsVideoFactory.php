<?php

namespace Database\Factories\Post;

use App\Models\Post\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post\PostsVideo>
 */
class PostsVideoFactory extends Factory
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
            'name' => '04066bc8-38ba-470a-a009-bd9085e56924.mp4',
            'url' => env('APP_URL') . '/posts/videos/',
            'poster' => env('APP_URL') . '/storage/posts/videos/poster/' . '700_b9bcc12d-4e8c-4f08-bac4-9a4a98a8ce4c.jpg'
        ];
    }
}
