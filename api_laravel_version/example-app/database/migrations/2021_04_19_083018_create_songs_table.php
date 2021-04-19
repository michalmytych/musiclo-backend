<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Song;

class CreateSongsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('songs', function (Blueprint $table) {
            //$table->increments('id');
            $table->string('uuid', 36)->unique();
            $table->timestamps();
            $table->string('name', 96)->nullable(false);
            $table->boolean('explicit')
                ->default(false)
                ->nullable();
            $table->uuid('album_id')->nullable();
            $table->foreign('album_id')
                ->references('id')
                ->on('albums')
                ->onDelete('set null');
            $table->enum('key', Song::$MUSIC_KEYS)->nullable();
            $table->boolean('mode')
                ->default(1)
                ->nullable();
            $table->decimal('danceability', $precision = 3, $scale = 2)->nullable();
            $table->decimal('energy', $precision = 3, $scale = 2)->nullable();
            $table->decimal('acousticness', $precision = 3, $scale = 2)->nullable();
            $table->decimal('instrumentalness', $precision = 3, $scale = 2)->nullable();
            $table->decimal('valence', $precision = 3, $scale = 2)->nullable();
            $table->dateTime('release_date', $precision = 0)->nullable();
            $table->string('spotify_link', 160)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('songs');
    }
}
