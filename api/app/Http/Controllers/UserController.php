<?php

namespace App\Http\Controllers;

use App\Http\Services\UserAvatar;
use App\Models\User\User;
use HTMLPurifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  User  $user
     * @return JsonResponse
     */
    public function show(User $user)
    {
        $id = auth('sanctum')->user()->id ?? null;

        switch ($user->profile_visibility) {
            case 'private':
                if ($user->id !== $id) break;

                $user = $user->makeVisible(['email', 'profile_visibility', 'is_active'])
                    ->load('profile', 'skills.created_by');
                break;

            case 'friends':
                if (!$user->hasFriend($id)) break;

                $user = $user->makeVisible(['email', 'profile_visibility', 'is_active'])
                    ->load('profile', 'skills.created_by');
                break;

            case 'public':
                $user = $user->makeVisibleIf($user->hasFriend($id), 'is_active')
                    ->makeVisible(['email', 'profile_visibility'])
                    ->load('profile', 'skills.created_by');
                break;
        }

        return response()->json($user);
    }


    /**
     * Update user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => ['string', 'max:255'],
            'profile_visibility' => ['string', 'in:private,friends,public'],
            'avatar' => ['nullable', 'image', 'max:2048', 'dimensions:min_width=200,min_height=200'],
            'password' => ['confirmed', Rules\Password::defaults()],
            'age' => ['string', 'max:100','nullable', 'regex:/^[1-9][0-9]?$|^150$/'],
            'description' => ['string', 'max:65535','nullable'],
            'telephone' => ['string', 'max:20','nullable', 'regex:/^(\+)?(\d+)?(\s)?(\d+)?$/'],
            'address' => ['string', 'max:100','nullable'],
            'nationality' => ['string', 'max:100','nullable'],
            'skills' => ['array', 'nullable'],
        ], [
            'avatar.max' => 'The avatar may not be greater than 2MB.',
            'avatar.dimensions' => 'The avatar must be at least 200x200 pixels.',
            'age.regex' => 'The age must be a number.',
            'telephone.regex' => 'The telephone must be a valid phone number.',
        ]);

        $user = $request->user();

        $userUpdate = ['name', 'profile_visibility'];
        if ($this->requestHasOne($userUpdate)) {
            $user->update($request->only($userUpdate));
        }

        if ($request->has('avatar')) {
            $response = UserAvatar::save($request->file('avatar'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $user->avatar_name && UserAvatar::delete($user);
            $user->update([
                'avatar_name' => $response['name'],
                'avatar_url' => $response['url']
            ]);
        }

        if ($request->has(['password', 'password_confirmation'])) {
            $user->forceFill([
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(60),
            ])->save();
        }

        $profileUpdate = ['age', 'description', 'telephone', 'address', 'nationality'];
        if ($this->requestHasOne($profileUpdate)) {
            // Purify WYSIWYG input in case DOMPurify is disabled
            if ($request->has('description')) {
                $purifier = new HTMLPurifier();
                $request->merge(['description' => $purifier->purify($request->description)]);
            }
            $user->profile->update($request->only($profileUpdate));
        }

        if ($request->has('skills')) {
            $request->skills !== ['detach']
                ? $user->skills()->sync($request->skills)
                : $user->skills()->detach();
        }

        return response()->json(['message' => 'User updated']);
    }


    /**
     * Display the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logged(Request $request)
    {
        $user = $request->user()->makeVisible(['email', 'profile_visibility', 'is_active'])->load('profile', 'skills.created_by');

        return response()->json($user);
    }


    /**
     * Display user's notifications.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logged_notifications(Request $request)
    {
        $notifications = $request->user()->notifications()
            ->where('created_at', '>', now()->subMonth())
            ->orderByRaw('readed_at IS NULL DESC, created_at DESC')
            ->limit(100)
            ->get();

        return response()->json($notifications);
    }


    /**
     * Mark notifications as read.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function mark_notifications_as_read(Request $request)
    {
        $request->validate([
            'notifications' => ['array'],
            'notifications.*' => ['integer', 'exists:notifications,id'],
        ]);

        $request->user()->notifications()->whereIn('id', $request->notifications)->update(['readed_at' => now()]);

        return response()->json(['message' => 'Notifications marked as read']);
    }
}
