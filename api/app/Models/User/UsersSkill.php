<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

/**
 * Class UsersSkill
 *
 * @property int $id
 * @property int $user_id
 * @property int $skill_id
 *
 * @property Skill $skill
 * @property User $user
 *
 * @package App\Models
 */
class UsersSkill extends Model
{
	protected $table = 'users_skills';

    public $timestamps = false;

	protected $casts = [
		'user_id' => 'int',
		'skill_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'skill_id'
	];

	public function skill()
	{
		return $this->belongsTo(Skill::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
