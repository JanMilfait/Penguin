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
 * @property string $room_token
 * @property string $body
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

	protected $casts = [
		'user_id' => 'int'
	];

	protected $hidden = [
		'room_token'
	];

	protected $fillable = [
		'user_id',
		'room_token',
		'body'
	];

	public function chat_room()
	{
		return $this->belongsTo(ChatRoom::class, 'room_token', 'token');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
