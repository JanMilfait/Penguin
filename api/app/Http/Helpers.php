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
        $errorsMap = [];
        foreach ($errors as $currentKey => $messages) {
            foreach ($messages as $message) {
                $errorsMap[$currentKey][$message] = true;
            }
        }

        foreach ($transform as $transformItem) {
            $currentKey = $transformItem[0];
            $value = $transformItem[1];
            $newKey = $transformItem[2];

            if (isset($errorsMap[$currentKey][$value])) {
                $errors[$newKey][] = $value;
                unset($errorsMap[$currentKey][$value]);
                if (count($errorsMap[$currentKey]) === 0) {
                    unset($errorsMap[$currentKey]);
                }
            }
        }

        return $errors;
    }
}
