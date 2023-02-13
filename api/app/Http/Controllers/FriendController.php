<?php

namespace App\Http\Controllers;

use App\Http\Services\UserPrivacy;
use App\Models\Friend\Friend;
use App\Models\Friend\FriendsPending;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $isSelf =  auth('sanctum')->user() && auth('sanctum')->user()->id === $user->id;

        $page = (int) $request->get('page', 1);
        $limit = (int) $request->get('limit', 20);
        $offset = ($page - 1) * $limit;

        if (UserPrivacy::isPrivate($user)) {
            return response()->json([
                'items' => [],
                'page' => $page,
                'limit' => $limit
            ]);
        }

        $friends = Friend::join('users', 'friends.user_b', '=', 'users.id')
            ->where('friends.user_a', $user->id)
            ->selectRaw('users.id as id, users.slug, users.name, users.avatar_name, users.avatar_url' . ($isSelf ? ', users.is_active' : ''))
            ->orderBy('users.is_active', 'desc')
            ->orderBy('users.name')
            ->limit($limit)
            ->offset($offset)
            ->get();

        return response()->json([
            'items' => $friends,
            'page' => $page,
            'limit' => $limit
        ]);
    }


    /**
     * Display user's friends ids.
     *
     * @param User    $user
     * @return JsonResponse
     */
    public function show_ids(User $user)
    {
        if (UserPrivacy::isPrivate($user)) {
            return $this->jsonError('User profile is private', 403);
        }

        $friendsIds = Friend::join('users', 'friends.user_b', '=', 'users.id')
            ->where('friends.user_a', $user->id)
            ->selectRaw('users.id as id')
            ->get()
            ->pluck('id');

        return response()->json($friendsIds);
    }


    /**
     * Display user's friends ids and names.
     *
     * @param User    $user
     * @return JsonResponse
     */
    public function show_ids_names(User $user)
    {
        if (UserPrivacy::isPrivate($user)) {
            return $this->jsonError('User profile is private', 403);
        }

        $friendsIds = Friend::join('users', 'friends.user_b', '=', 'users.id')
            ->where('friends.user_a', $user->id)
            ->selectRaw('users.id as id, users.name')
            ->get()
            ->map(function ($item) {
                return [$item->id, $item->name];
            });

        return response()->json($friendsIds);
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
            return $this->jsonError('You can\'t send a friend request to yourself');
        }

        if ($user->friends->contains('user_b', $request->user()->id)) {
            return $this->jsonError('You are already friends with this user');
        }

        // Check if there is already a pending request for any of the users
        $waitingLogged = $request->user()->pendings->where('state', 'waiting')->where('pending_user', $user->id)->first();
        $waitingRequested = $user->pendings->where('state', 'waiting')->where('pending_user', $request->user()->id)->first();

        if ($waitingLogged || $waitingRequested) {
            return $this->jsonError('Waiting for response');
        }

        FriendsPending::firstOrCreate([
            'user_id' => $request->user()->id,
            'pending_user' => $user->id,
            'state' => 'waiting'
        ]);

        return response()->json(['message' => 'Friend request sent']);
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
            return $this->jsonError('You can\'t accept this friend request');
        }

        if ($pending->state !== 'waiting') {
            return $this->jsonError('You already responded to this friend request');
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

        return response()->json(['message' => 'Friend request accepted']);
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
            return $this->jsonError('You can\'t decline this friend request');
        }

        if ($pending->state !== 'waiting') {
            return $this->jsonError('You already responded to this friend request');
        }

        $pending->update(['state' => 'declined']);

        return response()->json(['message' => 'Friend request declined']);
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
            return $this->jsonError('You can\'t remove yourself');
        }

        if (!$user->friends->contains('user_b', $request->user()->id)) {
            return $this->jsonError('You are not friends with this user');
        }

        $request->user()->friends->where('user_b', $user->id)->first()->delete();
        $user->friends->where('user_b', $request->user()->id)->first()->delete();

        return response()->json(['message' => 'Friend removed']);
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
            ->latest('updated_at')
            ->with('pending')
            ->limit(100)
            ->get();

        foreach ($pendings as $pending) {
            $pending->updated_at_original = $pending->getOriginalUpdatedAt();
        }

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
            ->latest('updated_at')
            ->with('user')
            ->limit(100)
            ->get();

        foreach ($received as $pending) {
            $pending->updated_at_original = $pending->getOriginalUpdatedAt();
        }

        return response()->json($received);
    }
}
