export const analytics = {
    revenue: {
        thisMonth: 384000,
        lastMonth: 360000,
        target: 420000,
        trend: '+6.7%',
        collected: 384000,
        breakdown: [
            { month: 'Sep', value: 180000 },
            { month: 'Oct', value: 195000 },
            { month: 'Nov', value: 210000 },
            { month: 'Dec', value: 228000 },
            { month: 'Jan', value: 218000 },
            { month: 'Feb', value: 245000 }
        ]
    },
    members: {
        total: 248,
        active: 248,
        expiring: 12,
        expired: 6,
        newThisMonth: 12,
        trend: '+5.1%',
        breakdown: [
            { month: 'Sep', value: 128 },
            { month: 'Oct', value: 134 },
            { month: 'Nov', value: 138 },
            { month: 'Dec', value: 145 },
            { month: 'Jan', value: 148 },
            { month: 'Feb', value: 248 }
        ]
    },
    attendance: {
        today: 67,
        avgDaily: 72,
        peakHour: '6:00 PM',
        slotUtilization: 76,
        slotPeak: '6–8PM',
        slotTrend: '+8%',
        weeklyBreakdown: [
            { day: 'Mon', value: 78 },
            { day: 'Tue', value: 72 },
            { day: 'Wed', value: 68 },
            { day: 'Thu', value: 74 },
            { day: 'Fri', value: 65 },
            { day: 'Sat', value: 82 },
            { day: 'Sun', value: 45 }
        ]
    },
    payments: {
        collected: 384000,
        pending: 32000,
        overdue: 18000,
        overdueCount: 4,
        recentPayments: [
            { memberId: 'member-1', name: 'Arjun Mehta', amount: 15000, date: '2026-02-28', status: 'paid' },
            { memberId: 'member-4', name: 'Ananya Reddy', amount: 6000, date: '2026-02-25', status: 'paid' },
            { memberId: 'member-5', name: 'Karan Malhotra', amount: 15000, date: '2026-03-20', status: 'pending' },
            { memberId: 'member-6', name: 'Deepika Iyer', amount: 8000, date: '2026-01-10', status: 'overdue' }
        ]
    },
    renewals: [
        { name: 'Priya M.', plan: 'Standard', expires: 'Mar 1' },
        { name: 'Vikram K.', plan: 'Premium', expires: 'Mar 3' },
        { name: 'Sneha R.', plan: 'Standard', expires: 'Mar 4' },
        { name: 'Dev P.', plan: 'Premium', expires: 'Mar 6' },
        { name: 'Ananya S.', plan: 'Standard', expires: 'Mar 7' }
    ],
    alerts: [
        { icon: '⚠️', type: 'warning', title: '12 memberships expiring this week', desc: 'Auto-renewal reminders sent to 8 members. 4 require manual follow-up. Potential revenue loss: ₹48,000.', action: 'View List' },
        { icon: '📉', type: 'danger', title: '3 members flagged for churn risk', desc: 'Attendance dropped >40% in last 2 weeks. Trainer check-in recommended.', action: 'Assign Action' },
        { icon: '💡', type: 'info', title: 'Tuesday 6PM slot is 94% booked', desc: 'Consider opening a parallel session. Current waitlist: 7 members.', action: 'Add Slot' }
    ],
    trainerPerformance: [
        { name: 'Rohit Verma', clients: 18, retention: '92%', rating: 4.9, initials: 'RV' },
        { name: 'Priya Nair', clients: 14, retention: '88%', rating: 4.7, initials: 'PN' }
    ],
    trainers: {
        total: 3,
        totalSessions: 136,
        avgRating: 4.77,
        topPerformer: 'Meera Nair'
    }
}
