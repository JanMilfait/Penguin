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

    protected $hidden = [
        'comment_id',
        'user_id'
    ];

	protected $fillable = [
		'comment_id',
		'user_id',
		'body'
	];

	public function comment()
	{
		return $this->belongsTo(PostsComment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class)->select(['id', 'name', 'avatar_name', 'avatar_url']);
	}

	public function reactions()
	{
		return $this->hasMany(PostsCommentsRepliesReaction::class, 'comment_id');
	}

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->diffForHumans();
    }
}
