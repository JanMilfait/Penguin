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
        // Send notification to pending user
        static::created(function ($pending) {

            $user = User::find($pending->user_id);

            broadcast(new SendNotification($pending->pending_user, 'pending', $pending->id, [
                'source' => 'pending',
                'source_id' => $pending->id,
                'state' => $pending->state,
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar_url . '40_' . $user->avatar_name
            ]));
        });

        // Send notification to original user
        static::updated(function ($pending) {
            if ($pending->isDirty('state') && $pending->state == 'accepted') {

                $user = User::find($pending->pending_user);

                broadcast(new SendNotification($pending->user_id, 'pending', $pending->id, [
                    'source' => 'pending',
                    'source_id' => $pending->id,
                    'state' => $pending->state,
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar_url . '40_' . $user->avatar_name
                ]));

            } elseif ($pending->isDirty('state') && $pending->state === 'declined') {

                $user = User::find($pending->pending_user);

                broadcast(new SendNotification($pending->user_id, 'pending', $pending->id, [
                    'source' => 'pending',
                    'source_id' => $pending->id,
                    'state' => $pending->state,
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar_url . '40_' . $user->avatar_name
                ]));
            }
        });
    }
}
