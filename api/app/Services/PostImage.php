<?php

namespace App\Services;

use Illuminate\Support\Str;
use Image;

class PostImage
{
    /**
     * Save post image.
     *
     * @param $image
     * @param $post
     * @return array
     */
    public static function save($image, $post)
    {
        $imageName = $post->id . Str::random(40) . '.jpg';
        $imagesPath = public_path('storage/posts/images/');

        if (!file_exists($imagesPath)) {
            mkdir($imagesPath, 0775, true);
        }

        try {
            $imageOriginal = Image::make($image)->encode('jpg', 80);
            $image600 = Image::make($image)->widen(600)->encode('jpg', 80);

            $imageOriginal->save($imagesPath . $imageName);
            $image600->save($imagesPath . '600_' . $imageName);

            return [
                'name' => $imageName,
                'url' => env('APP_URL') . '/storage/posts/images/'
            ];

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
