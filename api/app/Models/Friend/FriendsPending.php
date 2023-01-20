<?php

namespace App\Models\Friend;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class FriendsPending
 *
 * @property int $id
 * @property int $user_id
 * @property int $pending_user
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

	protected $hidden = [
		'user_id',
        'pending_user',
	];

	protected $fillable = [
		'user_id',
		'pending_user',
		'state'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

    public function pending()
    {
        return $this->belongsTo(User::class, 'pending_user');
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->diffForHumans();
    }
}
