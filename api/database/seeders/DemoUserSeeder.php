<?php

namespace Database\Seeders;

use App\Models\Chat\ChatMessage;
use App\Models\Chat\ChatParticipant;
use App\Models\Chat\ChatRoom;
use App\Models\Friend\Friend;
use App\Models\Friend\FriendsPending;
use App\Models\Post\Post;
use App\Models\Post\PostsComment;
use App\Models\Post\PostsCommentsReaction;
use App\Models\Post\PostsCommentsRepliesReaction;
use App\Models\Post\PostsCommentsReply;
use App\Models\Post\PostsImage;
use App\Models\Post\PostsReaction;
use App\Models\Post\PostsSharing;
use App\Models\Post\PostsVideo;
use App\Models\User\Skill;
use App\Models\User\User;
use App\Models\User\UsersProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $demo = User::factory()->create();
//        $demo = User::where('id', '102')->first();
        if (!$demo) return;

        $demo->profile()->save(UsersProfile::factory()->state(['user_id' => $demo->id])->create());
        $demo->skills()->saveMany(Skill::all()->random(rand(10, 20)));

        $users = User::all();
        $friends = $users->random(rand(0, (int) ceil($users->count() / 3)));

        foreach ($friends as $friend) {
            if ($friend->id === $demo->id) continue;

            // Friends
            Friend::create(['user_a' => $demo->id, 'user_b' => $friend->id]);
            Friend::create(['user_a' => $friend->id, 'user_b' => $demo->id]);

            // Friends Pendings
            if (rand(0, 2) === 0) {
                FriendsPending::create([
                    'user_id' => $demo->id,
                    'pending_user' => $friend->id,
                    'state' => $demo->hasFriend($friend->id) ? 'accepted' : ['waiting', 'declined'][rand(0, 1)]
                ]);
                FriendsPending::create([
                    'user_id' => $friend->id,
                    'pending_user' => $demo->id,
                    'state' => $demo->hasFriend($friend->id) ? 'accepted' : ['waiting', 'declined'][rand(0, 1)]
                ]);
            }

            if (rand(0, 1) === 0) {
                $chatRoom = ChatRoom::factory()->create();
                $participants = new Collection();

                if ($chatRoom->type === 'group') {
                    $chatRoom->participants()->saveMany(
                        ChatParticipant::factory()->count(rand(2, 5))->state(new Sequence(
                            fn ($sequence) => [
                                'room_id' => $chatRoom->id,
                                'user_id' => $friends->unique()->random()->id,
                            ]
                        ))->create()
                    );
                    $chatRoom->participants()->save(
                        ChatParticipant::factory()->state([
                            'room_id' => $chatRoom->id,
                            'user_id' => $demo->id,
                        ])->create()
                    );
                } else {
                    ChatParticipant::factory()->count(2)->state(new Sequence(
                        fn ($sequence) => [
                            'room_id' => $chatRoom->id,
                            'user_id' => $sequence->index === 0 ? $demo->id : $friend->id,
                        ]
                    ))->create();
                }

                $participants = $chatRoom->participants;

                $participants->each(function ($participant) use ($chatRoom) {
                    ChatMessage::factory()->count(rand(1, 100))->state(new Sequence(
                        fn ($sequence) => [
                            'room_id' => $chatRoom->id,
                            'user_id' => $participant->user_id,
                        ]
                    ))->create();
                });

                $chatRoom->update([
                    'last_message' => $chatRoom->messages()->latest()->first()->body,
                    'last_message_by' => $chatRoom->messages()->latest()->first()->user_id
                ]);
            }
        }

        $posts = Post::factory()->count(rand(6, 12))->state(new Sequence(
            fn ($sequence) => ['user_id' => $demo->id],
        ))->create();

        foreach ($posts as $post) {

            // Images
            if (rand(0, 1)) {
                PostsImage::factory()->state(['post_id' => $post->id])->create();
            }

            // Videos
            if (!$post->image()->count() && rand(0, 1)) {
                PostsVideo::factory()->state(['post_id' => $post->id])->create();
            }


            $demoFriends = $demo->friends()->pluck('user_b')->toArray();

            // Reactions
            $post->reactions()->saveMany(PostsReaction::factory()->count(rand(0, count($demoFriends)))->state(new Sequence(
                fn ($sequence) => [
                    'post_id' => $post->id,
                    'user_id' => $demoFriends[$sequence->index]
                ]
            ))->create());

            shuffle($demoFriends); // -------------------------------------------

            // Sharings
            $post->sharings()->saveMany(PostsSharing::factory()->count(rand(0, ceil(count($demoFriends) / 6)))->state(new Sequence(
                fn ($sequence) => [
                    'post_id' => $post->id,
                    'user_id' => $demoFriends[$sequence->index]
                ]
            ))->create());

            shuffle($demoFriends); // -------------------------------------------

            // Comments
            $comments = $post->comments()->saveMany(PostsComment::factory()->count(rand(0, ceil(count($demoFriends) / 3)))->state(new Sequence(
                fn ($sequence) => [
                    'post_id' => $post->id,
                    'user_id' => $demoFriends[$sequence->index]
                ]
            ))->create());

            foreach ($comments as $comment) {
                shuffle($demoFriends); // -------------------------------------------

                // Comment Reactions
                $comment->reactions()->saveMany(PostsCommentsReaction::factory()->count(rand(0, ceil(count($demoFriends) / 9))))->state(new Sequence(
                    fn ($sequence) => [
                        'comment_id' => $comment->id,
                        'user_id' => $demoFriends[$sequence->index]
                    ]
                ))->create();

                shuffle($demoFriends); // -------------------------------------------

                // Comment Replies
                $replies = $comment->replies()->saveMany(PostsCommentsReply::factory()->count(rand(0, ceil(count($demoFriends) / 9)))->state(new Sequence(
                    fn ($sequence) => [
                        'comment_id' => $comment->id,
                        'user_id' => $demoFriends[$sequence->index]
                    ]
                ))->create());

                foreach ($replies as $reply) {
                    shuffle($demoFriends); // -------------------------------------------

                    // Comment Reply Reactions
                    $reply->reactions()->saveMany(PostsCommentsRepliesReaction::factory()->count(rand(0, ceil(count($demoFriends) / 9))))->state(new Sequence(
                        fn ($sequence) => [
                            'comment_id' => $reply->id,
                            'user_id' => $demoFriends[$sequence->index]
                        ]
                    ))->create();
                }
            }
        }
    }
}
