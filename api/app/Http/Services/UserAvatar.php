<?php

namespace App\Http\Services;

use Illuminate\Support\Str;
use Image;

class UserAvatar
{
    /**
     * Save user avatar.
     *
     * @param $avatar
     * @return array
     */
    public static function save($avatar)
    {
        $avatarName = Str::uuid() . '.jpg';
        $avatarsPath = public_path('storage/images/avatars/');

        if (!file_exists($avatarsPath)) {
            mkdir($avatarsPath, 0775, true);
        }

        try {
            $avatarOriginal = Image::make($avatar)->encode('jpg');
            $avatar50 = Image::make($avatar)->fit(50, 50)->encode('jpg', 80);
            $avatar200 = Image::make($avatar)->fit(200, 200)->encode('jpg', 80);

            $avatarOriginal->save($avatarsPath . $avatarName);
            $avatar50->save($avatarsPath . '50_' . $avatarName);
            $avatar200->save($avatarsPath . '200_' . $avatarName);

            return [
                'name' => $avatarName,
                'url' => env('APP_URL') . '/storage/images/avatars/'
            ];

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }


    /**
     * Delete user avatar.
     *
     * @param $user
     * @return bool
     */
    public static function delete($user)
    {
        $avatarsPath = public_path('storage/images/avatars/');
        $avatarName = $user->avatar_name;

        if (file_exists($avatarsPath . $avatarName)) {
            unlink($avatarsPath . $avatarName);
        }

        if (file_exists($avatarsPath . '50_' . $avatarName)) {
            unlink($avatarsPath . '50_' . $avatarName);
        }

        if (file_exists($avatarsPath . '200_' . $avatarName)) {
            unlink($avatarsPath . '200_' . $avatarName);
        }

        return true;
    }
}
