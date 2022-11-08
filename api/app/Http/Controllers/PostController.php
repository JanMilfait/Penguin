<?php

namespace App\Http\Controllers;

use App\Models\Post\Post;
use App\Models\User\User;
use App\Services\PostImage;
use App\Services\PostVideo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Image;

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
        $user = $request->user();

        $request->validate([
            'body' => ['required', 'string', 'max:65535'],
            'image' => ['nullable', 'image', 'max:8192', 'dimensions:min_width=600,min_height=300'],
            'video' => ['nullable', 'mimetypes:video/mp4,video/x-m4v,video/*', 'max:104857600'], // TODO: CHANGE IN PRODUCTION
        ]);

        $post = $user->posts()->create($request->only('body'));

        if ($request->hasFile('image')) {
            $response = PostImage::save($request->file('image'), $post);

            if (isset($response['error'])) {
                return response()->json(['error' => $response['error']], 500);
            }

            $post->image()->create([
                'name' => $response['name'],
                'url' => $response['url']
            ]);
        }

        if ($request->hasFile('video')) {
            $response = PostVideo::save($request->file('video'), $post);

            if (isset($response['error'])) {
                return response()->json(['error' => $response['error']], 500);
            }

            $post->video()->create([
                'name' => $response['name'],
                'url' => $response['url']
            ]);
        }

        return response()->json($post, 201);
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
