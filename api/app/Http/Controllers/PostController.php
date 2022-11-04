<?php

namespace App\Http\Controllers;

use App\Models\Post\Post;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        //
    }


    /**
     * Display user's posts.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function show(Request $request, User $user)
    {
        $posts = $user->posts()->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 3)
            ->get();

        $posts->map(function ($post) {
            $post->sharings = $post->sharings()->with('user')->get();
            $post->reactions = $post->reactions()->with('user')->get();
            $post->comments_count = $post->comments()->count();
            $post->most_reacted_comment = $post->comments()
                ->with('user', 'replies', 'replies.user', 'replies.reactions', 'replies.reactions.user', 'reactions', 'reactions.user')
                ->withCount('reactions')
                ->orderBy('reactions_count', 'desc')
                ->first();

            return $post->load('user', 'image', 'video');
        });

        return response()->json($posts);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function update(Request $request, Post $post)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function destroy(Request $request, Post $post)
    {
        //
    }
}
