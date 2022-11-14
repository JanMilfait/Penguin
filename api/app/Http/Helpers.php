<?php

namespace App\Http;

use Illuminate\Http\JsonResponse;

trait Helpers
{
    /**
     * Return a JSON with message and error status
     *
     * @param $message string
     * @param $status    int
     * @return JsonResponse
     */
    public static function jsonError($message, $status = 400)
    {
        return response()->json([
            'message' => $message,
        ], $status);
    }
}
