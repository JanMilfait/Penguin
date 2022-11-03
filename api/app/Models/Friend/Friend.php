<?php

namespace App\Models\Friend;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Friend
 *
 * @property int $id
 * @property int $user_a
 * @property int $user_b
 * @property Carbon|null $created_at
 *
 * @property User $user
 *
 * @package App\Models
 */
class Friend extends Model
{
	protected $table = 'friends';

    const UPDATED_AT = null;

	protected $casts = [
		'user_a' => 'int',
		'user_b' => 'int'
	];

	protected $fillable = [
		'user_a',
		'user_b'
	];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_a');
    }
}
