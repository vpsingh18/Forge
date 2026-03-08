import { useAuth } from '../../context/AuthContext'

// Simulated attendance history
const ATTENDANCE = [
    { date: '2026-03-02', checkIn: '6:02 AM', checkOut: '7:45 AM' },
    { date: '2026-03-01', checkIn: '6:10 AM', checkOut: '7:30 AM' },
    { date: '2026-02-28', checkIn: '5:58 AM', checkOut: '7:20 AM' },
    { date: '2026-02-27', checkIn: '6:05 AM', checkOut: '7:50 AM' },
    { date: '2026-02-26', checkIn: '6:15 AM', checkOut: '7:35 AM' },
    { date: '2026-02-25', checkIn: '6:00 AM', checkOut: '7:40 AM' },
    { date: '2026-02-24', checkIn: '6:20 AM', checkOut: '8:00 AM' }
]

function generateQR(text) {
    // Simple visual QR placeholder using text
    return `FORGE-QR:${text}`
}

export default function Attendance() {
    const { user } = useAuth()
    const qrValue = generateQR(user?.id || 'member-1')

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Attendance</h1>
                <p>Your gym check-in history</p>
            </div>

            <div className="grid-2" style={{ alignItems: 'start' }}>
                {/* QR Code */}
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-6)' }}>Your Check-in QR</h3>

                    {/* QR Visual */}
                    <div style={{ width: 180, height: 180, margin: '0 auto var(--space-6)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Simulated QR grid */}
                        <div style={{ width: 160, height: 160, background: '#FFFFFF', borderRadius: 12, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                            {Array.from({ length: 49 }).map((_, i) => {
                                // Deterministic pattern from user id
                                const seed = (user?.id?.charCodeAt(i % (user?.id?.length || 1)) || i) + i
                                const filled = (seed * 47 + i * 13) % 3 !== 0
                                return (
                                    <div key={i} style={{ background: filled ? '#1A1A1A' : '#FFFFFF', borderRadius: 2 }} />
                                )
                            })}
                        </div>
                        {/* Amber glow */}
                        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, boxShadow: '0 0 30px rgba(245,158,11,0.3)', pointerEvents: 'none' }} />
                    </div>

                    <p style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>{user?.name}</p>
                    <p className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>{qrValue}</p>
                    <span className="tag tag-success">✓ Active Member</span>
                </div>

                {/* Attendance History */}
                <div className="card-flat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                        <h3 style={{ fontWeight: 700 }}>Recent Check-ins</h3>
                        <span className="tag tag-info">{ATTENDANCE.length} this month</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {ATTENDANCE.map((entry, i) => {
                            const [y, m, d] = entry.date.split('-')
                            const dateObj = new Date(entry.date)
                            const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'short' })
                            const duration = Math.round(
                                (new Date(`${entry.date} ${entry.checkOut}`) - new Date(`${entry.date} ${entry.checkIn}`)) / 60000
                            )
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: i === 0 ? 'var(--success-bg)' : 'var(--bg-input)', border: `1px solid ${i === 0 ? 'var(--success)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ textAlign: 'center', minWidth: 44 }}>
                                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{d}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{dayName}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{entry.checkIn} → {entry.checkOut}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{duration} mins session</div>
                                    </div>
                                    {i === 0 && <span className="tag tag-success">Today</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
