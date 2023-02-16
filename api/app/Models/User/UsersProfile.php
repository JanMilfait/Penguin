<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UsersProfile
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $age
 * @property string|null $description
 * @property string|null $telephone
 * @property string|null $address
 * @property string|null $nationality
 *
 * @property User $user
 *
 * @package App\Models
 */
class UsersProfile extends Model
{
    use HasFactory;

	protected $table = 'users_profiles';

    public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

    protected $hidden = [
        'id',
        'user_id'
    ];

	protected $fillable = [
		'user_id',
		'age',
		'description',
		'telephone',
		'address',
		'nationality'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
