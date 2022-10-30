<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsCommentsReactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts_comments_reactions', function (Blueprint $table) {
            $table->bigInteger('id', true);
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
        Schema::dropIfExists('posts_comments_reactions');
    }
}
