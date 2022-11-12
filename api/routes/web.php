<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\Webhooks\Pusher\ChannelExistence;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/chat/images/{image}', [ChatController::class, 'show_image']);

require __DIR__.'/webhooks.php';
require __DIR__.'/auth.php';
