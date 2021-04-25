<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * @return void
     */
    public function run()
    {
        /**
         * Only for use in development env!
         */
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            CountrySeeder::class,
            ArtistSeeder::class
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

