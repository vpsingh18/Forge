// ─── trendEngine.js ──────────────────────────────────────────────────────────
// Goal-aware body-composition trend engine.
// Compares current_log vs previous_log and returns per-metric trend objects.
//
// @typedef {'UP'|'DOWN'|'STABLE'}           Direction
// @typedef {'POSITIVE'|'NEGATIVE'|'NEUTRAL'} Sentiment
// @typedef {'MASS_GAIN'|'FAT_LOSS'|'HYPERTROPHY'|'RECOMPOSITION'} GoalKey
// ─────────────────────────────────────────────────────────────────────────────

/** 0.5 % deadzone — changes smaller than this are treated as STABLE */
const DEADZONE = 0.005

/** These metrics always carry NEUTRAL sentiment regardless of direction */
const INERT_METRICS = new Set(['boneMass', 'bodyWater', 'age'])

/** All 9 trackable metric keys (ordered for iteration) */
const METRIC_KEYS = [
    'weight', 'bmi', 'bodyFat', 'fatFreeWeight',
    'visceralFat', 'muscleMass', 'boneMass', 'bodyWater', 'age',
]

// ─────────────────────────────────────────────────────────────────────────────
// GOAL_CONFIG — extensible JSON-style config.
// Each entry is a function: (direction, key, currentLog, prevLog) => Sentiment
// Add new goals by adding new keys here.
// ─────────────────────────────────────────────────────────────────────────────
export const GOAL_CONFIG = {
    /**
     * FAT_LOSS:
     *   POSITIVE if Weight/BMI/BodyFat/VisceralFat go DOWN.
     *   POSITIVE if MuscleMass/FatFreeWeight go UP or stay STABLE.
     */
    FAT_LOSS: (dir, key) => {
        if (['weight', 'bmi', 'bodyFat', 'visceralFat'].includes(key)) {
            if (dir === 'DOWN') return 'POSITIVE'
            if (dir === 'UP')   return 'NEGATIVE'
            return 'NEUTRAL'
        }
        if (['muscleMass', 'fatFreeWeight'].includes(key)) {
            return (dir === 'UP' || dir === 'STABLE') ? 'POSITIVE' : 'NEGATIVE'
        }
        return 'NEUTRAL'
    },

    /**
     * MASS_GAIN:
     *   POSITIVE if Weight & MuscleMass go UP.
     *   NEUTRAL  if BodyFat goes UP slightly (fat-mass increase ≤ 1% of bodyweight).
     *   NEGATIVE if Weight goes DOWN.
     */
    MASS_GAIN: (dir, key, c, p) => {
        if (key === 'weight') {
            return dir === 'UP' ? 'POSITIVE' : dir === 'DOWN' ? 'NEGATIVE' : 'NEUTRAL'
        }
        if (key === 'muscleMass') {
            return dir === 'UP' ? 'POSITIVE' : dir === 'DOWN' ? 'NEGATIVE' : 'NEUTRAL'
        }
        if (key === 'bodyFat' && dir === 'UP') {
            const fatDelta      = (c.bodyFat ?? 0) - (p.bodyFat ?? 0)
            const fatMassIncrease = (fatDelta / 100) * (c.weight ?? p.weight ?? 0)
            const threshold     = 0.01 * (c.weight ?? p.weight ?? 0)
            return fatMassIncrease <= threshold ? 'NEUTRAL' : 'NEGATIVE'
        }
        if (key === 'bodyFat' && dir === 'DOWN') return 'POSITIVE'
        return 'NEUTRAL'
    },

    /**
     * HYPERTROPHY:
     *   POSITIVE ONLY if MuscleMass & FatFreeWeight go UP.
     *   NEUTRAL  if Weight goes UP (but MuscleMass also goes UP).
     *   NEGATIVE if Weight goes UP while MuscleMass is STABLE or DOWN.
     */
    HYPERTROPHY: (dir, key, c, p) => {
        if (key === 'muscleMass' || key === 'fatFreeWeight') {
            return dir === 'UP' ? 'POSITIVE' : dir === 'DOWN' ? 'NEGATIVE' : 'NEUTRAL'
        }
        if (key === 'weight' && dir === 'UP') {
            const muscleDelta = (c.muscleMass ?? 0) - (p.muscleMass ?? 0)
            const muscleDir   = _direction(muscleDelta, p.muscleMass ?? 1)
            return muscleDir === 'UP' ? 'NEUTRAL' : 'NEGATIVE'
        }
        return 'NEUTRAL'
    },

    /**
     * RECOMPOSITION:
     *   POSITIVE ("Holy Grail") if BodyFat DOWN & MuscleMass UP.
     *   POSITIVE if Weight STABLE but BodyFat DOWN.
     *   NEGATIVE if BodyFat goes UP.
     */
    RECOMPOSITION: (dir, key, c, p) => {
        if (key === 'bodyFat') {
            return dir === 'DOWN' ? 'POSITIVE' : dir === 'UP' ? 'NEGATIVE' : 'NEUTRAL'
        }
        if (key === 'muscleMass') {
            return dir === 'UP' ? 'POSITIVE' : dir === 'DOWN' ? 'NEGATIVE' : 'NEUTRAL'
        }
        if (key === 'weight' && dir === 'UP') {
            const fatDelta = (c.bodyFat ?? 0) - (p.bodyFat ?? 0)
            return _direction(fatDelta, p.bodyFat ?? 1) === 'DOWN' ? 'NEUTRAL' : 'NEGATIVE'
        }
        return 'NEUTRAL'
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Internal direction helper used by goal functions */
function _direction(delta, previousValue) {
    const pct = Math.abs(delta) / (Math.abs(previousValue) || 1)
    if (pct < DEADZONE) return 'STABLE'
    return delta > 0 ? 'UP' : 'DOWN'
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyzes body-composition trends between two check-in logs.
 *
 * @param {Object|null} current_log  — Most recent check-in object.
 * @param {Object|null} previous_log — Preceding check-in object (null = first entry).
 * @param {string}      user_goal    — GoalKey string (MASS_GAIN | FAT_LOSS | HYPERTROPHY | RECOMPOSITION).
 * @returns {{ status: 'INITIAL_ENTRY'|'TREND', metrics: Record<string,{direction,sentiment,delta}>|null }}
 */
export function analyzeTrends(current_log, previous_log, user_goal) {
    if (!previous_log) return { status: 'INITIAL_ENTRY', metrics: null }

    const goalFn  = GOAL_CONFIG[user_goal] ?? GOAL_CONFIG['FAT_LOSS']
    const metrics = {}

    for (const key of METRIC_KEYS) {
        const c = current_log?.[key]
        const p = previous_log?.[key]

        if (c == null || p == null) {
            metrics[key] = { direction: 'STABLE', sentiment: 'NEUTRAL', delta: 0 }
            continue
        }

        const rawDelta  = parseFloat((c - p).toFixed(2))
        const direction = _direction(rawDelta, p)
        const sentiment = INERT_METRICS.has(key)
            ? 'NEUTRAL'
            : goalFn(direction, key, current_log, previous_log)

        metrics[key] = { direction, sentiment, delta: Math.abs(rawDelta) }
    }

    return { status: 'TREND', metrics }
}

/**
 * Maps a member's goal string to a GoalKey enum.
 * Add new mappings here as the app grows.
 *
 * @param {string} goalString
 * @returns {string} GoalKey
 */
export function mapGoalToEnum(goalString) {
    const map = {
        'Muscle Gain':     'MASS_GAIN',
        'Weight Loss':     'FAT_LOSS',
        'Strength':        'HYPERTROPHY',
        'General Fitness': 'RECOMPOSITION',
        'Flexibility':     'FAT_LOSS',
        // Pass-through for already-mapped keys
        'MASS_GAIN':       'MASS_GAIN',
        'FAT_LOSS':        'FAT_LOSS',
        'HYPERTROPHY':     'HYPERTROPHY',
        'RECOMPOSITION':   'RECOMPOSITION',
    }
    return map[goalString] ?? 'FAT_LOSS'
}
