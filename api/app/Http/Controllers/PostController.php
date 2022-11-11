<?php

namespace App\Http\Controllers;

use App\Models\Post\Post;
use App\Models\User\User;
use App\Services\PostImage;
use App\Services\PostMetadata;
use App\Services\PostVideo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PostController extends Controller
{
    /**
     * Feed posts for logged user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public  function feed (Request $request)
    {
        $posts = Post::where('user_id', $request->user()->id)
            ->orWhereIn('user_id', $request->user()->friends()->pluck('user_b'))
            ->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 3)
            ->get();

        $posts = $posts->map(function ($post) {
            return PostMetadata::append($post);
        });

        return response()->json($posts);
    }

    /**
     * Display user's posts.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function index(Request $request, User $user)
    {
        $posts = $user->posts()->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 3)
            ->get();

        $posts->map(function ($post) {
            return PostMetadata::append($post);
        });

        return response()->json($posts);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'body' => ['required', 'string', 'max:65535'],
            'image' => ['nullable', 'image', 'max:8192', 'dimensions:min_width=600,min_height=300'],
            'video' => ['nullable', 'mimetypes:video/mp4,video/x-m4v,video/*', 'max:104857600'] // TODO: CHANGE MAX IN PRODUCTION
        ]);

        $post = $request->user()->posts()->create($request->only('body'));

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
     * Display post.
     *
     * @param Post    $post
     * @return JsonResponse
     */
    public function show(Post $post)
    {
        $post = PostMetadata::append($post);

        return response()->json($post);
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
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Post does not belong to user.'], 403);
        }

        $request->validate([
            'body' => ['string', 'max:65535'],
            'image' => ['nullable', 'image', 'max:8192', 'dimensions:min_width=600,min_height=300'],
            'video' => ['nullable', 'mimetypes:video/mp4,video/x-m4v,video/*', 'max:104857600']
        ]);

        $post->update($request->only('body'));

        if ($request->hasFile('image')) {
            $response = PostImage::save($request->file('image'), $post);

            if (isset($response['error'])) {
                return response()->json(['error' => $response['error']], 500);
            }

            $post->image && PostImage::delete($post);
            $post->video && PostVideo::delete($post);

            $post->image()->updateOrCreate([
                'id' => $post->image->id ?? null
            ], [
                'name' => $response['name'],
                'url' => $response['url']
            ]);
            $post->video()->delete();
        }

        if ($request->hasFile('video')) {
            $response = PostVideo::save($request->file('video'), $post);

            if (isset($response['error'])) {
                return response()->json(['error' => $response['error']], 500);
            }

            $post->image && PostImage::delete($post);
            $post->video && PostVideo::delete($post);

            $post->image()->delete();
            $post->video()->updateOrCreate([
                'id' => $post->video->id ?? null
            ], [
                'name' => $response['name'],
                'url' => $response['url']
            ]);
        }

        $post = PostMetadata::append($post);

        return response()->json($post);
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
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Post does not belong to user.'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully.']);
    }


    /**
     * Share post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function share(Request $request, Post $post)
    {
        $post->sharings()->firstOrCreate([
            'post_id' => $post->id,
            'user_id' => $request->user()->id
        ]);

        return response()->json(['message' => 'Post shared successfully.']);
    }


    /**
     * Unshare post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function unshare(Request $request, Post $post)
    {
        $post->sharings()->where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Post unshared successfully.']);
    }


    /**
     * React to post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function store_reaction(Request $request, Post $post)
    {
        $request->validate([
            'reaction' => ['required', 'integer', 'min:1', 'max:7'],
        ]);

        $post->reactions()->updateOrCreate([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
        ], [
            'reaction' => $request->input('reaction')
        ]);

        $post = PostMetadata::append($post);

        return response()->json($post);
    }


    /**
     * Remove reaction from post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function destroy_reaction(Request $request, Post $post)
    {
        $post->reactions()->where([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
        ])->delete();

        return response()->json(['message' => 'Reaction deleted successfully.']);
    }
}
