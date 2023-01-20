<?php

namespace App\Http\Services;

use App\Models\User\User;
use Illuminate\Http\Request;

class UserPrivacy
{
    /**
     * Check if I can view user data.
     *
     * @param User    $user
     * @return bool
     */
    public static function isPrivate(User $user)
    {
        $id = auth('sanctum')->user()->id ?? null;

        if ($user->profile_visibility === 'private') {
            if ($user->id !== $id) {
                return true;
            }

        } elseif ($user->profile_visibility === 'friends') {
            if (!$user->hasFriend($id)) {
                return true;
            }
        }
        return false;
    }
}




