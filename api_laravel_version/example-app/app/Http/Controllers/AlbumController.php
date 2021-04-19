<?php


namespace App\Http\Controllers;

use App\Models\Album;

class AlbumController extends Controller
{
    /**
     * Get all albums
     *
     * @return Album[]|\Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        return Album::all();
    }
}

