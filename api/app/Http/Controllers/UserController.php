<?php

namespace App\Http\Controllers;

use App\Http\Services\UserAvatar;
use App\Models\User\User;
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
        return response()->json($user->load('profile', 'skills.created_by'));
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
            'avatar' => ['nullable', 'image', 'max:2048', 'dimensions:min_width=200,min_height=200'],
            'password' => ['confirmed', Rules\Password::defaults()],
            'visibility' => ['string', 'max:100'],
            'age' => ['string', 'max:100','nullable'],
            'description' => ['string', 'max:65535','nullable'],
            'telephone' => ['string', 'max:20','nullable'],
            'address' => ['string', 'max:100','nullable'],
            'nationality' => ['string', 'max:100','nullable'],
            'skills' => ['array', 'nullable'],
        ]);

        $user = $request->user();

        $user->update($request->only('name'));

        if ($request->has(['password', 'password_confirmation'])) {
            $user->forceFill([
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(60),
            ])->save();
        }

        $user->profile->update($request->only([
            'visibility',
            'age',
            'description',
            'telephone',
            'address',
            'nationality'
        ]));

        if ($request->has('skills')) {
            $request->skills === null ? $user->skills()->detach() : $user->skills()->sync($request->skills);
        }

        return response()->json($user->load('profile', 'skills'));
    }


    /**
     * Upload and process user avatar.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function upload_avatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048', 'dimensions:min_width=200,min_height=200'],
        ]);

        $user = $request->user();

        $response = UserAvatar::save($request->file('avatar'));

        if (isset($response['error'])) {
            return $this->jsonError($response['error'], 500);
        }

        $user->avatar_name && UserAvatar::delete($user);

        $user->update([
            'avatar_name' => $response['name'],
            'avatar_url' => $response['url']
        ]);

        return response()->json(['message' => 'Avatar uploaded successfully.']);
    }


    /**
     * Display the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logged(Request $request)
    {
        return response()->json($request->user());
    }


    /**
     * Display user's notifications.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logged_notifications(Request $request)
    {
        $notifications = $request->user()->notifications()->limit(100)->latest()->get();

        return response()->json($notifications);
    }
}
