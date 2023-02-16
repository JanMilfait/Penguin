<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Skill
 *
 * @property int $id
 * @property string $user_id
 * @property string $name
 * @property string $tag
 * @property string|null $description
 * @property string|null $icon_url
 *
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Skill extends Model
{
    use HasFactory;

	protected $table = 'skills';

    const UPDATED_AT = null;

    protected $hidden = [
        'user_id',
        'pivot',
        'created_at',
    ];

	protected $fillable = [
        'user_id',
		'name',
		'description',
		'tag',
		'icon_url'
	];

	public function users()
	{
		return $this->belongsToMany(User::class, 'users_skills')
					->withPivot('id');
	}

    public function created_by()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function setTagAttribute($value)
    {
        $this->attributes['tag'] = strtoupper($value);
    }
}
