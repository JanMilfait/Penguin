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
 * @property string $type
 * @property string $last_message
 * @property string $last_message_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
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

    protected $hidden = [
        'created_at'
    ];

    protected $fillable = [
        'type',
        'last_message',
        'last_message_by'
    ];

	public function messages()
	{
        return $this->hasMany(ChatMessage::class, 'room_id');
    }

    public function participants()
    {
        return $this->hasMany(ChatParticipant::class, 'room_id');
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, ChatParticipant::class, 'room_id', 'id', 'id', 'user_id');
    }

    public function getLastMessageByAttribute($value)
    {
        return auth()->id() === $value ? 'Me:' : User::find($value)->name ?? null;
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->diffForHumans();
    }
}
