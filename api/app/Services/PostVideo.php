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
     * @return array
     */
    public static function save($video)
    {
        $videoName = Str::uuid() . '.' . $video->getClientOriginalExtension();
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

        return ['error' => 'Could not save video.'];
    }


    /**
     * Delete post video.
     *
     * @param $post
     * @return bool
     */
    public static function delete($post)
    {
        $videosPath = public_path('storage/posts/videos/');
        $videoName = $post->video->name;

        if (file_exists($videosPath . $videoName)) {
            return unlink($videosPath . $videoName);
        }

        return true;
    }
}
