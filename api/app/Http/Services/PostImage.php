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
        $isGif = Str::contains($image->getMimeType(), 'gif');

        $imageName = Str::uuid() . ($isGif ? '.gif' : '.jpg');
        $imagesPath = public_path('storage/posts/images/');
        $placeholderPath = public_path('storage/posts/images/placeholder/');

        if (!file_exists($imagesPath)) {
            mkdir($imagesPath, 0775, true);
        }

        if (!file_exists($placeholderPath)) {
            mkdir($placeholderPath, 0775, true);
        }

        try {
            if ($isGif) {
                $image->move($imagesPath, $imageName);
            } else {
                $imageOriginal = Image::make($image);
                $imageOriginal->save($imagesPath . $imageName, 90, 'jpg');

                $image700 = Image::make($image)->widen(700);
                $image700->save($imagesPath . '700_' . $imageName, 90, 'jpg');
                $image700->pixelate(10);
                $image700->save($placeholderPath . '700_' . $imageName, 0, 'jpg');
            }

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

        if (file_exists($imagesPath . '700_' . $imageName)) {
            unlink($imagesPath . '700_' . $imageName);
        }

        return true;
    }
}
