<?php

namespace Database\Seeders;

use JeroenZwart\CsvSeeder\CsvSeeder;

class ArtistSeeder extends CsvSeeder
{
    public function __construct()
    {
        $this->delimiter = '|';
        $this->mapping = [
            'id',
            'name',
            'spotify_link',
            'country_id'
        ];
        $this->defaults = [
            'description' => null,
            'created_at' => null,
            'updated_at' => null,
        ];
        $this->file = __DIR__ . '/seeds/csvs/artists.csv';
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        parent::run();
    }
}
