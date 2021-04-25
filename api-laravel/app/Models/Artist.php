<?php

namespace App\Models;

use App\Models\Concerns\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class Artist
 * @package App\Models
 * @todo - Implement repository pattern
 * @link - https://itnext.io/repository-design-pattern-done-right-in-laravel-d177b5fa75d4
 */

class Artist extends Model
{
    use HasFactory;
    use UsesUuid;

    protected $primaryKey = 'id';

    protected $table = 'artists';

    protected $fillable = [
        'name',
        'country_id',
        'description',
        'spotify_link'
    ];

    protected $with = ['country', 'albums'];

    /**
     * Relation with country attached to Artist instance
     * @return BelongsTo
     */
    public function country() : BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Artist relation with Albums
     * @return BelongsToMany
     */
    public function albums(): belongsToMany
    {
        /**
         * @todo - delete pivot
         */
        return $this->belongsToMany(
            Album::class,
            'album_artist',
            'album_id',
            'artist_id')->
            select('artist_id', 'name', 'albums.id');
    }

    /**
     * Update Albums related to artist instance
     * @param array $albumsIds
     */
    public function updateAlbums(array $albumsIds) : void
    {
        $albumsToSync = Album::all()->whereIn('id', $albumsIds);
        $this->albums()->sync($albumsToSync);
    }
}

