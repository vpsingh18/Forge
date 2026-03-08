// MET values for calorie estimation: Calories = MET × Weight(kg) × Duration(hours)
export const MET_VALUES = {
    'Bench Press': 6.0,
    'Squats': 5.5,
    'Deadlifts': 6.0,
    'Overhead Press': 5.0,
    'Barbell Rows': 5.5,
    'Pull-ups': 8.0,
    'Push-ups': 3.8,
    'Lunges': 5.0,
    'Leg Press': 5.0,
    'Bicep Curls': 3.5,
    'Tricep Dips': 5.0,
    'Plank': 3.8,
    'Running': 9.8,
    'Cycling': 7.0,
    'Jump Rope': 12.3,
    'Yoga': 3.0,
    'Lat Pulldown': 5.0,
    'Cable Flyes': 4.0,
    'Leg Curls': 4.5,
    'Calf Raises': 3.5
}

export const workouts = [
    {
        id: 'workout-1',
        memberId: 'member-1',
        trainerId: 'trainer-1',
        name: 'Push Day — Chest & Shoulders',
        day: 'Monday',
        exercises: [
            { id: 'ex-1', name: 'Bench Press', sets: 4, reps: 10, rest: '90s', weight: '60kg', completed: false, duration: 12 },
            { id: 'ex-2', name: 'Overhead Press', sets: 3, reps: 12, rest: '60s', weight: '30kg', completed: false, duration: 10 },
            { id: 'ex-3', name: 'Cable Flyes', sets: 3, reps: 15, rest: '45s', weight: '15kg', completed: false, duration: 8 },
            { id: 'ex-4', name: 'Tricep Dips', sets: 3, reps: 12, rest: '60s', weight: 'BW', completed: false, duration: 8 },
            { id: 'ex-5', name: 'Push-ups', sets: 3, reps: 20, rest: '30s', weight: 'BW', completed: false, duration: 6 }
        ],
        createdAt: '2026-02-01'
    },
    {
        id: 'workout-2',
        memberId: 'member-1',
        trainerId: 'trainer-1',
        name: 'Pull Day — Back & Biceps',
        day: 'Tuesday',
        exercises: [
            { id: 'ex-6', name: 'Deadlifts', sets: 4, reps: 8, rest: '120s', weight: '100kg', completed: false, duration: 15 },
            { id: 'ex-7', name: 'Barbell Rows', sets: 4, reps: 10, rest: '90s', weight: '50kg', completed: false, duration: 12 },
            { id: 'ex-8', name: 'Pull-ups', sets: 3, reps: 8, rest: '90s', weight: 'BW', completed: false, duration: 8 },
            { id: 'ex-9', name: 'Lat Pulldown', sets: 3, reps: 12, rest: '60s', weight: '45kg', completed: false, duration: 10 },
            { id: 'ex-10', name: 'Bicep Curls', sets: 3, reps: 15, rest: '45s', weight: '12kg', completed: false, duration: 8 }
        ],
        createdAt: '2026-02-01'
    },
    {
        id: 'workout-3',
        memberId: 'member-1',
        trainerId: 'trainer-1',
        name: 'Leg Day',
        day: 'Wednesday',
        exercises: [
            { id: 'ex-11', name: 'Squats', sets: 4, reps: 10, rest: '120s', weight: '80kg', completed: false, duration: 15 },
            { id: 'ex-12', name: 'Leg Press', sets: 4, reps: 12, rest: '90s', weight: '120kg', completed: false, duration: 12 },
            { id: 'ex-13', name: 'Lunges', sets: 3, reps: 12, rest: '60s', weight: '20kg', completed: false, duration: 10 },
            { id: 'ex-14', name: 'Leg Curls', sets: 3, reps: 15, rest: '45s', weight: '35kg', completed: false, duration: 8 },
            { id: 'ex-15', name: 'Calf Raises', sets: 4, reps: 20, rest: '30s', weight: '40kg', completed: false, duration: 6 }
        ],
        createdAt: '2026-02-01'
    }
]
