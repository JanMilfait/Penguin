<?php

namespace App\Models\Friend;

use App\Events\SendNotification;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class FriendsPending
 *
 * @property int $id
 * @property int $user_id
 * @property int $pending_user
 * @property string $pending_name
 * @property string $state
 * @property Carbon|null $created_at
 *
 * @property User $user
 *
 * @package App\Models
 */
class FriendsPending extends Model
{
	protected $table = 'friends_pendings';

	protected $casts = [
		'user_id' => 'int',
		'pending_user' => 'int'
	];

	protected $fillable = [
		'user_id',
        'user_name',
		'pending_user',
        'pending_name',
		'state'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

    public function pending_user()
    {
        return $this->belongsTo(User::class, 'pending_user');
    }


    /**
     * Notifications (send to client, save to database)
     *
     * @return void
     */
    protected static function booted()
    {
        // Pending created -> send notification to pending user
        static::created(function ($pending) {
            broadcast(new SendNotification($pending->pending_user, 'pending', $pending->id, [
                'user_id' => $pending->user_id,
                'user_name' => $pending->user_name,
                'pending_user' => $pending->pending_user,
                'pending_name' => $pending->pending_name,
                'state' => $pending->state
            ]));
        });

        // Pending accepted -> send notification to original user
        static::updated(function ($pending) {
            if ($pending->state === 'accepted') {
                broadcast(new SendNotification($pending->user_id, 'pending', $pending->id, [
                    'user_id' => $pending->user_id,
                    'user_name' => $pending->user_name,
                    'pending_user' => $pending->pending_user,
                    'pending_name' => $pending->pending_name,
                    'state' => $pending->state
                ]));
            }
        });

        // Pending declined -> send notification to original user
        static::updated(function ($pending) {
            if ($pending->state === 'declined') {
                broadcast(new SendNotification($pending->user_id, 'pending', $pending->id, [
                    'user_id' => $pending->user_id,
                    'user_name' => $pending->user_name,
                    'pending_user' => $pending->pending_user,
                    'pending_name' => $pending->pending_name,
                    'state' => $pending->state
                ]));
            }
        });
    }
}
