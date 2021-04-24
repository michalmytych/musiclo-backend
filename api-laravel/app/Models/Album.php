<?php

namespace App\Models;

use App\Models\Concerns\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Album
 * @package App\Models
 */
class Album extends Model
{
    use HasFactory;
    use UsesUuid;

    protected $table = 'albums';

    protected $fillable = [
        'id',
        'name',
        'release_date',
        'spotify_link'
    ];

    protected $with = ['songs', 'artists'];

    protected $primaryKey = 'id';

    /**
     * Returns album relations with Songs
     * @return HasMany
     */
    public function songs(): HasMany
    {
        return $this->hasMany(Song::class)
            ->select('album_id', 'name', 'id');
    }

    /**
     * Returns album relations with Aritsts
     * @return BelongsToMany
     */
    public function artists(): belongsToMany
    {
        return $this->belongsToMany(Artist::class)->
            select('album_id', 'name', 'artists.id');
    }

    /**
     * Updates album relations with Songs
     * @param array $songsIds
     */
    public function updateSongs(array $songsIds) : void
    {
        $songsToSave = Song::all()->whereIn('id', $songsIds);
        $this->songs()->delete();
        $this->songs()->saveMany($songsToSave);
    }

    /**
     * Updates album relations with Artists
     * @param array $artistsIs
     */
    public function updateArtists(array $artistsIs) : void
    {
        $artistsToSync = Artist::all()->whereIn('id', $artistsIs);
        $this->artists()->sync($artistsToSync);
    }
}

