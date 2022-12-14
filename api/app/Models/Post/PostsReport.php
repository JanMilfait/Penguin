<?php

namespace App\Models\Post;

use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostsReport
 *
 * @property int $id
 * @property int $post_id
 * @property int $user_id
 * @property Carbon|null $created_at
 *
 * @property Post $post
 * @property User $user
 *
 * @package App\Models
 */
class PostsReport extends Model
{
    protected $table = 'posts_reports';

    const UPDATED_AT = null;

    protected $hidden = [
        'id',
        'post_id',
        'created_at'
    ];

    protected $fillable = [
        'post_id',
        'user_id',
        'reason'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
