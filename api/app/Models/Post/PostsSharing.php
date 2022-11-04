<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsSharing
 *
 * @property int $id
 * @property int $post_id
 * @property int $user_id
 * @property Carbon|null $created_at
 *
 * @property Post $post
 * @property User $user
 *
 * @package App\Models
 */
class PostsSharing extends Model
{
	protected $table = 'posts_sharing';

    const UPDATED_AT = null;

    protected $hidden = [
        'post_id',
        'user_id',
    ];

	protected $fillable = [
		'post_id',
		'user_id'
	];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class)->select(['id', 'name', 'avatar_url']);
	}
}
