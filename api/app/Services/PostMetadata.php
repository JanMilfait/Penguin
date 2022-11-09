<?php

namespace App\Services;

class PostMetadata
{
    /**
     * Append metadata to post.
     *
     * @param $post
     * @return array
     */
    public static function append($post)
    {
        $post->comments_count = $post->comments()->count();
        $post->most_reacted_comment = $post->comments()
            ->with('user', 'replies', 'replies.user', 'replies.reactions', 'replies.reactions.user', 'reactions', 'reactions.user')
            ->withCount('reactions')
            ->orderBy('reactions_count', 'desc')
            ->first();

        return $post->load('user', 'image', 'video', 'sharings.user', 'reactions.user');
    }
}
