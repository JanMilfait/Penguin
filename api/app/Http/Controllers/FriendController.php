<?php

namespace App\Http\Controllers;

use App\Models\Friend\Friend;
use App\Models\Friend\FriendsPending;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use function React\Promise\map;

class FriendController extends Controller
{
    /**
     * Display user's friends.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function show(Request $request, User $user)
    {
        $friends = Friend::join('users', 'friends.user_b', '=', 'users.id')
            ->where('friends.user_a', $user->id)
            ->select('users.id as id', 'users.name', 'users.is_active', 'users.avatar_name', 'users.avatar_url')
            ->orderBy('users.is_active', 'desc')
            ->orderBy('users.name')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 30)
            ->get();

        return response()->json($friends);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function store(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You can\'t send a friend request to yourself'
            ], 400);
        }

        if ($user->friends->contains('user_b', $request->user()->id)) {
            return response()->json([
                'message' => 'You are already friends with this user'
            ], 400);
        }

        // Check if there is already a pending request for any of the users
        $waitingLogged = $request->user()->pendings->where('state', 'waiting')->where('pending_user', $user->id)->first();
        $waitingRequested = $user->pendings->where('state', 'waiting')->where('pending_user', $request->user()->id)->first();

        if ($waitingLogged || $waitingRequested) {
            return response()->json([
                'message' => 'Waiting for response'
            ], 400);
        }

        FriendsPending::firstOrCreate([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'pending_user' => $user->id,
            'pending_name' => $user->name,
            'state' => 'waiting'
        ]);

        return response()->json(['message' => 'Friend request sent.']);
    }


    /**
     * Accept a friend request.
     *
     * @param Request        $request
     * @param FriendsPending $pending
     * @return JsonResponse
     */
    public function accept(Request $request, FriendsPending $pending)
    {
        if ($pending->pending_user !== $request->user()->id) {
            return response()->json([
                'message' => 'You can\'t accept this friend request'
            ], 400);
        }

        if ($pending->state !== 'waiting') {
            return response()->json([
                'message' => 'You already responded to this friend request'
            ], 400);
        }

        $pending->update(['state' => 'accepted']);

        Friend::firstOrCreate([
            'user_a' => $pending->user_id,
            'user_b' => $pending->pending_user,
        ]);
        Friend::firstOrCreate([
            'user_a' => $pending->pending_user,
            'user_b' => $pending->user_id,
        ]);

        return response()->json(['message' => 'Friend request accepted.']);
    }


    /**
     * Decline a friend request.
     *
     * @param Request        $request
     * @param FriendsPending $pending
     * @return JsonResponse
     */
    public function decline(Request $request, FriendsPending $pending)
    {
        if ($pending->pending_user !== $request->user()->id) {
            return response()->json([
                'message' => 'You can\'t decline this friend request'
            ], 400);
        }

        if ($pending->state !== 'waiting') {
            return response()->json([
                'message' => 'You already responded to this friend request'
            ], 400);
        }

        $pending->update(['state' => 'declined']);

        return response()->json(['message' => 'Friend request declined.']);
    }


    /**
     * Remove friend
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You can\'t remove yourself'
            ], 400);
        }

        if (!$user->friends->contains('user_b', $request->user()->id)) {
            return response()->json([
                'message' => 'You are not friends with this user'
            ], 400);
        }

        $request->user()->friends->where('user_b', $user->id)->first()->delete();
        $user->friends->where('user_b', $request->user()->id)->first()->delete();

        return response()->json(['message' => 'Friend removed.']);
    }


    /**
     * Display send pendings for the logged user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logged(Request $request)
    {
        $pendings = $request->user()->pendings()
            ->where('updated_at', '>', now()->subMonth())
            ->select('id', 'pending_user', 'pending_name', 'state', 'created_at', 'updated_at')
            ->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 10)
            ->get();

        return response()->json($pendings);
    }


    /**
     * Display received pendings for the logged user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logged_received(Request $request)
    {
        $received = FriendsPending::where('pending_user', $request->user()->id)
            ->where('updated_at', '>', now()->subMonth())
            ->select('id', 'user_id', 'user_name', 'state', 'created_at', 'updated_at')
            ->latest('updated_at')
            ->offset($request->get('offset') ?? 0)
            ->limit($request->get('limit') ?? 10)
            ->get();

        return response()->json($received);
    }
}
