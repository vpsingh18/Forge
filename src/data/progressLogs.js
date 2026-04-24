// Seed progress logs — historical check-in data for PT members.
// Tracks 9 body-composition metrics from a professional scale (e.g. InBody / Tanita).
// New entries are added via AppContext dispatch('ADD_PROGRESS_LOG').
// ─────────────────────────────────────────────────────────────────────────────
// Metrics: weight(kg) | bmi | bodyFat(%) | fatFreeWeight(kg) | visceralFat(level)
//          muscleMass(kg) | boneMass(kg) | bodyWater(%) | age (metabolic age)
// ─────────────────────────────────────────────────────────────────────────────

export const progressLogs = [
    {
        memberId: 'member-1', // Arjun Mehta — Goal: Muscle Gain
        logs: [
            { id: 'l1-1', date: '2026-01-01', weight: 77.0, bmi: 24.3, bodyFat: 19.2, fatFreeWeight: 62.2, visceralFat: 8, muscleMass: 34.0, boneMass: 3.1, bodyWater: 54.2, age: 30 },
            { id: 'l1-2', date: '2026-01-15', weight: 76.5, bmi: 24.1, bodyFat: 18.8, fatFreeWeight: 62.1, visceralFat: 8, muscleMass: 34.5, boneMass: 3.1, bodyWater: 54.5, age: 30 },
            { id: 'l1-3', date: '2026-02-01', weight: 76.2, bmi: 24.0, bodyFat: 18.5, fatFreeWeight: 62.1, visceralFat: 7, muscleMass: 35.2, boneMass: 3.1, bodyWater: 55.0, age: 29 },
            { id: 'l1-4', date: '2026-02-15', weight: 75.5, bmi: 23.8, bodyFat: 18.2, fatFreeWeight: 61.7, visceralFat: 7, muscleMass: 36.0, boneMass: 3.2, bodyWater: 55.5, age: 29 },
            { id: 'l1-5', date: '2026-03-01', weight: 75.0, bmi: 23.7, bodyFat: 18.0, fatFreeWeight: 61.5, visceralFat: 7, muscleMass: 36.8, boneMass: 3.2, bodyWater: 56.0, age: 28 },
            // Slight regression — body fat crept up despite muscle gain
            { id: 'l1-6', date: '2026-03-15', weight: 75.8, bmi: 23.9, bodyFat: 18.4, fatFreeWeight: 61.9, visceralFat: 7, muscleMass: 37.2, boneMass: 3.2, bodyWater: 55.8, age: 28 },
        ]
    },
    {
        memberId: 'member-2', // Sneha Patel — Goal: Weight Loss
        logs: [
            { id: 'l2-1', date: '2025-11-01', weight: 62.0, bmi: 23.6, bodyFat: 28.0, fatFreeWeight: 44.6, visceralFat: 6, muscleMass: 24.0, boneMass: 2.4, bodyWater: 51.0, age: 27 },
            { id: 'l2-2', date: '2025-11-15', weight: 61.2, bmi: 23.3, bodyFat: 27.2, fatFreeWeight: 44.6, visceralFat: 6, muscleMass: 24.2, boneMass: 2.4, bodyWater: 51.5, age: 26 },
            { id: 'l2-3', date: '2025-12-01', weight: 60.5, bmi: 23.0, bodyFat: 26.5, fatFreeWeight: 44.5, visceralFat: 5, muscleMass: 24.5, boneMass: 2.4, bodyWater: 52.0, age: 26 },
            { id: 'l2-4', date: '2025-12-15', weight: 59.8, bmi: 22.7, bodyFat: 25.8, fatFreeWeight: 44.4, visceralFat: 5, muscleMass: 24.8, boneMass: 2.5, bodyWater: 52.5, age: 26 },
            { id: 'l2-5', date: '2026-01-01', weight: 59.2, bmi: 22.5, bodyFat: 25.2, fatFreeWeight: 44.3, visceralFat: 5, muscleMass: 25.0, boneMass: 2.5, bodyWater: 53.0, age: 25 },
            // Plateau — weight ticked up slightly
            { id: 'l2-6', date: '2026-01-15', weight: 59.5, bmi: 22.6, bodyFat: 25.0, fatFreeWeight: 44.6, visceralFat: 5, muscleMass: 25.1, boneMass: 2.5, bodyWater: 53.0, age: 25 },
        ]
    },
]
