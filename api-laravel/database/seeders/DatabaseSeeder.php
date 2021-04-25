<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * @return void
     */
    public function run()
    {
        $this->call([
            // If csv seeder is installed
            // and countries.csv file is in seeds/csvs dir
            ArtistSeeder::class,
            CountrySeeder::class
        ]);
    }
}

