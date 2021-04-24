<?php

namespace Database\Seeders;

use App\Models\Song;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @todo - write a better seeder
     * @return void
     */
    public function run()
    {
        DB::table('songs')->insert([
            'id' => Str::random(28),
            'name' => Str::random(10),
            'explicit' => random_int(0, 1),
            // 'album_id' => Str::random(28),
            'key' => array_rand(Song::$MUSIC_KEYS),
            'mode' => random_int(0, 1),
            'danceability' => 0.12,
            'energy' => 0.12,
            'acousticness' => 0.12,
            'instrumentalness' => 0.12,
            'valence' => 0.12,
            'release_date' => '1999-12-02',
            'spotify_link' => Str::random(128),
        ]);
    }
}
