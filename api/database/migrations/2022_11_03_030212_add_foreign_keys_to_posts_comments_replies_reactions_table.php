<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToPostsCommentsRepliesReactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts_comments_replies_reactions', function (Blueprint $table) {
            $table->foreign(['user_id'], 'fk_posts_comments_replies_reactions_users')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['comment_id'], 'fk_posts_comments_replies_reactions')->references(['id'])->on('posts_comments_replies')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts_comments_replies_reactions', function (Blueprint $table) {
            $table->dropForeign('fk_posts_comments_replies_reactions_users');
            $table->dropForeign('fk_posts_comments_replies_reactions');
        });
    }
}
