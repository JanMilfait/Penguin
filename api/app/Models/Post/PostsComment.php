<?php

namespace App\Models\Post;

use App\Events\SendNotification;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Str;

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
        'user_id'
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
		return $this->belongsTo(User::class)->select(['id', 'name', 'avatar_name', 'avatar_url']);
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


    /**
     * Notifications (send to client, save to database)
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($comment) {

            // Don't send notification if commenting own post
            if ($comment->post->user_id === $comment->user_id) {
                return;
            }

            broadcast(new SendNotification($comment->post->user_id, 'comment', $comment->id, [
                'source' => 'comment',
                'source_id' => $comment->id,
                'preview' => Str::limit($comment->body, 50),
                'id' => $comment->user->id,
                'name' => $comment->user->name,
                'avatar' => $comment->user->avatar_url . '40_' . $comment->user->avatar_name
            ]));
        });
    }
}
