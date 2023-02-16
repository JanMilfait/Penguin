<?php

namespace App\Models\Post;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsImage
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
class PostsImage extends Model
{
    use HasFactory;

	protected $table = 'posts_images';

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
