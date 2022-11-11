<?php

namespace App\Http\Controllers;

use App\Models\Chat\ChatParticipant;
use App\Models\Chat\ChatRoom;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request  $request
     * @param ChatRoom $chat
     * @return JsonResponse
     */
    public function store_message(Request $request, ChatRoom $chat)
    {
        $participant = $chat->participants()->where('user_id', $request->user()->id)->first();

        if (!$participant) {
            return response()->json([
                'message' => 'You are not allowed to send messages to this chat.',
            ], 403);
        }

        $request->validate([
            'body' => ['required_without:image', 'string'],
            'image' => ['required_without:body', 'image', 'max:26214400'],
        ]);

        if ($request->hasFile('image')) {
            $imageUrl = // TODO TODO


            $request->merge(['body' => '<img src="' . $imageUrl . '">']);
        }

        $chat->messages()->create([
            'body' => $request->input('body'),
            'image_url' => $imageUrl ?? null,
        ]);


        return response()->json('Message sent.', 201);
    }


    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function show(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot chat with yourself',
            ], 400);
        }

        $chat = ChatRoom::
            whereHas('participants', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();

        if (!$chat) {
            $chat = ChatRoom::create();
            $chat->participants()->createMany([
                ['user_id' => $request->user()->id, 'room_id' => $chat->id],
                ['user_id' => $user->id, 'room_id' => $chat->id],
            ]);
        }

        return response()->json($chat);
    }


    /**
     * Display the specified resource.
     *
     * @param Request  $request
     * @param ChatRoom $chat
     * @return JsonResponse
     */
    public function show_messages(Request $request, ChatRoom $chat)
    {
        $participant = $chat->participants()->where('user_id', $request->user()->id)->first();

        if (!$participant) {
            return response()->json([
                'message' => 'You are not allowed to view messages in this chat.',
            ], 403);
        }

        $messages = $chat->messages()
            ->latest()
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 10)
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }
}
