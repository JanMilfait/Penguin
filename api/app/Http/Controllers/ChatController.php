<?php

namespace App\Http\Controllers;

use App\Http\Services\ChatImage;
use App\Models\Chat\ChatParticipant;
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
            ->latest('updated_at')
            ->limit(100)
            ->with('users')
            ->get()
            ->each(function ($chat) {
                $chat->users->each(function ($user) {
                    $user->makeVisible('is_active');
                });
            });

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
        }

        $message = $chat->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $request->input('body'),
            'image_url' => $response['url'] ?? null,
        ]);

        $chat->update([
            'last_message' => isset($response['url']) ? 'Sent an image.' : $request->input('body'),
            'last_message_by' => $request->user()->id
        ]);

        return response()->json($message->only(['id', 'user_id', 'body', 'image_url', 'created_at']));
    }


    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param ChatRoom $chat
     * @return JsonResponse
     */
    public function show(Request $request, ChatRoom $chat)
    {
        $participant = $chat->participants()->where('user_id', $request->user()->id)->first();

        if (!$participant) {
            return $this->jsonError('You are not allowed to view this chat.', 403);
        }

        $chat->load('users');

        $chat->users->each(function ($user) {
            $user->makeVisible('is_active');
        });

        return response()->json($chat);
    }


    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function show_friend(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return $this->jsonError('You cannot chat with yourself');
        }

        $chat = ChatRoom::
            whereHas('participants', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('type', 'friend')
            ->with('users')
            ->first();

        if (!$chat) {
            $chat = ChatRoom::create();
            $chat->participants()->createMany([
                ['user_id' => $request->user()->id, 'room_id' => $chat->id],
                ['user_id' => $user->id, 'room_id' => $chat->id],
            ]);
            $chat->update([
                'type' => 'friend',
                'last_message' => null,
                'last_message_by' => null
            ]);
        }

        $chat->users->each(function ($user) {
            $user->makeVisible('is_active');
        });

        return response()->json($chat);
    }


    /**
     * Delete chat
     *
     * @param Request $request
     * @param ChatRoom $chat
     * @return JsonResponse
     */
    public function destroy(Request $request, ChatRoom $chat) {
        if (!$chat->participants()->where('user_id', $request->user()->id)->first()->is_admin) {
            return $this->jsonError('You are not admin of this chat.', 403);
        }
        $chat->delete();

        return response()->json(['message' => 'Chat deleted']);
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
     * @param   $image
     * @return JsonResponse | BinaryFileResponse
     */
    public function show_placeholder($image)
    {
        $image = storage_path('app/chats/images/placeholder/' . $image);

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

        $page = (int) $request->get('page', 1);
        $limit = (int) $request->get('limit', 10);
        $offset = ($page - 1) * $limit;

        $messages = $chat->messages()
            ->latest()
            ->limit($limit)
            ->offset($offset)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'items' => $messages,
            'page' => $page,
            'limit' => $limit
        ]);
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

        if (!$chat->participants()->where('user_id', $request->user()->id)->first()->is_admin) {
            return $this->jsonError('You are not admin of this chat.', 403);
        }

        if (!$request->user()->friends()->where('user_b', $request->input('user_id'))->first()) {
            return $this->jsonError('Cannot add a user that is not your friend.', 403);
        }

        if ($chat->participants()->count() === 2) {
            $chat->update(['type' => 'group']);
        }

        $chat->participants()->firstOrCreate([
            'user_id' => $request->input('user_id'),
            'room_id' => $chat->id,
            'is_admin' => 0
        ]);

        return response()->json(['message' => 'User added']);
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
        if (!$chat->participants()->where('user_id', $request->user()->id)->first()->is_admin) {
            return $this->jsonError('You are not admin of this chat.', 403);
        }

        if (!$chat->participants()->where('user_id', $user->id)->first()) {
            return $this->jsonError('User is not participant of this chat.', 404);
        }

        if ($chat->participants()->where('user_id', $user->id)->first()->is_admin) {
            return $this->jsonError('You cannot remove admin from this chat.', 403);
        }

        $chat->participants()->where('user_id', $user->id)->first()->delete();

        return response()->json(['message' => 'User removed']);
    }
}
