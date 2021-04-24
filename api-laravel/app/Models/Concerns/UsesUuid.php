<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * Adds uuid generation functionality to Models.
 * Trait UsesUuid
 * @package App\Models\Concerns
 */
trait UsesUuid
{
    protected static function bootUsesUuid() : void
    {
        static::creating(function ($model) {
            if (! $model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * Returns true if uuid is incremented
     * @return bool
     */
    public function getIncrementing() : bool
    {
        return false;
    }

    /**
     * Get key attribute type
     * @return string
     */
    public function getKeyType() : string
    {
        return 'string';
    }
}
