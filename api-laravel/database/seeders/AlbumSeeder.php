<?php

namespace Database\Seeders;

use JeroenZwart\CsvSeeder\CsvSeeder;

class AlbumSeeder extends CsvSeeder
{
    public function __construct()
    {
        $this->delimiter = '|';
        $this->skipper = [ 'artists_ids', 'songs_ids' ];
        $this->mapping = [
            'id',
            'name',
            'release_date',
            'spotify_link'
        ];
        $this->defaults = [
            'created_at' => null,
            'updated_at' => null,
        ];
        $this->file = __DIR__ . '/seeds/csvs/albums.csv';
    }

    /**
     * Run the database seeds.
     * @return void
     */
    public function run()
    {
        parent::run();
    }
}
