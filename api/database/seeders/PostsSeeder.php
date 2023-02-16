<?php

namespace Database\Seeders;

use App\Models\Post\Post;
use App\Models\Post\PostsComment;
use App\Models\Post\PostsCommentsReaction;
use App\Models\Post\PostsCommentsRepliesReaction;
use App\Models\Post\PostsCommentsReply;
use App\Models\Post\PostsImage;
use App\Models\Post\PostsReaction;
use App\Models\Post\PostsSharing;
use App\Models\Post\PostsVideo;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class PostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $allPosts = new Collection();
        $users = User::all();

        foreach ($users as $user) {
            $posts = Post::factory()->count(rand(0, 8))->state(new Sequence(
                fn ($sequence) => ['user_id' => $user->id],
            ))->create();

            $allPosts = $allPosts->merge($posts);
        }

        foreach ($allPosts as $post) {

            // Images
            if (rand(0, 1)) {
                PostsImage::factory()->state(['post_id' => $post->id])->create();
            }

            // Videos
            if (!$post->image()->count() && rand(0, 1)) {
                PostsVideo::factory()->state(['post_id' => $post->id])->create();
            }


            $ownerFriends = $post->user->friends()->pluck('user_b')->toArray();

            // Reactions
            $post->reactions()->saveMany(PostsReaction::factory()->count(rand(0, count($ownerFriends)))->state(new Sequence(
                fn ($sequence) => [
                    'post_id' => $post->id,
                    'user_id' => $ownerFriends[$sequence->index]
                ]
            ))->create());

            shuffle($ownerFriends); // -------------------------------------------

            // Sharings
            $post->sharings()->saveMany(PostsSharing::factory()->count(rand(0, ceil(count($ownerFriends) / 6)))->state(new Sequence(
                fn ($sequence) => [
                    'post_id' => $post->id,
                    'user_id' => $ownerFriends[$sequence->index]
                ]
            ))->create());

            shuffle($ownerFriends); // -------------------------------------------

            // Comments
            $comments = $post->comments()->saveMany(PostsComment::factory()->count(rand(0, ceil(count($ownerFriends) / 3)))->state(new Sequence(
                fn ($sequence) => [
                    'post_id' => $post->id,
                    'user_id' => $ownerFriends[$sequence->index]
                ]
            ))->create());

            foreach ($comments as $comment) {
                shuffle($ownerFriends); // -------------------------------------------

                // Comment Reactions
                $comment->reactions()->saveMany(PostsCommentsReaction::factory()->count(rand(0, ceil(count($ownerFriends) / 9))))->state(new Sequence(
                    fn ($sequence) => [
                        'comment_id' => $comment->id,
                        'user_id' => $ownerFriends[$sequence->index]
                    ]
                ))->create();

                shuffle($ownerFriends); // -------------------------------------------

                // Comment Replies
                $replies = $comment->replies()->saveMany(PostsCommentsReply::factory()->count(rand(0, ceil(count($ownerFriends) / 9)))->state(new Sequence(
                    fn ($sequence) => [
                        'comment_id' => $comment->id,
                        'user_id' => $ownerFriends[$sequence->index]
                    ]
                ))->create());

                foreach ($replies as $reply) {
                    shuffle($ownerFriends); // -------------------------------------------

                    // Comment Reply Reactions
                    $reply->reactions()->saveMany(PostsCommentsRepliesReaction::factory()->count(rand(0, ceil(count($ownerFriends) / 9))))->state(new Sequence(
                        fn ($sequence) => [
                            'comment_id' => $reply->id,
                            'user_id' => $ownerFriends[$sequence->index]
                        ]
                    ))->create();
                }
            }
        }
    }
}
