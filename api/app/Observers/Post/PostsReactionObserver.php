<?php

namespace App\Observers\Post;

use App\Models\Post\PostsReaction;

class PostsReactionObserver
{
    /**
     * Handle the PostsReaction "created" event.
     *
     * @param  \App\Models\Post\PostsReaction  $reaction
     * @return void
     */
    public function created(PostsReaction $reaction)
    {
        $reaction->post->reactionScore('inc');
    }

    /**
     * Handle the PostsReaction "updated" event.
     *
     * @param  \App\Models\Post\PostsReaction  $reaction
     * @return void
     */
    public function updated(PostsReaction $reaction)
    {
        //
    }

    /**
     * Handle the PostsReaction "deleted" event.
     *
     * @param  \App\Models\Post\PostsReaction  $reaction
     * @return void
     */
    public function deleted(PostsReaction $reaction)
    {
        $reaction->post->reactionScore('dec');
    }

    /**
     * Handle the PostsReaction "restored" event.
     *
     * @param  \App\Models\Post\PostsReaction  $reaction
     * @return void
     */
    public function restored(PostsReaction $reaction)
    {
        //
    }

    /**
     * Handle the PostsReaction "force deleted" event.
     *
     * @param  \App\Models\Post\PostsReaction  $reaction
     * @return void
     */
    public function forceDeleted(PostsReaction $reaction)
    {
        //
    }
}
