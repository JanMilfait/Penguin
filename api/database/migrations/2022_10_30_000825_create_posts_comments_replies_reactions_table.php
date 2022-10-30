<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsCommentsRepliesReactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts_comments_replies_reactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('comment_id')->unique('unq_posts_reactions_post_id');
            $table->bigInteger('user_id')->index('fk_posts_reactions_users');
            $table->integer('reaction');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts_comments_replies_reactions');
    }
}
