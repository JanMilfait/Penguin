<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToChatParticipantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('chat_participants', function (Blueprint $table) {
            $table->foreign(['room_id'], 'fk_chat_participants')->references(['id'])->on('chat_rooms')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['user_id'], 'fk_chat_participants_users')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('chat_participants', function (Blueprint $table) {
            $table->dropForeign('fk_chat_participants');
            $table->dropForeign('fk_chat_participants_users');
        });
    }
}
