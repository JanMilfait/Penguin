<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsReaction
 *
 * @property int $id
 * @property int $post_id
 * @property int $user_id
 * @property int $reaction
 * @property Carbon|null $created_at
 *
 * @property Post $post
 * @property User $user
 *
 * @package App\Models
 */
class PostsReaction extends Model
{
	protected $table = 'posts_reactions';

    const UPDATED_AT = null;

    protected $casts = [
		'reaction' => 'int'
	];

    protected $hidden = [
        'post_id',
        'user_id',
        'created_at'
    ];

	protected $fillable = [
		'post_id',
		'user_id',
		'reaction'
	];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class)->select(['id', 'name', 'avatar_name', 'avatar_url']);
	}
}
