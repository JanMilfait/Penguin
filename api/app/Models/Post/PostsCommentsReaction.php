<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsCommentsReaction
 *
 * @property int $id
 * @property int $comment_id
 * @property int $user_id
 * @property int $reaction
 * @property Carbon|null $created_at
 *
 * @property PostsComment $posts_comment
 * @property User $user
 *
 * @package App\Models
 */
class PostsCommentsReaction extends Model
{
	protected $table = 'posts_comments_reactions';

    const UPDATED_AT = null;

	protected $casts = [
		'reaction' => 'int'
	];

    protected $hidden = [
        'comment_id',
        'user_id',
        'created_at'
    ];

	protected $fillable = [
		'comment_id',
		'user_id',
		'reaction'
	];

	public function comment()
	{
		return $this->belongsTo(PostsComment::class, 'comment_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class)->select(['id', 'name', 'avatar_url']);
	}
}
