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

    protected $hidden = [
        'user_id'
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
}
