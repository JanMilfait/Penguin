<?php

namespace App\Http\Controllers;

use App\Http\Services\ChatImage;
use App\Models\Chat\ChatRoom;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ChatController extends Controller
{
    /**
     * Display chats
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $chats = ChatRoom::whereHas('participants', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->with('last_message_by')
            ->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 10)
            ->get();

        return response()->json($chats);
    }


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
            return $this->jsonError('You are not allowed to send messages to this chat.', 403);
        }

        $request->validate([
            'body' => ['required_without:image', 'string'],
            'image' => ['required_without:body', 'image', 'max:26214400'],
        ]);

        if ($request->hasFile('image')) {
            $response = ChatImage::save($request->file('image'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $request->merge(['body' => '<img src="' . $response['url'] . '">']);
        }

        $chat->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $request->input('body'),
            'image_url' => $response['url'] ?? null,
        ]);

        $chat->update([
            'last_message' => isset($response['url']) ? 'Sent an image.' : $request->input('body'),
            'last_message_by' => $request->user()->id
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
            return $this->jsonError('You cannot chat with yourself', 400);
        }

        $chat = ChatRoom::
            whereHas('participants', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('type', 'friend')
            ->with('last_message_by')
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
     * @param   $image
     * @return JsonResponse | BinaryFileResponse
     */
    public function show_image($image)
    {
        $image = storage_path('app/chats/images/' . $image);

        if (!file_exists($image)) {
            return $this->jsonError('Image not found.', 404);
        }

        return response()->file($image);
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
            return $this->jsonError('You are not allowed to view messages in this chat.', 403);
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


    /**
     * Add a user to a chat
     *
     * @param Request  $request
     * @param ChatRoom $chat
     * @return JsonResponse
     */
    public function store_participant(Request $request, ChatRoom $chat)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        if (!$chat->participants()->where('user_id', $request->user()->id)->first()) {
            return $this->jsonError('You are not allowed to add participants to this chat.', 403);
        }

        if ($chat->participants()->count() === 2) {
            $chat->participants()->update(['is_admin' => 1]);
            $chat->update(['type' => 'group']);
        } else {
            if (!$chat->participants()->where('user_id', $request->user()->id)->first()->is_admin) {
                return $this->jsonError('You are not admin of this chat.', 403);
            }
        }

        if (!$request->user()->friends()->where('user_b', $request->input('user_id'))->first()) {
            return $this->jsonError('Cannot add a user that is not your friend.', 403);
        }

        $chat->participants()->firstOrCreate([
            'user_id' => $request->input('user_id'),
            'room_id' => $chat->id,
        ]);

        return response()->json('Participant added.', 201);
    }


    /**
     * Remove a user from a chat
     *
     * @param Request  $request
     * @param ChatRoom $chat
     * @param User     $user
     * @return JsonResponse
     */
    public function destroy_participant(Request $request, ChatRoom $chat, User $user)
    {
        if (!$chat->participants()->where('user_id', $request->user()->id)->first()) {
            return $this->jsonError('You are not allowed to remove participants from this chat.', 403);
        }

        if (!$chat->participants()->where('user_id', $user->id)->first()) {
            return $this->jsonError('User is not participant of this chat.', 404);
        }

        if (!$chat->participants()->where('user_id', $request->user()->id)->first()->is_admin) {
            return $this->jsonError('You are not admin of this chat.', 403);
        }

        if ($chat->participants()->where('user_id', $user->id)->first()->is_admin) {
            return $this->jsonError('You cannot remove admin from this chat.', 403);
        }

        $chat->participants()->where('user_id', $user->id)->first()->delete();

        return response()->json('Participant removed.');
    }
}
