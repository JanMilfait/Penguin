<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsComment
 *
 * @property int $id
 * @property int $post_id
 * @property int $user_id
 * @property string|null $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Post $post
 * @property User $user
 * @property Collection|PostsCommentsReaction[] $posts_comments_reactions
 * @property Collection|PostsCommentsReply[] $posts_comments_replies
 *
 * @package App\Models
 */
class PostsComment extends Model
{
	protected $table = 'posts_comments';

    protected $hidden = [
        'post_id',
        'user_id',
        'reactions_count'
    ];

	protected $fillable = [
		'post_id',
		'user_id',
		'body'
	];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function reactions()
	{
		return $this->hasMany(PostsCommentsReaction::class, 'comment_id');
	}

	public function replies()
	{
		return $this->hasMany(PostsCommentsReply::class, 'comment_id');
	}

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->diffForHumans();
    }
}
