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
    public function jsonError($message, $status = 400)
    {
        return response()->json([
            'message' => $message,
        ], $status);
    }


    /**
     * Change keys of validation errors to match the frontend
     *
     * @param $errors
     * @param $transform
     * @return array
     */
    public function transformValidationKey($errors, $transform)
    {
        $transformedErrors = [];
        foreach ($transform as [$currentKey, $value, $newKey]) {
            if (isset($errors[$currentKey]) && in_array($value, $errors[$currentKey])) {
                $transformedErrors[$newKey][] = $value;
                unset($errors[$currentKey][array_search($value, $errors[$currentKey])]);
                $errors[$currentKey] = array_values($errors[$currentKey]);
            }
        }

        return array_merge($errors, $transformedErrors);
    }


    /**
     * request has at least one of the given keys
     *
     * @param $keys array
     * @return boolean
     */
    public function requestHasOne($keys)
    {
        foreach ($keys as $key) {
            if (request()->has($key)) {
                return true;
            }
        }

        return false;
    }
}
