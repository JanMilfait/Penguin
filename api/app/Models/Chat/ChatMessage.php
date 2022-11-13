<?php

namespace App\Models\Chat;

use App\Events\SendMessage;
use App\Models\User\Notification;
use App\Models\User\User;
use Cache;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Str;

/**
 * Class ChatMessage
 *
 * @property int $id
 * @property int $user_id
 * @property int $room_id
 * @property string $body
 * @property string|null $image_url
 * @property Carbon|null $created_at
 *
 * @property ChatRoom $chat_room
 * @property User $user
 *
 * @package App\Models
 */
class ChatMessage extends Model
{
	protected $table = 'chat_messages';

    const UPDATED_AT = null;

    protected $hidden = [
        'id',
        'room_id',
    ];

	protected $fillable = [
		'user_id',
		'room_id',
		'body',
        'image_url'
	];

	public function chat()
	{
		return $this->belongsTo(ChatRoom::class, 'room_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}


    /**
     * Notifications (send to client, save to database)
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($message) {

            // 1 day / add participant -> delete cache
            $cached = Cache::remember('chat_' . $message->room_id . '_' . $message->user_id, 86400, function () use ($message) {
                return $message->load('user', 'chat.participants');
            });
            $cached->body = $message->body;

            // Save notification for all non active chat participants
            $cached->chat->participants->each(function ($participant) use ($cached) {

                // participant.user mustn't be cached
                if ($participant->user->is_active === 1) return;

                Notification::updateOrCreate([
                    'user_id' => $participant->user_id,
                    'source' => 'chat',
                    'source_id' => $cached->chat->id,
                ], [
                    'source_data' => json_encode([
                        'source' => 'chat',
                        'source_id' => $cached->chat->id,
                        'preview' => Str::limit($cached->body, 50),
                        'id' => $cached->user->id,
                        'name' => $cached->user->name,
                        'avatar' => $cached->user->avatar_url . '40_' . $cached->user->avatar_name
                    ]),
                    'expire_at' => now()->addDays(7)
                ]);
            });

            broadcast(new SendMessage($message));
        });
    }
}
