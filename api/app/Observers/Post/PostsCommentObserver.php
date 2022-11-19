<?php

namespace App\Observers\Post;

use App\Events\SendNotification;
use App\Models\Post\PostsComment;
use Str;

class PostsCommentObserver
{
    /**
     * Handle the PostsComment "created" event.
     *
     * @param  \App\Models\Post\PostsComment  $comment
     * @return void
     */
    public function created(PostsComment $comment)
    {
        // Don't send notification if commenting own post
        if ($comment->post->user_id === $comment->user_id) {
            return;
        }

        broadcast(new SendNotification($comment->post->user_id, 'comment', $comment->id, [
            'source' => 'comment',
            'source_id' => $comment->id,
            'preview' => Str::limit($comment->body, 50),
            'id' => $comment->user->id,
            'name' => $comment->user->name,
            'avatar' => $comment->user->avatar_name ? $comment->user->avatar_url . '50_' . $comment->user->avatar_name : null
        ]));
    }

    /**
     * Handle the PostsComment "updated" event.
     *
     * @param  \App\Models\Post\PostsComment  $comment
     * @return void
     */
    public function updated(PostsComment $comment)
    {
        //
    }

    /**
     * Handle the PostsComment "deleted" event.
     *
     * @param  \App\Models\Post\PostsComment  $comment
     * @return void
     */
    public function deleted(PostsComment $comment)
    {
        //
    }

    /**
     * Handle the PostsComment "restored" event.
     *
     * @param  \App\Models\Post\PostsComment  $comment
     * @return void
     */
    public function restored(PostsComment $comment)
    {
        //
    }

    /**
     * Handle the PostsComment "force deleted" event.
     *
     * @param  \App\Models\Post\PostsComment  $comment
     * @return void
     */
    public function forceDeleted(PostsComment $comment)
    {
        //
    }
}
