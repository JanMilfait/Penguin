<?php

namespace App\Observers\Post;

use App\Events\SendNotification;
use App\Models\Post\Post;
use Cache;
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
        foreach (range(0, 100) as $i) {
            Cache::forget('posts:user:' . $post->user->id . ':page:' . $i);
        }

        $post->user->friends->each(function ($friend) use ($post) {
            broadcast(new SendNotification($friend->user->id, 'post', $post->id,[
                'source' => 'post',
                'source_id' => $post->id,
                'preview' => Str::limit($post->body, 50),
                'id' => $post->user->id,
                'name' => $post->user->name,
                'avatar' => $post->user->avatar_name ? $post->user->avatar_url . '50_' . $post->user->avatar_name : null
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
        foreach (range(0, 100) as $i) {
            Cache::forget('posts:user:' . $post->user->id . ':page:' . $i);
        }
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
