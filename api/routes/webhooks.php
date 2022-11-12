<?php

use App\Http\Controllers\Webhooks\Pusher\ChannelExistence;

// TODO: SETUP WEBHOOK ROUTE IN PRODUCTION
Route::post('/pusher/webhook/private-user', [ChannelExistence::class, 'private_user'])
    ->middleware('pusher.signature')
    ->name('pusher.private-user');
