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
 * @property Carbon|null $created_at
 *
 * @property User $user
 * @property Collection|ChatMessage[] $chat_messages
 * @property Collection|ChatParticipant[] $chat_participants
 *
 * @package App\Models
 */
class ChatRoom extends Model
{
	protected $table = 'chat_rooms';

    const UPDATED_AT = null;

	public function messages()
	{
        return $this->hasMany(ChatMessage::class, 'room_id');
    }

    public function participants()
    {
        return $this->hasMany(ChatParticipant::class, 'room_id');
    }
}
