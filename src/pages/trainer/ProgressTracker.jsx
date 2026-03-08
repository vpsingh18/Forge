import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import { Camera, TrendingUp } from 'lucide-react'

const PROGRESS_DATA = {
    'member-1': [
        { date: 'Jan 1', weight: 78, bodyFat: 18, chest: 98, waist: 85, arms: 36 },
        { date: 'Jan 15', weight: 77.2, bodyFat: 17.5, chest: 99, waist: 84, arms: 36.5 },
        { date: 'Feb 1', weight: 76, bodyFat: 16.8, chest: 100, waist: 83, arms: 37 },
        { date: 'Feb 15', weight: 75.4, bodyFat: 16.2, chest: 101, waist: 82, arms: 37.5 },
    ],
    'member-2': [
        { date: 'Nov 1', weight: 62, bodyFat: 24, chest: 86, waist: 72, arms: 28 },
        { date: 'Nov 15', weight: 61.1, bodyFat: 23.5, chest: 86, waist: 71, arms: 28 },
        { date: 'Dec 1', weight: 60, bodyFat: 23, chest: 86, waist: 70, arms: 28 },
        { date: 'Dec 15', weight: 59.2, bodyFat: 22.5, chest: 87, waist: 69, arms: 28.5 },
    ]
}

export default function ProgressTracker() {
    const { state } = useApp()
    const { user } = useAuth()
    const myClients = state.members.filter(m => m.trainerId === user?.id)

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Progress Tracker</h1>
                <p>Monitor measurements and body composition for PT clients</p>
            </div>

            {myClients.length === 0 ? (
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>No PT clients assigned.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    {myClients.map(client => {
                        const data = PROGRESS_DATA[client.id] || []
                        const latest = data[data.length - 1]
                        const first = data[0]

                        return (
                            <div className="card-flat" key={client.id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                    <div className="member-avatar">{getInitials(client.name)}</div>
                                    <div>
                                        <h3 style={{ fontWeight: 700 }}>{client.name}</h3>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{client.goal} · {data.length} check-ins</p>
                                    </div>
                                </div>

                                {latest && (
                                    <>
                                        {/* Latest Measurements */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                                            {[
                                                { label: 'Weight', now: latest.weight, start: first.weight, unit: 'kg' },
                                                { label: 'Body Fat', now: latest.bodyFat, start: first.bodyFat, unit: '%' },
                                                { label: 'Chest', now: latest.chest, start: first.chest, unit: 'cm' },
                                                { label: 'Waist', now: latest.waist, start: first.waist, unit: 'cm' },
                                                { label: 'Arms', now: latest.arms, start: first.arms, unit: 'cm' }
                                            ].map(({ label, now, start, unit }) => {
                                                const diff = (now - start).toFixed(1)
                                                const isGood = (label === 'Waist' || label === 'Body Fat' || label === 'Weight') ? diff <= 0 : diff >= 0
                                                return (
                                                    <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'center' }}>
                                                        <div className="font-mono" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{now}<span style={{ fontSize: 'var(--text-xs)' }}>{unit}</span></div>
                                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>{label}</div>
                                                        <div style={{ fontSize: 10, color: isGood ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                                                            {diff > 0 ? '+' : ''}{diff}{unit}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Progress Timeline */}
                                        <div>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>Progress Timeline</p>
                                            <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
                                                {data.map((entry, i) => (
                                                    <div key={i} style={{ flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', minWidth: 120, textAlign: 'center' }}>
                                                        <div style={{ width: 60, height: 60, background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-2)' }}>
                                                            <Camera size={20} style={{ color: 'var(--text-muted)' }} />
                                                        </div>
                                                        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{entry.date}</p>
                                                        <p className="font-mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>{entry.weight}kg</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
