<?php

namespace App\Observers\Post;

use App\Models\Post\PostsCommentsReaction;

class PostsCommentsReactionObserver
{
    /**
     * Handle the PostsCommentsReaction "created" event.
     *
     * @param  \App\Models\Post\PostsCommentsReaction  $commentReaction
     * @return void
     */
    public function created(PostsCommentsReaction $commentReaction)
    {
        $commentReaction->comment->post->commentReactionScore('inc');
    }

    /**
     * Handle the PostsCommentsReaction "updated" event.
     *
     * @param  \App\Models\Post\PostsCommentsReaction  $commentReaction
     * @return void
     */
    public function updated(PostsCommentsReaction $commentReaction)
    {
        //
    }

    /**
     * Handle the PostsCommentsReaction "deleted" event.
     *
     * @param  \App\Models\Post\PostsCommentsReaction  $commentReaction
     * @return void
     */
    public function deleted(PostsCommentsReaction $commentReaction)
    {
        $commentReaction->comment->post->commentReactionScore('dec');
    }

    /**
     * Handle the PostsCommentsReaction "restored" event.
     *
     * @param  \App\Models\Post\PostsCommentsReaction  $commentReaction
     * @return void
     */
    public function restored(PostsCommentsReaction $commentReaction)
    {
        //
    }

    /**
     * Handle the PostsCommentsReaction "force deleted" event.
     *
     * @param  \App\Models\Post\PostsCommentsReaction  $commentReaction
     * @return void
     */
    public function forceDeleted(PostsCommentsReaction $commentReaction)
    {
        //
    }
}
