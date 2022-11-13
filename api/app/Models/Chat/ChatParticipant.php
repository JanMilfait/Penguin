<?php

namespace App\Models\Chat;

use App\Models\User\User;
use Cache;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ChatMessage
 *
 * @property int $id
 * @property int $user_id
 * @property int $room_id
 * @property Carbon|null $created_at
 *
 * @property ChatRoom $chat_room
 * @property User $user
 *
 * @package App\Models
 */
class ChatParticipant extends Model
{
	protected $table = 'chat_participants';

    const UPDATED_AT = null;

	protected $fillable = [
		'user_id',
		'room_id'
	];

	public function room()
	{
		return $this->belongsTo(ChatRoom::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}


    /**
     * Forget cache for non-active users chat notification
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($participant) {
            Cache::forget('chat_' . $participant->room_id . '_' . $participant->user_id);
        });
    }
}
