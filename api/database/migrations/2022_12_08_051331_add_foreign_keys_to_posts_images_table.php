<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToPostsImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts_images', function (Blueprint $table) {
            $table->foreign(['post_id'], 'fk_posts_images_posts')->references(['id'])->on('posts')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts_images', function (Blueprint $table) {
            $table->dropForeign('fk_posts_images_posts');
        });
    }
}