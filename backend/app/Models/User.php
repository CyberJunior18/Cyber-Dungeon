<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'points',
        'avatar',
        'role',
        'can_create_challenges',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'can_create_challenges' => 'boolean',
        ];
    }

    public function challenges()
    {
        return $this->hasMany(Challenge::class, 'creator_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
