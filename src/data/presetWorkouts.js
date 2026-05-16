// Seed Programs — multi-day workout programs with per-set customization.
// Used as local in-memory storage until a real DB is wired up.

export const programs = [
    {
        id: 'program-1',
        name: 'PPL Hypertrophy',
        createdAt: '2026-03-01',
        days: [
            {
                id: 'pday-1', day: 'Monday', label: 'Push Day',
                exercises: [
                    {
                        id: 'pex-1', name: 'Barbell Bench Press', muscle: 'Chest',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps1', reps: 12, weight: '60', rest: '60s' },
                            { id: 'ps2', reps: 10, weight: '70', rest: '90s' },
                            { id: 'ps3', reps: 8,  weight: '80', rest: '120s' },
                        ]
                    },
                    {
                        id: 'pex-2', name: 'Incline Dumbbell Press', muscle: 'Chest',
                        category: 'Strength Training', type: 'Compound', equipment: 'Dumbbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps4', reps: 12, weight: '22', rest: '60s' },
                            { id: 'ps5', reps: 10, weight: '24', rest: '75s' },
                            { id: 'ps6', reps: 8,  weight: '26', rest: '75s' },
                        ]
                    },
                    {
                        id: 'pex-3', name: 'Overhead Press', muscle: 'Shoulders',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps7', reps: 10, weight: '40', rest: '60s' },
                            { id: 'ps8', reps: 8,  weight: '45', rest: '75s' },
                            { id: 'ps9', reps: 6,  weight: '50', rest: '90s' },
                        ]
                    },
                    {
                        id: 'pex-4', name: 'Tricep Rope Pushdown', muscle: 'Arms',
                        category: 'Machine', type: 'Isolation', equipment: 'Cable',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps10', reps: 15, weight: '20', rest: '45s' },
                            { id: 'ps11', reps: 12, weight: '22', rest: '45s' },
                            { id: 'ps12', reps: 12, weight: '22', rest: '45s' },
                        ]
                    },
                ]
            },
            {
                id: 'pday-2', day: 'Tuesday', label: 'Pull Day',
                exercises: [
                    {
                        id: 'pex-5', name: 'Conventional Deadlift', muscle: 'Back',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps13', reps: 5, weight: '100', rest: '180s' },
                            { id: 'ps14', reps: 5, weight: '110', rest: '180s' },
                            { id: 'ps15', reps: 3, weight: '120', rest: '180s' },
                        ]
                    },
                    {
                        id: 'pex-6', name: 'Bent Over Barbell Row', muscle: 'Back',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps16', reps: 10, weight: '60', rest: '75s' },
                            { id: 'ps17', reps: 8,  weight: '70', rest: '90s' },
                            { id: 'ps18', reps: 8,  weight: '70', rest: '90s' },
                        ]
                    },
                    {
                        id: 'pex-7', name: 'Barbell Bicep Curls', muscle: 'Arms',
                        category: 'Strength Training', type: 'Isolation', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps19', reps: 12, weight: '25', rest: '45s' },
                            { id: 'ps20', reps: 10, weight: '30', rest: '45s' },
                            { id: 'ps21', reps: 8,  weight: '35', rest: '60s' },
                        ]
                    },
                ]
            },
            {
                id: 'pday-3', day: 'Wednesday', label: 'Legs',
                exercises: [
                    {
                        id: 'pex-8', name: 'Back Squat', muscle: 'Legs',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps22', reps: 8, weight: '80',  rest: '120s' },
                            { id: 'ps23', reps: 6, weight: '90',  rest: '150s' },
                            { id: 'ps24', reps: 5, weight: '100', rest: '180s' },
                        ]
                    },
                    {
                        id: 'pex-9', name: 'Romanian Deadlift', muscle: 'Legs',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'ps25', reps: 10, weight: '70', rest: '90s' },
                            { id: 'ps26', reps: 10, weight: '70', rest: '90s' },
                            { id: 'ps27', reps: 8,  weight: '80', rest: '120s' },
                        ]
                    },
                    {
                        id: 'pex-10', name: 'Plank', muscle: 'Core',
                        category: 'Bodyweight', type: 'Isolation', equipment: 'None',
                        isTimeBased: true, showWeight: false,
                        sets: [
                            { id: 'ps28', duration: 60, rest: '45s' },
                            { id: 'ps29', duration: 60, rest: '45s' },
                            { id: 'ps30', duration: 45, rest: '30s' },
                        ]
                    },
                ]
            },
        ]
    },
    {
        id: 'program-2',
        name: 'Beginner Full Body 3×/Week',
        createdAt: '2026-03-01',
        days: [
            {
                id: 'bday-1', day: 'Monday', label: 'Full Body A',
                exercises: [
                    {
                        id: 'bex-1', name: 'Back Squat', muscle: 'Legs',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs1', reps: 10, weight: '40', rest: '90s' },
                            { id: 'bs2', reps: 10, weight: '40', rest: '90s' },
                            { id: 'bs3', reps: 10, weight: '42', rest: '90s' },
                        ]
                    },
                    {
                        id: 'bex-2', name: 'Barbell Bench Press', muscle: 'Chest',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs4', reps: 8, weight: '40', rest: '90s' },
                            { id: 'bs5', reps: 8, weight: '40', rest: '90s' },
                            { id: 'bs6', reps: 8, weight: '42', rest: '90s' },
                        ]
                    },
                    {
                        id: 'bex-3', name: 'Bent Over Barbell Row', muscle: 'Back',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs7', reps: 10, weight: '35', rest: '75s' },
                            { id: 'bs8', reps: 10, weight: '35', rest: '75s' },
                            { id: 'bs9', reps: 10, weight: '37', rest: '75s' },
                        ]
                    },
                ]
            },
            {
                id: 'bday-2', day: 'Wednesday', label: 'Full Body B',
                exercises: [
                    {
                        id: 'bex-4', name: 'Front Squat', muscle: 'Legs',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs10', reps: 8, weight: '35', rest: '90s' },
                            { id: 'bs11', reps: 8, weight: '37', rest: '90s' },
                            { id: 'bs12', reps: 8, weight: '37', rest: '90s' },
                        ]
                    },
                    {
                        id: 'bex-5', name: 'Overhead Press', muscle: 'Shoulders',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs13', reps: 8, weight: '30', rest: '75s' },
                            { id: 'bs14', reps: 8, weight: '30', rest: '75s' },
                            { id: 'bs15', reps: 8, weight: '32', rest: '75s' },
                        ]
                    },
                    {
                        id: 'bex-6', name: 'Conventional Deadlift', muscle: 'Back',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs16', reps: 5, weight: '60', rest: '120s' },
                            { id: 'bs17', reps: 5, weight: '65', rest: '120s' },
                            { id: 'bs18', reps: 5, weight: '70', rest: '120s' },
                        ]
                    },
                ]
            },
            {
                id: 'bday-3', day: 'Friday', label: 'Full Body C',
                exercises: [
                    {
                        id: 'bex-7', name: 'Back Squat', muscle: 'Legs',
                        category: 'Strength Training', type: 'Compound', equipment: 'Barbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs19', reps: 10, weight: '42', rest: '90s' },
                            { id: 'bs20', reps: 10, weight: '42', rest: '90s' },
                            { id: 'bs21', reps: 10, weight: '45', rest: '90s' },
                        ]
                    },
                    {
                        id: 'bex-8', name: 'Pull-ups', muscle: 'Back',
                        category: 'Bodyweight', type: 'Compound', equipment: 'Pull-up Bar',
                        isTimeBased: false, showWeight: false,
                        sets: [
                            { id: 'bs22', reps: 6, rest: '90s' },
                            { id: 'bs23', reps: 5, rest: '90s' },
                            { id: 'bs24', reps: 5, rest: '90s' },
                        ]
                    },
                    {
                        id: 'bex-9', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders',
                        category: 'Strength Training', type: 'Isolation', equipment: 'Dumbbell',
                        isTimeBased: false, showWeight: true,
                        sets: [
                            { id: 'bs25', reps: 15, weight: '8',  rest: '45s' },
                            { id: 'bs26', reps: 15, weight: '8',  rest: '45s' },
                            { id: 'bs27', reps: 12, weight: '10', rest: '45s' },
                        ]
                    },
                ]
            },
        ]
    },
]
