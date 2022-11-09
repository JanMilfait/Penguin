<?php

namespace App\Http\Controllers\Webhooks\Pusher;

use App\Events\FriendOffline;
use App\Events\FriendOnline;
use App\Http\Controllers\Controller;
use App\Models\User\User;

class ChannelExistence extends Controller
{
    public function private_user()
    {
        if (str_contains(request()->json('events')[0]['channel'], 'private-user.')) {

            $name = request()->json('events')[0]['name'];
            $user = User::find(substr(request()->json('events')[0]['channel'], 13));

            if ($name === 'channel_occupied') {
                $user->update(['is_active' => 1]);

                foreach ($user->friends as $friend) {
                    broadcast(new FriendOnline($friend->user->id, $user->id));
                }
            }

            if ($name === 'channel_vacated') {
                $user->update(['is_active' => 0]);

                foreach ($user->friends as $friend) {
                    broadcast(new FriendOffline($friend->user->id, $user->id));
                }
            }
        }
    }
}
