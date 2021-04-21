<?php

namespace App\Http\Controllers;

use App\Models\Country;

class CountryController extends Controller
{
    /**
     * Returns collection of country objects
     *
     * @return Country[]|\Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        return Country::all();
    }
}
