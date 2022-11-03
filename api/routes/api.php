<?php

use App\Http\Controllers\FriendController;
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

    Route::get('/user', [UserController::class, 'logged']);
    Route::get('/user/{user}', [UserController::class, 'show']);
    Route::patch('/user/{user}', [UserController::class, 'update']);

    Route::get('/friends/{user}', [FriendController::class, 'show']);
    Route::get('/pendings', [FriendController::class, 'logged']);
    Route::get('/pendings/received', [FriendController::class, 'logged_received']);
    Route::post('/pendings/{user}', [FriendController::class, 'store']);
    Route::patch('/pendings/accept/{pending}', [FriendController::class, 'accept']);
    Route::patch('/pendings/decline/{pending}', [FriendController::class, 'decline']);



});
