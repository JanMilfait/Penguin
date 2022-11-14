<?php

namespace App\Observers\Post;

use App\Events\SendNotification;
use App\Models\Post\Post;
use Str;

class PostObserver
{
    /**
     * Handle the Post "created" event.
     *
     * @param  \App\Models\Post\Post  $post
     * @return void
     */
    public function created(Post $post)
    {
        $post->user->friends->each(function ($friend) use ($post) {
            broadcast(new SendNotification($friend->user->id, 'post', $post->id,[
                'source' => 'post',
                'source_id' => $post->id,
                'preview' => Str::limit($post->body, 50),
                'id' => $post->user->id,
                'name' => $post->user->name,
                'avatar' => $post->user->avatar_url . '40_' . $post->user->avatar_name
            ]));
        });
    }

    /**
     * Handle the Post "updated" event.
     *
     * @param  \App\Models\Post\Post  $post
     * @return void
     */
    public function updated(Post $post)
    {
        //
    }

    /**
     * Handle the Post "deleted" event.
     *
     * @param  \App\Models\Post\Post  $post
     * @return void
     */
    public function deleted(Post $post)
    {
        //
    }

    /**
     * Handle the Post "restored" event.
     *
     * @param  \App\Models\Post\Post  $post
     * @return void
     */
    public function restored(Post $post)
    {
        //
    }

    /**
     * Handle the Post "force deleted" event.
     *
     * @param  \App\Models\Post\Post  $post
     * @return void
     */
    public function forceDeleted(Post $post)
    {
        //
    }
}
