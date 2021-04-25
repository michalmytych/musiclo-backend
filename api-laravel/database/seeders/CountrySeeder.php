<?php

namespace Database\Seeders;

use JeroenZwart\CsvSeeder\CsvSeeder;

class CountrySeeder extends CsvSeeder
{
    public function __construct()
    {
        $this->delimiter = '|';
        $this->mapping = [
            'id',
            'iso_code',
            'name',
            'number_code'
        ];
        $this->defaults = [
            'id' => '0',
            'created_at' => null,
            'updated_at' => null,
        ];
        $this->file = __DIR__ . '/seeds/csvs/countries.csv';
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

