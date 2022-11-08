<?php

namespace App\Services;

use Illuminate\Support\Str;
use Image;

class UserAvatar
{
    /**
     * Save user avatar.
     *
     * @param $avatar
     * @param $user
     * @return array
     */
    public static function save($avatar, $user)
    {
        $avatarName = $user->id . Str::random(40) . '.jpg';
        $avatarsPath = public_path('storage/images/avatars/');

        if (!file_exists($avatarsPath)) {
            mkdir($avatarsPath, 0775, true);
        }

        try {
            $avatarOriginal = Image::make($avatar)->encode('jpg', 80);
            $avatar40 = Image::make($avatar)->fit(40, 40)->encode('jpg', 80);
            $avatar200 = Image::make($avatar)->fit(200, 200)->encode('jpg', 80);

            $avatarOriginal->save($avatarsPath . $avatarName);
            $avatar40->save($avatarsPath . '40_' . $avatarName);
            $avatar200->save($avatarsPath . '200_' . $avatarName);

            return [
                'name' => $avatarName,
                'url' => env('APP_URL') . '/storage/images/avatars/'
            ];

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
