<?php

namespace App\Models\Post;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsVideo
 *
 * @property int $id
 * @property int $post_id
 * @property string $name
 * @property string $url
 * @property Carbon|null $created_at
 *
 * @property Post $post
 *
 * @package App\Models
 */
class PostsVideo extends Model
{
	protected $table = 'posts_videos';

    const UPDATED_AT = null;

    protected $hidden = [
        'post_id',
        'created_at'
    ];

	protected $fillable = [
		'post_id',
		'name',
		'url'
	];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}
}
