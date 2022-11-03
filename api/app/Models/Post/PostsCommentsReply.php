<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsCommentsReply
 *
 * @property int $id
 * @property int $comment_id
 * @property int $user_id
 * @property string|null $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property PostsComment $posts_comment
 * @property User $user
 * @property Collection|PostsCommentsRepliesReaction[] $posts_comments_replies_reactions
 *
 * @package App\Models
 */
class PostsCommentsReply extends Model
{
	protected $table = 'posts_comments_replies';

	protected $casts = [
		'comment_id' => 'int',
		'user_id' => 'int'
	];

	protected $fillable = [
		'comment_id',
		'user_id',
		'body'
	];

	public function posts_comment()
	{
		return $this->belongsTo(PostsComment::class, 'comment_id');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function posts_comments_replies_reactions()
	{
		return $this->hasMany(PostsCommentsRepliesReaction::class, 'comment_id');
	}
}
