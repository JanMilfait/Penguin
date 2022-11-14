<?php

namespace App\Http\Controllers;

use App\Models\Post\Post;
use App\Models\Post\PostsComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PostCommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'body' => ['required', 'string', 'max:8000'],
        ]);

        $comment = $post->comments()->create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'body' => $request->input('body')
        ]);

        return response()->json($comment->load('user'));
    }


    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function show(Request $request, Post $post)
    {
        $comments = $post->comments()
            ->with('user', 'replies.user', 'replies.reactions.user', 'reactions.user')
            ->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 10)
            ->get();

        return response()->json($comments);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request      $request
     * @param PostsComment $comment
     * @return JsonResponse
     */
    public function update(Request $request, PostsComment $comment)
    {
        if ($request->user()->id !== $comment->user_id) {
            return $this->jsonError('Cannot edit this comment.', 403);
        }

        $request->validate([
            'body' => ['required', 'string', 'max:8000'],
        ]);

        $comment->update([
            'body' => $request->input('body')
        ]);

        $comment->load('user', 'replies.user', 'replies.reactions.user', 'reactions.user');

        return response()->json($comment);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param Request      $request
     * @param PostsComment $comment
     * @return JsonResponse
     */
    public function destroy(Request $request, PostsComment $comment)
    {
        if ($request->user()->id !== $comment->user_id) {
            return $this->jsonError('Cannot delete this comment.', 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }


    /**
     * React to comment.
     *
     * @param Request      $request
     * @param PostsComment $comment
     * @return JsonResponse
     */
    public function store_reaction(Request $request, PostsComment $comment)
    {
        $request->validate([
            'reaction' => ['required', 'integer', 'min:1', 'max:7'],
        ]);

        $comment->reactions()->updateOrCreate([
            'comment_id' => $comment->id,
            'user_id' => $request->user()->id,
        ], [
            'reaction' => $request->input('reaction')
        ]);

        $comment->load('user', 'replies.user', 'replies.reactions.user', 'reactions.user');

        return response()->json($comment);
    }


    /**
     * Remove reaction from comment.
     *
     * @param Request      $request
     * @param PostsComment $comment
     * @return JsonResponse
     */
    public function destroy_reaction(Request $request, PostsComment $comment)
    {
        $comment->reactions()->where([
            'comment_id' => $comment->id,
            'user_id' => $request->user()->id,
        ])->delete();

        return response()->json(['message' => 'Reaction deleted successfully.']);
    }
}
