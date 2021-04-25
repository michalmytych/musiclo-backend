<?php

namespace Database\Seeders;

use JeroenZwart\CsvSeeder\CsvSeeder;

class CountrySeeder extends CsvSeeder
{
    public function __construct()
    {
        $this->delimiter = ',';
        $this->mapping = ['iso_code','name','number'];
        $defaults = [
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

