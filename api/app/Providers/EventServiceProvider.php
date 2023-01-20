<?php

namespace App\Providers;

use App\Models\Chat\ChatMessage;
use App\Models\Chat\ChatParticipant;
use App\Models\Friend\FriendsPending;
use App\Models\Post\Post;
use App\Models\Post\PostsComment;
use App\Models\Post\PostsCommentsReaction;
use App\Models\Post\PostsCommentsRepliesReaction;
use App\Models\Post\PostsCommentsReply;
use App\Models\Post\PostsReaction;
use App\Models\Post\PostsSharing;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\SendNotification;
use App\Listeners\SaveNotification;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        ChatMessage::class => \App\Observers\Chat\ChatMessageObserver::class,
        ChatParticipant::class => \App\Observers\Chat\ChatParticipantObserver::class,
        FriendsPending::class => \App\Observers\Friend\FriendsPendingObserver::class,
        Post::class => \App\Observers\Post\PostObserver::class,
        PostsComment::class => \App\Observers\Post\PostsCommentObserver::class,
        PostsCommentsReaction::class => \App\Observers\Post\PostsCommentsReactionObserver::class,
        PostsCommentsRepliesReaction::class => \App\Observers\Post\PostsCommentsRepliesReactionObserver::class,
        PostsCommentsReply::class => \App\Observers\Post\PostsCommentsReplyObserver::class,
        PostsReaction::class => \App\Observers\Post\PostsReactionObserver::class,
        PostsSharing::class => \App\Observers\Post\PostsSharingObserver::class
    ];

    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        SendNotification::class => [
            SaveNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
