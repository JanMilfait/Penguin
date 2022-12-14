<?php

namespace App\Observers\Post;

use App\Models\Post\PostsCommentsRepliesReaction;

class PostsCommentsRepliesReactionObserver
{
    /**
     * Handle the PostsCommentsRepliesReaction "created" event.
     *
     * @param  \App\Models\Post\PostsCommentsRepliesReaction  $replyReaction
     * @return void
     */
    public function created(PostsCommentsRepliesReaction $replyReaction)
    {
        $replyReaction->reply->comment->post->replyReactionScore('inc');
    }

    /**
     * Handle the PostsCommentsRepliesReaction "updated" event.
     *
     * @param  \App\Models\Post\PostsCommentsRepliesReaction  $replyReaction
     * @return void
     */
    public function updated(PostsCommentsRepliesReaction $replyReaction)
    {
        //
    }

    /**
     * Handle the PostsCommentsRepliesReaction "deleted" event.
     *
     * @param  \App\Models\Post\PostsCommentsRepliesReaction  $replyReaction
     * @return void
     */
    public function deleted(PostsCommentsRepliesReaction $replyReaction)
    {
        $replyReaction->reply->comment->post->replyReactionScore('dec');
    }

    /**
     * Handle the PostsCommentsRepliesReaction "restored" event.
     *
     * @param  \App\Models\Post\PostsCommentsRepliesReaction  $replyReaction
     * @return void
     */
    public function restored(PostsCommentsRepliesReaction $replyReaction)
    {
        //
    }

    /**
     * Handle the PostsCommentsRepliesReaction "force deleted" event.
     *
     * @param  \App\Models\Post\PostsCommentsRepliesReaction  $replyReaction
     * @return void
     */
    public function forceDeleted(PostsCommentsRepliesReaction $replyReaction)
    {
        //
    }
}
