<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\PostCommentController;
use App\Http\Controllers\PostCommentReplyController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SearchController;
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
    Route::get('/user/notifications', [UserController::class, 'logged_notifications']);
    Route::get('/user/{user}', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/user/avatar', [UserController::class, 'upload_avatar']);

    Route::get('/friends/{user}', [FriendController::class, 'show']);
    Route::get('/friends/{user}/ids', [FriendController::class, 'show_ids']);
    Route::delete('/friend/{user}', [FriendController::class, 'destroy']);
    Route::get('/pendings', [FriendController::class, 'logged']);
    Route::get('/pendings/received', [FriendController::class, 'logged_received']);
    Route::post('/pending/{user}', [FriendController::class, 'store']);
    Route::patch('/pending-accept/{pending}', [FriendController::class, 'accept']);
    Route::patch('/pending-decline/{pending}', [FriendController::class, 'decline']);

    Route::get('/posts', [PostController::class, 'feed']);
    Route::get('/posts/{user}', [PostController::class, 'index']);
    Route::get('/post/{post}', [PostController::class, 'show']);
    Route::post('/post', [PostController::class, 'store']);
    Route::put('/post/{post}', [PostController::class, 'update']);
    Route::delete('/post/{post}', [PostController::class, 'destroy']);
    Route::post('/post/{post}/share', [PostController::class, 'share']);
    Route::delete('/post/{post}/share', [PostController::class, 'unshare']);
    Route::post('/post/{post}/reaction', [PostController::class, 'react']);
    Route::delete('/post/{post}/reaction', [PostController::class, 'unreact']);
    Route::post('/post/{post}/report', [PostController::class, 'report']);

    Route::get('/post/{post}/comments', [PostCommentController::class, 'show']);
    Route::post('/post/{post}/comment', [PostCommentController::class, 'store']);
    Route::put('/post/comment/{comment}', [PostCommentController::class, 'update']);
    Route::delete('/post/comment/{comment}', [PostCommentController::class, 'destroy']);
    Route::post('/post/comment/{comment}/reaction', [PostCommentController::class, 'store_reaction']);
    Route::delete('/post/comment/{comment}/reaction', [PostCommentController::class, 'destroy_reaction']);

    Route::get('/post/comment/{comment}/replies', [PostCommentReplyController::class, 'show']);
    Route::post('/post/comment/{comment}/reply', [PostCommentReplyController::class, 'store']);
    Route::put('/post/comment/reply/{reply}', [PostCommentReplyController::class, 'update']);
    Route::delete('/post/comment/reply/{reply}', [PostCommentReplyController::class, 'destroy']);
    Route::post('/post/comment/reply/{reply}/reaction', [PostCommentReplyController::class, 'store_reaction']);
    Route::delete('/post/comment/reply/{reply}/reaction', [PostCommentReplyController::class, 'destroy_reaction']);

    Route::get('/chats', [ChatController::class, 'index']);
    Route::get('/chat/{user}', [ChatController::class, 'show']);
    Route::delete('/chat/{chat}', [ChatController::class, 'destroy']);
    Route::get('/chat/{chat}/messages', [ChatController::class, 'show_messages']);
    Route::post('/chat/{chat}/message', [ChatController::class, 'store_message']);
    Route::post('/chat/{chat}/participant', [ChatController::class, 'store_participant']);
    Route::delete('/chat/{chat}/participant/{user}', [ChatController::class, 'destroy_participant']);

    Route::get('/search', SearchController::class);

});
