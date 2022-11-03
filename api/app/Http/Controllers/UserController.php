<?php

namespace App\Http\Controllers;

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
        $user->profile;
        $user->skills;

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param User    $user
     * @return JsonResponse
     */
    public function update(Request $request, User $user)
    {
        if ($request->user()->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => ['string', 'max:255'],
            'password' => ['confirmed', Rules\Password::defaults()],
            'avatar_url' => ['string', 'max:500','nullable'],
            'profile_age' => ['string', 'max:100','nullable'],
            'profile_description' => ['string', 'max:65535','nullable'],
            'profile_telephone' => ['string', 'max:20','nullable'],
            'profile_address' => ['string', 'max:100','nullable'],
            'profile_nationality' => ['string', 'max:100','nullable'],
            'skills' => ['array', 'nullable'],
        ]);

        if ($request->has(['password', 'password_confirmation'])) {
            $user->forceFill([
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(60),
            ])->save();
        }

        if ($request->has('skills')) {
            $request->skills === null ? $user->skills()->detach() : $user->skills()->sync($request->skills);
        }

        $user->update($request->except(['password', 'password_confirmation', 'skills']));

        return response()->json($user);
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
}
