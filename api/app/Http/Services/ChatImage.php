<?php

namespace App\Http\Services;

use Illuminate\Support\Str;
use Image;

class ChatImage
{
    /**
     * @param $image
     * @return array
     */
    public static function save($image)
    {
        $isGif = Str::contains($image->getMimeType(), 'gif');

        $imageName = Str::uuid() . ($isGif ? '.gif' : '.jpg');
        $imagesPath = storage_path('app/chats/images/');
        $placeholderPath = storage_path('app/chats/images/placeholder/');

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
                $image = Image::make($image);
                $image->save($imagesPath . $imageName, 90, 'jpg');
                $image->pixelate(10);
                $image->save($placeholderPath . $imageName, 0, 'jpg');
            }
            return ['url' => env('APP_URL') . '/chat/images/' . $imageName];

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
