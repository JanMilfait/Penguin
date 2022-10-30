<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFriendsPendingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('friends_pendings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->index('fk_friends_pendings_users_pending');
            $table->bigInteger('user_pending')->index('fk_friends_pendings_users');
            $table->integer('state');
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
        Schema::dropIfExists('friends_pendings');
    }
}
