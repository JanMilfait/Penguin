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
 * @property string $body
 * @property string|null $img_name
 * @property string|null $img_url
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

	protected $fillable = [
		'user_id',
		'room_id',
		'body',
        'img_url',
        'img_name'
	];

	public function room()
	{
		return $this->belongsTo(ChatRoom::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
