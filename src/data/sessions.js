// Seed session data — booked PT sessions between trainers and clients.
// New sessions are added via AppContext dispatch('ADD_SESSION').
// ─────────────────────────────────────────────────────────────────────────────
// Status: 'Confirmed' | 'Pending' | 'Cancelled'

export const sessions = [
    {
        id: 'session-1',
        trainerId:  'trainer-1',
        clientId:   'member-1',
        clientName: 'Arjun Mehta',
        date:       '2026-04-23',
        timeFrom:   '11:00',
        timeTo:     '12:00',
        notes:      'Upper body strength day',
        status:     'Confirmed',
    },
    {
        id: 'session-2',
        trainerId:  'trainer-1',
        clientId:   'member-2',
        clientName: 'Sneha Patel',
        date:       '2026-04-23',
        timeFrom:   '17:00',
        timeTo:     '18:00',
        notes:      'Cardio + core',
        status:     'Confirmed',
    },
    {
        id: 'session-3',
        trainerId:  'trainer-1',
        clientId:   'member-1',
        clientName: 'Arjun Mehta',
        date:       '2026-04-25',
        timeFrom:   '10:00',
        timeTo:     '11:00',
        notes:      'Leg day',
        status:     'Pending',
    },
]
