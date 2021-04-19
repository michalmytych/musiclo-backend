<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $table = 'songs';

    protected $fillable = [
        'name',
        'explicit',
        'album_id',
        'key',
        'mode',
        'danceability',
        'energy',
        'acousticness',
        'instrumentalness',
        'valence',
        'release_date',
        'spotify_link'
    ];

    protected $primaryKey = 'id';
}
