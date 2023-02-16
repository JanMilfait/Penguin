<?php

namespace Database\Factories\Post;

use App\Models\Post\PostsComment;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post\PostsCommentsReply>
 */
class PostsCommentsReplyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'comment_id' => PostsComment::factory(),
            'user_id' => User::factory(),
            'body' => $this->faker->paragraph(rand(1, 3))
        ];
    }
}
