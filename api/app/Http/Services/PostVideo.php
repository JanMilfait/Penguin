<?php

namespace App\Http\Services;

use App\Jobs\CompressVideos;
use FFMpeg\FFMpeg;
use Illuminate\Support\Str;
use Image;

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

        $posterName = Str::uuid() . '.jpg';
        $posterPath = public_path('storage/posts/videos/poster/');
        $posterPlaceholderPath = public_path('storage/posts/videos/poster/placeholder/');

        if (!file_exists($videosPath)) {
            mkdir($videosPath, 0775, true);
        }

        if (!file_exists($posterPath)) {
            mkdir($posterPath, 0775, true);
        }

        if (!file_exists($posterPlaceholderPath)) {
            mkdir($posterPlaceholderPath, 0775, true);
        }

        /**
         * 1. Add job to queue to compress video.
         * 2. Save frame from middle of video as poster with 700px width.
         * 3. Create placeholder image from poster.
         */
        if ($video->move($videosPath, $videoName)) {
            CompressVideos::dispatch($videosPath . $videoName, $videoName);

            $ffmpeg = FFMpeg::create([
                'ffmpeg.binaries' => '/usr/bin/ffmpeg',
                'ffprobe.binaries' => '/usr/bin/ffprobe',
                'timeout' => 1800
            ]);

            $video = $ffmpeg->open($videosPath . $videoName);
            $seconds = $video->getStreams()->videos()->first()->get('duration') / 2;
            $frame = $video->frame(\FFMpeg\Coordinate\TimeCode::fromSeconds($seconds));
            $frame->save($posterPath . '700_' . $posterName);

            $image700 = Image::make($posterPath . '700_' . $posterName)->widen(700);
            $image700->save($posterPath . '700_' . $posterName, 90, 'jpg');
            $image700->pixelate(10);
            $image700->save($posterPlaceholderPath . '700_' . $posterName, 0, 'jpg');

            return [
                'name' => $videoName,
                'url' => env('APP_URL') . '/posts/videos/',
                'poster' => env('APP_URL') . '/storage/posts/videos/poster/700_' . $posterName
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
