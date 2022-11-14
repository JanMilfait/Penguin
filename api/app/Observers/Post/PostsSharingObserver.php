<?php

namespace App\Observers\Post;

use App\Events\SendNotification;
use App\Models\Post\PostsSharing;
use Str;

class PostsSharingObserver
{
    /**
     * Handle the PostsSharing "created" event.
     *
     * @param  \App\Models\Post\PostsSharing  $sharing
     * @return void
     */
    public function created(PostsSharing $sharing)
    {
        broadcast(new SendNotification($sharing->post->user->id, 'sharing', $sharing->id, [
            'source' => 'sharing',
            'source_id' => $sharing->post->id,
            'preview' => Str::limit($sharing->post->body, 50),
            'id' => $sharing->user->id,
            'name' => $sharing->user->name,
            'avatar' => $sharing->user->avatar_name ? $sharing->user->avatar_url . '40_' . $sharing->user->avatar_name : null
        ]));
    }

    /**
     * Handle the PostsSharing "updated" event.
     *
     * @param  \App\Models\Post\PostsSharing  $sharing
     * @return void
     */
    public function updated(PostsSharing $sharing)
    {
        //
    }

    /**
     * Handle the PostsSharing "deleted" event.
     *
     * @param  \App\Models\Post\PostsSharing  $sharing
     * @return void
     */
    public function deleted(PostsSharing $sharing)
    {
        //
    }

    /**
     * Handle the PostsSharing "restored" event.
     *
     * @param  \App\Models\Post\PostsSharing  $sharing
     * @return void
     */
    public function restored(PostsSharing $sharing)
    {
        //
    }

    /**
     * Handle the PostsSharing "force deleted" event.
     *
     * @param  \App\Models\Post\PostsSharing  $sharing
     * @return void
     */
    public function forceDeleted(PostsSharing $sharing)
    {
        //
    }
}
