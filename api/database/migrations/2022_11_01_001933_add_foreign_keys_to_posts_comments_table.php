<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToPostsCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts_comments', function (Blueprint $table) {
            $table->foreign(['post_id'], 'fk_posts_comments_posts')->references(['id'])->on('posts')->onUpdate('NO ACTION')->onDelete('CASCADE');
            $table->foreign(['user_id'], 'fk_posts_comments_users')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts_comments', function (Blueprint $table) {
            $table->dropForeign('fk_posts_comments_posts');
            $table->dropForeign('fk_posts_comments_users');
        });
    }
}
