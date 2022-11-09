<?php

namespace App\Http\Controllers;

use App\Models\Post\PostsComment;
use App\Models\Post\PostsCommentsReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostCommentReplyController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request      $request
     * @param PostsComment $comment
     * @return JsonResponse
     */
    public function store(Request $request, PostsComment $comment)
    {
        $request->validate([
            'body' => ['required', 'string', 'max:8000'],
        ]);

        $reply = $comment->replies()->create([
            'comment_id' => $comment->id,
            'user_id' => $request->user()->id,
            'body' => $request->input('body')
        ]);

        return response()->json($reply->load('user'));
    }


    /**
     * Display the specified resource.
     *
     * @param Request      $request
     * @param PostsComment $comment
     * @return JsonResponse
     */
    public function show(Request $request, PostsComment $comment)
    {
        $replies = $comment->replies()
            ->with('user', 'reactions', 'reactions.user')
            ->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 10)
            ->get();

        return response()->json($replies);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request            $request
     * @param PostsCommentsReply $reply
     * @return JsonResponse
     */
    public function update(Request $request, PostsCommentsReply $reply)
    {
        if ($request->user()->id !== $reply->user_id) {
            return response()->json(['message' => 'Cannot edit this comment.'], 403);
        }

        $request->validate([
            'body' => ['required', 'string', 'max:8000'],
        ]);

        $reply->update([
            'body' => $request->input('body')
        ]);

        $reply->load('user', 'reactions', 'reactions.user');

        return response()->json($reply);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param Request            $request
     * @param PostsCommentsReply $reply
     * @return JsonResponse
     */
    public function destroy(Request $request, PostsCommentsReply $reply)
    {
        if ($request->user()->id !== $reply->user_id) {
            return response()->json(['message' => 'Cannot delete this comment.'], 403);
        }

        $reply->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }


    /**
     * React to reply.
     *
     * @param Request            $request
     * @param PostsCommentsReply $reply
     * @return JsonResponse
     */
    public function store_reaction(Request $request, PostsCommentsReply $reply)
    {
        $request->validate([
            'reaction' => ['required', 'integer', 'min:1', 'max:7'],
        ]);

        $reply->reactions()->updateOrCreate([
            'comment_id' => $reply->id,
            'user_id' => $request->user()->id,
        ], [
            'reaction' => $request->input('reaction')
        ]);

        $reply->load('user', 'reactions', 'reactions.user');

        return response()->json($reply);
    }


    /**
     * Remove reaction from reply.
     *
     * @param Request            $request
     * @param PostsCommentsReply $reply
     * @return JsonResponse
     */
    public function destroy_reaction(Request $request, PostsCommentsReply $reply)
    {
        $reply->reactions()->where([
            'comment_id' => $reply->id,
            'user_id' => $request->user()->id,
        ])->delete();

        return response()->json(['message' => 'Reaction deleted successfully.']);
    }
}
