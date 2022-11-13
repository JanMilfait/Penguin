<?php

namespace App\Models\Post;

use App\Events\SendNotification;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Str;

/**
 * Class Post
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property User $user
 * @property Collection|PostsComment[] $posts_comments
 * @property Collection|PostsImage[] $posts_images
 * @property Collection|PostsReaction[] $posts_reactions
 * @property Collection|PostsSharing[] $posts_sharings
 * @property Collection|PostsVideo[] $posts_videos
 *
 * @package App\Models
 */
class Post extends Model
{
	protected $table = 'posts';

    protected $hidden = [
        'user_id'
    ];

	protected $fillable = [
		'user_id',
		'body'
	];

	public function user()
	{
		return $this->belongsTo(User::class)->select(['id', 'name', 'avatar_name', 'avatar_url']);
	}

	public function comments()
	{
		return $this->hasMany(PostsComment::class);
	}

	public function image()
	{
		return $this->hasOne(PostsImage::class);
	}

	public function reactions()
	{
		return $this->hasMany(PostsReaction::class);
	}

	public function sharings()
	{
		return $this->hasMany(PostsSharing::class);
	}

	public function video()
	{
		return $this->hasOne(PostsVideo::class);
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
        static::created(function ($post) {

            $post->user->friends->each(function ($friend) use ($post) {
                broadcast(new SendNotification($friend->user->id, 'post', $post->id,[
                    'source' => 'post',
                    'source_id' => $post->id,
                    'preview' => Str::limit($post->body, 50),
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'avatar' => $post->user->avatar_url . '40_' . $post->user->avatar_name
                ]));
            });
        });
    }
}
