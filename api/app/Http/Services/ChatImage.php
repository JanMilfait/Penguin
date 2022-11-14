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

        if (!file_exists($imagesPath)) {
            mkdir($imagesPath, 0775, true);
        }

        try {
            $isGif ?
                $image->move($imagesPath, $imageName)
                :
                $image = Image::make($image)->encode('jpg');
                $image->save($imagesPath . $imageName);

            return ['url' => env('APP_URL') . '/chat/images/' . $imageName];

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
