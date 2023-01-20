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
        $avatarsPath = public_path('storage/avatars/images/');

        if (!file_exists($avatarsPath)) {
            mkdir($avatarsPath, 0775, true);
        }

        try {
            $avatarOriginal = Image::make($avatar);
            $avatarOriginal->save($avatarsPath . $avatarName, 90, 'jpg');

            $avatar50 = Image::make($avatar)->fit(50, 50);
            $avatar50->save($avatarsPath . '50_' . $avatarName, 90, 'jpg');

            $avatar200 = Image::make($avatar)->fit(200, 200);
            $avatar200->save($avatarsPath . '200_' . $avatarName, 90, 'jpg');

            return [
                'name' => $avatarName,
                'url' => env('APP_URL') . '/storage/avatars/images/'
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
        $avatarsPath = public_path('storage/avatars/images/');
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
