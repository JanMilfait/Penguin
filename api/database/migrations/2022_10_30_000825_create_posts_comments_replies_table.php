<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsCommentsRepliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts_comments_replies', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('comment_id')->unique('unq_posts_comments_post_id');
            $table->bigInteger('user_id')->index('fk_posts_comments_users');
            $table->string('body', 8000)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts_comments_replies');
    }
}
