<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $table = 'albums';

    protected $fillable = [
        'name',
        'release_date',
        'spotify_link'
    ];

    protected $primaryKey = 'id';
}
