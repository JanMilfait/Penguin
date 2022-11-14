<?php

namespace App\Models\Chat;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ChatMessage
 *
 * @property int $id
 * @property int $user_id
 * @property int $room_id
 * @property int $is_admin
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

    protected $casts = [
        'is_admin' => 'int',
    ];

	protected $fillable = [
		'user_id',
		'room_id',
        'is_admin'
	];

	public function chat()
	{
		return $this->belongsTo(ChatRoom::class, 'room_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
