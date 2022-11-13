<?php

namespace App\Models\Post;

use App\Events\SendNotification;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Str;

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


    /**
     * Notifications (send to client, save to database)
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($reply) {

            // Don't send notification if replying to own comment
            if ($reply->comment->user_id === $reply->user_id) {
                return;
            }

            broadcast(new SendNotification($reply->comment->user->id, 'reply', $reply->id, [
                'source' => 'reply',
                'source_id' => $reply->id,
                'preview' => Str::limit($reply->body, 50),
                'id' => $reply->user->id,
                'name' => $reply->user->name,
                'avatar' => $reply->user->avatar_url . '40_' . $reply->user->avatar_name
            ]));
        });
    }
}
