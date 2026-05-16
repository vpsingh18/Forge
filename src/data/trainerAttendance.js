// Trainer clock-in / clock-out records.
// Added via AppContext dispatch('ADD_TRAINER_ATTENDANCE').
// clockOut is null if trainer hasn't clocked out yet.

export const trainerAttendance = [
    { id: 'ta-1', trainerId: 'trainer-1', date: '2026-04-21', clockIn: '09:15 AM', clockOut: '06:30 PM' },
    { id: 'ta-2', trainerId: 'trainer-1', date: '2026-04-22', clockIn: '09:00 AM', clockOut: '06:45 PM' },
]
