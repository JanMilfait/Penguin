<?php

namespace App\Http\Services;

use Illuminate\Support\Str;
use Image;

class SkillIcon
{
    /**
     * Save skill icon.
     *
     * @param $icon
     * @return array
     */
    public static function save($icon)
    {
        $iconName = Str::uuid() . '.jpg';
        $iconsPath = public_path('storage/skills/images/');

        if (!file_exists($iconsPath)) {
            mkdir($iconsPath, 0775, true);
        }

        try {
            $icon80 = Image::make($icon)->fit(80, 80);
            $icon80->save($iconsPath . $iconName, 90, 'jpg');

            return [
                'url' => env('APP_URL') . '/storage/skills/images/' . $iconName
            ];

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }


    /**
     * Delete skill icon.
     *
     * @param $icon
     * @return bool
     */
    public static function delete($icon)
    {
        $icon = public_path('storage/skills/images/') . str_replace(env('APP_URL') . '/storage/skills/images/', '', $icon);

        if (file_exists($icon)) {
            unlink($icon);
        }

        return true;
    }
}
