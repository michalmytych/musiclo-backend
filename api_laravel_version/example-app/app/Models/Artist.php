<?php

namespace App\Models;

use App\Models\Concerns\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Artist extends Model
{
    use HasFactory;
    use UsesUuid;

    protected $primaryKey = 'id';

    protected $table = 'artists';

    protected $fillable = [
        'name',
        'country_code',
        'description',
        'spotify_link'
    ];

    protected $hidden = ['id'];

    public function country() : BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
