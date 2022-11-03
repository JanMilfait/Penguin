<?php

namespace App\Models\Chat;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ChatRoom
 *
 * @property int $id
 * @property string $token
 * @property Carbon|null $created_at
 *
 * @property User $user
 * @property Collection|ChatMessage[] $chat_messages
 *
 * @package App\Models
 */
class ChatRoom extends Model
{
	protected $table = 'chat_rooms';

    const UPDATED_AT = null;

	protected $hidden = [
		'token'
	];

	protected $fillable = [
		'token'
	];

	public function chat_messages()
	{
		return $this->hasMany(ChatMessage::class, 'room_token', 'token');
	}
}
