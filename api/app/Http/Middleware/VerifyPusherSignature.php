<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyPusherSignature
{
    /**
     * Authenticate pusher webhook requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $key = request()->header('X-Pusher-Key');
        $signature = request()->header('X-Pusher-Signature');

        $expectedSignature = hash_hmac('sha256', $request->getContent(), env('PUSHER_APP_SECRET'));

        if ($key !== env('PUSHER_APP_KEY') || $signature !== $expectedSignature) {
            abort(403);
        }

        return $next($request);
    }
}
