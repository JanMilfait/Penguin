<?php

use App\Http\Controllers\Webhooks\Pusher\ChannelExistence;

Route::post('/pusher/webhook/private-user', ChannelExistence::class)
    ->middleware('pusher.signature')
    ->name('pusher.private-user');
