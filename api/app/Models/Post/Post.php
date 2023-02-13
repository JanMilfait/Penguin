<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Post
 *
 * @property int $id
 * @property int $user_id
 * @property string $slug
 * @property string|null $body
 * @property float $interaction_score
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
    protected array $scores = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->scores = json_decode(file_get_contents(__DIR__ . '/interaction_scores.json'), true);
    }

	protected $table = 'posts';

    protected $hidden = [
        'user_id',
        'interaction_score'
    ];

	protected $fillable = [
		'user_id',
        'slug',
		'body',
        'interaction_score'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
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

    public function reports()
    {
        return $this->hasMany(PostsReport::class);
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->diffForHumans();
    }


    /////////////////////////////////////////////
    /// SCORES
    /////////////////////////////////////////////
    public function sharingScore($action)
    {
        $this->timestamps = false;
        if ($action === 'inc') {
            $this->interaction_score += $this->scores['sharing'];
        } elseif ($action === 'dec') {
            $this->interaction_score -= $this->scores['sharing'];
        }
        $this->save();
        $this->timestamps = true;
    }

    public function reactionScore($action)
    {
        $this->timestamps = false;
        if ($action === 'inc') {
            $this->interaction_score += $this->scores['reaction'];
        } elseif ($action === 'dec') {
            $this->interaction_score -= $this->scores['reaction'];
        }
        $this->save();
        $this->timestamps = true;
    }

    public function commentScore($action)
    {
        $this->timestamps = false;
        if ($action === 'inc') {
            $this->interaction_score += $this->scores['comment'];
        } elseif ($action === 'dec') {
            $this->interaction_score -= $this->scores['comment'];
        }
        $this->save();
        $this->timestamps = true;
    }

    public function commentReactionScore($action)
    {
        $this->timestamps = false;
        if ($action === 'inc') {
            $this->interaction_score += $this->scores['comment_reaction'];
        } elseif ($action === 'dec') {
            $this->interaction_score -= $this->scores['comment_reaction'];
        }
        $this->save();
        $this->timestamps = true;
    }

    public function replyScore($action)
    {
        $this->timestamps = false;
        if ($action === 'inc') {
            $this->interaction_score += $this->scores['reply'];
        } elseif ($action === 'dec') {
            $this->interaction_score -= $this->scores['reply'];
        }
        $this->save();
        $this->timestamps = true;
    }

    public function replyReactionScore($action)
    {
        $this->timestamps = false;
        if ($action === 'inc') {
            $this->interaction_score += $this->scores['reply_reaction'];
        } elseif ($action === 'dec') {
            $this->interaction_score -= $this->scores['reply_reaction'];
        }
        $this->save();
        $this->timestamps = true;
    }
}
