<?php

namespace App\Observers\Post;

use App\Events\SendNotification;
use App\Models\Post\PostsCommentsReply;
use Str;

class PostsCommentsReplyObserver
{
    /**
     * Handle the PostsCommentsReply "created" event.
     *
     * @param  \App\Models\Post\PostsCommentsReply  $reply
     * @return void
     */
    public function created(PostsCommentsReply $reply)
    {
        // Don't send notification if replying to own comment
        if ($reply->comment->user_id === $reply->user_id) {
            return;
        }

        broadcast(new SendNotification($reply->comment->user->id, 'reply', $reply->id, [
            'source' => 'reply',
            'source_id' => $reply->id,
            'preview' => Str::limit($reply->body, 50),
            'id' => $reply->user->id,
            'name' => $reply->user->name,
            'avatar' => $reply->user->avatar_name ? $reply->user->avatar_url . '50_' . $reply->user->avatar_name : null
        ]));
    }

    /**
     * Handle the PostsCommentsReply "updated" event.
     *
     * @param  \App\Models\Post\PostsCommentsReply  $reply
     * @return void
     */
    public function updated(PostsCommentsReply $reply)
    {
        //
    }

    /**
     * Handle the PostsCommentsReply "deleted" event.
     *
     * @param  \App\Models\Post\PostsCommentsReply  $reply
     * @return void
     */
    public function deleted(PostsCommentsReply $reply)
    {
        //
    }

    /**
     * Handle the PostsCommentsReply "restored" event.
     *
     * @param  \App\Models\Post\PostsCommentsReply  $reply
     * @return void
     */
    public function restored(PostsCommentsReply $reply)
    {
        //
    }

    /**
     * Handle the PostsCommentsReply "force deleted" event.
     *
     * @param  \App\Models\Post\PostsCommentsReply  $reply
     * @return void
     */
    public function forceDeleted(PostsCommentsReply $reply)
    {
        //
    }
}
