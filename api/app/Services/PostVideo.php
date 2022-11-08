<?php

namespace App\Services;

use App\Jobs\CompressVideos;
use Illuminate\Support\Str;

class PostVideo
{
    /**
     * Save post video.
     *
     * @param $video
     * @param $post
     * @return array
     */
    public static function save($video, $post)
    {
        $videoName = $post->id . Str::random(40) . '.' . $video->getClientOriginalExtension();
        $videosPath = public_path('storage/posts/videos/');

        if (!file_exists($videosPath)) {
            mkdir($videosPath, 0775, true);
        }

        if ($video->move($videosPath, $videoName)) {
            CompressVideos::dispatch($videosPath . $videoName, $videoName);

            return [
                'name' => $videoName,
                'url' => env('APP_URL') . '/storage/posts/videos/'
            ];
        }
    }
}
