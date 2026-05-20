<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeUserState extends Model
{
    use HasFactory;

    protected $table = 'challenge_user_states';

    protected $fillable = [
        'user_id',
        'challenge_id',
        'viewed_hint',
        'viewed_answer',
        'points_awarded',
        'is_solved',
    ];

    protected $casts = [
        'viewed_hint' => 'boolean',
        'viewed_answer' => 'boolean',
        'is_solved' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }
}
