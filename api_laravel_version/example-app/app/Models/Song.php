<?php

namespace App\Models;

use App\Models\Concerns\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Song extends Model
{
    use HasFactory;
    use UsesUuid;

    /**
     * All possible musical keys (key signatures)
     *
     * @var string[]
     */
    public static $MUSIC_KEYS = [
        'C', 'C#', 'D', 'D#', 'E', 'F',
        'F#', 'G', 'G#', 'A', 'B', 'H'
    ];

    protected $primaryKey = 'id';

    protected $table = 'songs';

    protected $fillable = [
        'id',
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

    public function album() : BelongsTo
    {
        return $this->belongsTo(Album::class);
    }
}
