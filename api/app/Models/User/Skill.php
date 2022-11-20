<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Skill
 *
 * @property int $id
 * @property string $created_by
 * @property string $name
 * @property string|null $description
 * @property string|null $tag
 * @property string|null $image_url
 *
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Skill extends Model
{
	protected $table = 'skills';

    public $timestamps = false;

    protected $hidden = [
        'pivot',
        'id'
    ];

	protected $fillable = [
        'created_by',
		'name',
		'description',
		'tag',
		'image_url'
	];

	public function users()
	{
		return $this->belongsToMany(User::class, 'users_skills')
					->withPivot('id');
	}

    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

}
