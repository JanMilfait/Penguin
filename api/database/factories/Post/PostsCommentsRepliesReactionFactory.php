<?php

namespace Database\Factories\Post;

use App\Models\Post\PostsComment;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post\PostsCommentsRepliesReaction>
 */
class PostsCommentsRepliesReactionFactory extends Factory
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
            'reaction' => rand(1, 7)
        ];
    }
}
