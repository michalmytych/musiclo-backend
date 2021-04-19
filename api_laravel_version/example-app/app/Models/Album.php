<?php

namespace App\Models;

use App\Models\Concerns\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    use HasFactory;
    use UsesUuid;

    protected $table = 'albums';

    protected $fillable = [
        'name',
        'release_date',
        'spotify_link'
    ];

    protected $hidden = ['id'];

    protected $primaryKey = 'id';

    public function songs() : HasMany
    {
        return $this->hasMany(Song::class);
    }
}
