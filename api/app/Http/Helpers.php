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
     * Return normalized array of ids and entities from a collection
     *
     * @param $collection
     * @param int $offset
     * @return array
     */
    public function normalize($collection, $offset = 0)
    {
        $count = $collection->count();
        $ids = $count + $offset > $offset ? collect(range(0 + $offset, $count + $offset - 1)) : collect();
        for ($i = 0; $i < $count; $i++) {
            $collection[$i]->entity_id = $i + $offset;
        }

        return [
            'ids' => $ids,
            'entities' => $collection
        ];
    }
}
