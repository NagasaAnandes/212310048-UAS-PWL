<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'company_name',
        'company_image',
        'category',
        'boycott',
        'boycott_reason',
        'alternative',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
