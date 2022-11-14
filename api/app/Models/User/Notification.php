<?php

namespace App\Models\User;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Notification
 *
 * @property int $id
 * @property int $user_id
 * @property string $source
 * @property int|null $source_id
 * @property string|null $source_data
 * @property Carbon|null $created_at
 *
 * @property User $user
 *
 * @package App\Models
 */
class Notification extends Model
{
	protected $table = 'notifications';

    const UPDATED_AT = null;

	protected $casts = [
		'user_id' => 'int',
		'source_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'source',
		'source_id',
        'source_data'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
