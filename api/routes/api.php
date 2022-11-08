<?php

use App\Http\Controllers\FriendController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    // TODO: NOTIFICATIONS
    Route::get('/user', [UserController::class, 'logged']);
    Route::get('/user/{user}', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/user/avatar', [UserController::class, 'upload_avatar']);

    Route::get('/friends/{user}', [FriendController::class, 'show']);
    Route::delete('/friends/{user}', [FriendController::class, 'destroy']);

    Route::get('/pendings', [FriendController::class, 'logged']);
    Route::get('/pendings/received', [FriendController::class, 'logged_received']);
    Route::post('/pendings/{user}', [FriendController::class, 'store']);
    Route::patch('/pendings/accept/{pending}', [FriendController::class, 'accept']);
    Route::patch('/pendings/decline/{pending}', [FriendController::class, 'decline']);

    Route::get('/posts/{user}', [PostController::class, 'show']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});
