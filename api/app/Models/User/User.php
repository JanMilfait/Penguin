<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Chat\ChatMessage;
use App\Models\Friend\Friend;
use App\Models\Friend\FriendsPending;
use App\Models\Post\Post;
use App\Models\Post\PostsComment;
use App\Models\Post\PostsCommentsReaction;
use App\Models\Post\PostsCommentsRepliesReaction;
use App\Models\Post\PostsCommentsReply;
use App\Models\Post\PostsReaction;
use App\Models\Post\PostsSharing;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property bool $is_active
 * @property string|null $avatar_name
 * @property string|null $avatar_url
 * @property string $visibility
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Collection|ChatMessage[] $chat_messages
 * @property Collection|Friend[] $friends
 * @property Collection|FriendsPending[] $friends_pendings
 * @property Collection|Notification[] $notifications
 * @property Collection|Post[] $posts
 * @property Collection|PostsComment[] $posts_comments
 * @property Collection|PostsCommentsReaction[] $posts_comments_reactions
 * @property Collection|PostsCommentsReply[] $posts_comments_replies
 * @property Collection|PostsCommentsRepliesReaction[] $posts_comments_replies_reactions
 * @property Collection|PostsReaction[] $posts_reactions
 * @property Collection|PostsSharing[] $posts_sharings
 * @property Collection|UsersProfile[] $users_profiles
 * @property Collection|Skill[] $skills
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

	protected $table = 'users';

	protected $casts = [
        'is_active' => 'int',
        'email_verified_at' => 'datetime'
	];

	protected $hidden = [
		'password',
		'remember_token',
        'email_verified_at',
        'email',
        'is_active',
        'created_at',
        'updated_at',
        'laravel_through_key',
        'profile_visibility'
	];

	protected $fillable = [
		'name',
		'email',
		'password',
		'is_active',
        'avatar_name',
		'avatar_url',
        'profile_visibility'
    ];

	public function messages()
	{
		return $this->hasMany(ChatMessage::class);
	}

	public function friends()
	{
		return $this->hasMany(Friend::class, 'user_a');
	}

	public function pendings()
	{
		return $this->hasMany(FriendsPending::class);
	}

	public function notifications()
	{
		return $this->hasMany(Notification::class);
	}

	public function posts()
	{
		return $this->hasMany(Post::class);
	}

	public function posts_comments()
	{
		return $this->hasMany(PostsComment::class);
	}

	public function posts_comments_reactions()
	{
		return $this->hasMany(PostsCommentsReaction::class);
	}

	public function posts_comments_replies()
	{
		return $this->hasMany(PostsCommentsReply::class);
	}

	public function posts_comments_replies_reactions()
	{
		return $this->hasMany(PostsCommentsRepliesReaction::class);
	}

	public function posts_reactions()
	{
		return $this->hasMany(PostsReaction::class);
	}

	public function posts_sharings()
	{
		return $this->hasMany(PostsSharing::class);
	}

	public function profile()
	{
		return $this->hasOne(UsersProfile::class);
	}

	public function skills()
	{
		return $this->belongsToMany(Skill::class, 'users_skills')
					->withPivot('id');
	}

    public function skills_created()
    {
        return $this->hasMany(Skill::class);
    }

    public function hasFriend($user_id)
    {
        if ($this->friends()->where('user_b', $user_id)->exists()) {
            return true;
        }

        if ($this->id === $user_id) { // It's me
            return true;
        }

        return false;
    }
}
