<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PusherAuthenticatedController extends Controller
{
    /**
     * Authenticate a user for a given channel.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function auth(Request $request)
    {
        $signature = hash_hmac('sha256', $request->socket_id . ':' . $request->channel_name, env('PUSHER_APP_SECRET'));

        // Presence Channel Authentication
        if (strpos($request->channel_name, 'presence-') !== false) {
            $userEncoded = json_encode([
                'user_id' => $request->user()->id,
                'user_info' => [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ],
            ]);
            $signature = hash_hmac('sha256', $request->socket_id . ':' . $request->channel_name . ':' . $userEncoded, env('PUSHER_APP_SECRET'));

            return response()->json([
                'auth' => env('PUSHER_APP_KEY').':'.$signature,
                'channel_data' => $userEncoded
            ]);
        }

        return response()->json([
            'auth' => env('PUSHER_APP_KEY').':'.$signature
        ]);
    }
}
