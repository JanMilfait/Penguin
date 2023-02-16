<?php

namespace App\Http\Controllers;

use App\Http\Services\PostImage;
use App\Http\Services\PostMetadata;
use App\Http\Services\PostVideo;
use App\Http\Services\UserPrivacy;
use App\Models\Post\Post;
use App\Models\User\Notification;
use App\Models\User\User;
use Cache;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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
        $page = (int) $request->get('page', 1);
        $limit = (int) $request->get('limit', 6);
        $offset = ($page - 1) * $limit;

        $category = $request->get('category', 'latest');
        $media = $request->get('media', 'all');

        $posts = Post::whereIn('user_id', $request->user()->friends()->pluck('user_b')->push($request->user()->id));

        if ($category === 'shared') {
            $posts->whereIn('id', DB::table('posts_sharing')->where('user_id', $request->user()->id)->pluck('post_id'));

        } elseif ($category === 'trending') {
            $posts->orderBy('interaction_score', 'desc')
                ->where('created_at', '>=', now()->subDays($request->get('trending-days', 7)));
        }

        if ($media === 'photo') {
            $posts->has('image');

        } elseif ($media === 'video') {
            $posts->has('video');
        }

        $posts = $posts->latest('updated_at')
            ->limit($limit)
            ->offset($offset)
            ->get();

        $posts->map(function ($post) {
            return PostMetadata::append($post);
        });

        return response()->json([
            'items' => $posts,
            'page' => $page,
            'limit' => $limit
        ]);
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
        $page = (int) $request->get('page', 1);
        $limit = (int) $request->get('limit', 6);
        $offset = ($page - 1) * $limit;

        if (UserPrivacy::isPrivate($user)) {
            return response()->json([
                'items' => [],
                'page' => $page,
                'limit' => $limit
            ]);
        }

        $posts = Cache::remember('posts:user:' . $user->id . ':page:' . $page, 86400, function () use ($user, $limit, $offset) {
            return $user->posts()
                ->latest('updated_at')
                ->limit($limit)
                ->offset($offset)
                ->get();
        });

        $posts->map(function ($post) {
            return PostMetadata::append($post);
        });

        return response()->json([
            'items' => $posts,
            'page' => $page,
            'limit' => $limit
        ]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        if ($request->user()->posts()->where('created_at', '>=', now()->subHours())->count() >= 3) {
            return response()->json([
                'message' => 'You can\'t add more than 3 posts per hour.',
                'validationErrors' => [
                    'body' => ['You can\'t add more than 3 posts per hour.']
                ]
            ], 403);
        }

        $request->validate([
            'body' => ['required', 'string', 'max:65535'],
            'image' => ['nullable', 'mimes:jpeg,png,jpg,gif,svg', 'dimensions:min_width=300,min_height=150', 'max:8192'],
            'video' => ['nullable', 'mimes:mp4,mov,ogg,webm', 'max:52428800']
        ], [
            'body.required' => 'Please enter some text of your post.',
            'image.dimensions' => 'The image must be at least 300x150 pixels.'
        ]);

        if ($request->hasFile('image') && $request->hasFile('video')) {
            return response()->json([
                'message' => 'Post can\'t have both image and video.'
            ], 422);
        }

        $post = $request->user()->posts()->create([
            'slug' => Str::slug(Str::limit($request->get('body'), 30) . ' ' . Str::random(5)),
            'body' => $request->get('body')
        ]);

        if ($request->hasFile('image')) {
            $response = PostImage::save($request->file('image'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $post->image()->create([
                'name' => $response['name'],
                'url' => $response['url']
            ]);
        }

        if ($request->hasFile('video')) {
            $response = PostVideo::save($request->file('video'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $post->video()->create([
                'name' => $response['name'],
                'url' => $response['url'],
                'poster' => $response['poster']
            ]);
        }

        return response()->json(['message' => 'Post created']);
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
            return $this->jsonError('Post does not belong to user.', 403);
        }

        $request->validate([
            'body' => ['string', 'max:65535'],
            'image' => ['nullable', 'mimes:jpeg,png,jpg,gif,svg', 'dimensions:min_width=300,min_height=150', 'max:8192'],
            'video' => ['nullable', 'mimes:mp4,mov,ogg,webm', 'max:104857600']
        ], [
            'image.dimensions' => 'The image must be at least 300x150 pixels.'
        ]);

        // If body is changed, generate new slug and add it to redirects
        if ($request->has('body')) {
            $slug = Str::slug(Str::limit($request->get('body'), 30) . ' ' . Str::random(5));

            DB::table('posts_redirects')->insert([
                'old_slug' => $post->slug,
                'new_slug' => $slug,
                'created_at' => now()
            ]);
            $request->merge(['slug' => $slug]);
        }

        $userUpdate = ['body', 'slug'];
        if ($this->requestHasOne($userUpdate)) {
            $post->update($request->only($userUpdate));
        }

        if ($request->hasFile('image')) {
            $response = PostImage::save($request->file('image'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
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
            $response = PostVideo::save($request->file('video'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $post->image && PostImage::delete($post);
            $post->video && PostVideo::delete($post);

            $post->image()->delete();
            $post->video()->updateOrCreate([
                'id' => $post->video->id ?? null
            ], [
                'name' => $response['name'],
                'url' => $response['url'],
                'poster' => $response['poster']
            ]);
        }

        // TODO: Laravel file driver doesn't support cache tags, use redis or memcached in real project
        foreach (range(0, 1000) as $i) {
            Cache::forget('posts:user:' . $post->user->id . ':page:' . $i);
        }

        return response()->json(['message' => 'Post updated']);
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
            return $this->jsonError('Post does not belong to user.', 403);
        }

        $post->delete();

        Notification::where('source_id', $post->id)
            ->whereIn('source', ['message', 'post', 'comment', 'reply', 'sharing'])
            ->delete();

        return response()->json(['message' => 'Post deleted']);
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
        if ($post->user_id === $request->user()->id) {
            return $this->jsonError('Cannot share own post.', 403);
        }

        $post->sharings()->firstOrCreate([
            'post_id' => $post->id,
            'user_id' => $request->user()->id
        ]);

        return response()->json(['message' => 'Post shared']);
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

        return response()->json(['message' => 'Post unshared']);
    }


    /**
     * React to post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function react(Request $request, Post $post)
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

        return response()->json(['message' => 'Reaction added']);
    }


    /**
     * Unreact post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function unreact(Request $request, Post $post)
    {
        $post->reactions()->where([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
        ])->delete();

        return response()->json(['message' => 'Reaction deleted']);
    }


    /**
     * Report post.
     *
     * @param Request $request
     * @param Post    $post
     * @return JsonResponse
     */
    public function report(Request $request, Post $post)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500']
        ]);

        if ($post->user_id === $request->user()->id) {
            return $this->jsonError('Can\'t report your own post.', 403);
        }

        if ($post->reports()->where('user_id', $request->user()->id)->exists()) {
            return $this->jsonError('Post is already reported and is being reviewed.', 403);
        }

        $post->reports()->firstOrCreate([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'reason' => $request->input('reason')
        ]);

        return response()->json(['message' => 'Post reported']);
    }


    /**
     * Video with range header support.
     *
     * @param $video
     * @return JsonResponse | BinaryFileResponse
     */
    public function show_video($video)
    {
        $path = public_path('storage/posts/videos/' . $video);

        if (!file_exists($path)) {
            return $this->jsonError('Video not found.', 404);
        }

        /**
         * If video is not mp4, return it as it is.
         */
        if (pathinfo($path, PATHINFO_EXTENSION) !== 'mp4') {
            return response()->file($path);
        }

        $file = new \Symfony\Component\HttpFoundation\File\File($path);
        $size = $file->getSize();
        $time = date('r', filemtime($path));

        $fm = @fopen($path, 'rb');
        if (!$fm) {
            header("HTTP/1.1 505 Internal server error");
            return $this->jsonError('Internal server error', 500);
        }

        $begin = 0;
        $end = $size - 1;

        if (isset($_SERVER['HTTP_RANGE'])) {
            if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER['HTTP_RANGE'], $matches)) {
                $begin = intval($matches[1]);
                if (!empty($matches[2])) {
                    $end = intval($matches[2]);
                }
            }
        }

        if (isset($_SERVER['HTTP_RANGE'])) {
            header('HTTP/1.1 206 Partial Content');
        } else {
            header('HTTP/1.1 200 OK');
        }

        header("Content-Type: video/mp4");
        header('Cache-Control: public, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Accept-Ranges: bytes');
        header('Content-Length:' . (($end - $begin) + 1));
        if (isset($_SERVER['HTTP_RANGE'])) {
            header("Content-Range: bytes $begin-$end/$size");
        }
        header("Content-Disposition: inline; filename=$video");
        header("Content-Transfer-Encoding: binary");
        header("Last-Modified: $time");

        $cur = $begin;
        fseek($fm, $begin, 0);

        while (!feof($fm) && $cur <= $end && (connection_status() == 0)) {
            print fread($fm, min(1024 * 16, ($end - $cur) + 1));
            $cur += 1024 * 16;
        }

        fclose($fm);
    }
}
