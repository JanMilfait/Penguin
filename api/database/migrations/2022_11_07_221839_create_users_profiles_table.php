<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->index('fk_users_profiles_users');
            $table->enum('visibility', ['public', 'friends', 'private'])->default('friends');
            $table->string('age', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('telephone', 20)->nullable();
            $table->string('address', 100)->nullable();
            $table->string('nationality', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_profiles');
    }
}
