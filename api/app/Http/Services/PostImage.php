<?php

namespace App\Http\Services;

use Illuminate\Support\Str;
use Image;

class PostImage
{
    /**
     * Save post image.
     *
     * @param $image
     * @return array
     */
    public static function save($image)
    {
        $imageName = Str::uuid() . '.jpg';
        $imagesPath = public_path('storage/posts/images/');

        if (!file_exists($imagesPath)) {
            mkdir($imagesPath, 0775, true);
        }

        try {
            $imageOriginal = Image::make($image)->encode('jpg');
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


    /**
     * Delete post image.
     *
     * @param $post
     * @return bool
     */
    public static function delete($post)
    {
        $imagesPath = public_path('storage/posts/images/');
        $imageName = $post->image->name;

        if (file_exists($imagesPath . $imageName)) {
            unlink($imagesPath . $imageName);
        }

        if (file_exists($imagesPath . '600_' . $imageName)) {
            unlink($imagesPath . '600_' . $imageName);
        }

        return true;
    }
}
