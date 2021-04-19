<?php

namespace App\Models;

use App\Models\Concerns\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;
    use UsesUuid;

    protected $table = 'countries';

    protected $fillable = ['name', 'iso_code', 'number'];

    protected $hidden = ['id'];

    protected $primaryKey = 'id';

    public $timestamps = true;
}
