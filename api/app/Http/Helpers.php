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



    public function transformValidationKey($errors, $transform)
    {
        foreach ($transform as $transformItem) {
            $currentKey = $transformItem[0];
            $value = $transformItem[1];
            $newKey = $transformItem[2];

            // array_key_exists() - constant time
            if (array_key_exists($currentKey, $errors)) {
                foreach ($errors[$currentKey] as $key => $message) {
                    if ($message === $value) {
                        $errors[$newKey][] = $message;

                        unset($errors[$currentKey][$key]);
                        if (empty($errors[$currentKey])) {
                            unset($errors[$currentKey]);
                        } else {
                            $errors[$currentKey] = array_values($errors[$currentKey]);
                        }
                    }
                }
            }
        }

        return $errors;
    }
}
