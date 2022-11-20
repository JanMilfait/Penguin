<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToPostsVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts_videos', function (Blueprint $table) {
            $table->foreign(['post_id'], 'fk_posts_videos_posts')->references(['id'])->on('posts')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts_videos', function (Blueprint $table) {
            $table->dropForeign('fk_posts_videos_posts');
        });
    }
}
