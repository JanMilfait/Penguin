<?php

namespace App\Models\Chat;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    use HasFactory;

	protected $table = 'chat_messages';

    const UPDATED_AT = null;

    protected $hidden = [
        'room_id'
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
}
