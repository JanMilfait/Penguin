<?php

use App\Models\Chat\ChatParticipant;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('chat-room.{roomId}', function ($user, $roomId) {
    $auth = ChatParticipant::where('user_id', $user->id)->where('room_id', $roomId)->first();

    if ($auth) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
