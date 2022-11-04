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
        return response()->json($user->load('profile', 'skills', 'skills.created_by'));
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
            'visibility' => ['string', 'max:100'],
            'age' => ['string', 'max:100','nullable'],
            'description' => ['string', 'max:65535','nullable'],
            'telephone' => ['string', 'max:20','nullable'],
            'address' => ['string', 'max:100','nullable'],
            'nationality' => ['string', 'max:100','nullable'],
            'skills' => ['array', 'nullable'],
        ]);

        $user->update($request->only(['name', 'avatar_url']));

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
