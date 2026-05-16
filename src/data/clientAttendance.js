// Client attendance records logged by trainer via QR scan or manual selection.
// Added via AppContext dispatch('ADD_CLIENT_ATTENDANCE').
// The QR code on the client's device encodes their memberId as a plain string.
// When scanned, the trainer app looks up the member and logs this record.

export const clientAttendance = [
    { id: 'ca-1', memberId: 'member-1', memberName: 'Arjun Mehta',  date: '2026-04-22', time: '11:05 AM', markedBy: 'trainer-1' },
    { id: 'ca-2', memberId: 'member-2', memberName: 'Sneha Patel',  date: '2026-04-22', time: '17:08 PM', markedBy: 'trainer-1' },
    { id: 'ca-3', memberId: 'member-1', memberName: 'Arjun Mehta',  date: '2026-04-21', time: '10:58 AM', markedBy: 'trainer-1' },
]
