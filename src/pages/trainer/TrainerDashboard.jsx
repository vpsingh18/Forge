import React from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import { getInitials } from '../../utils/helpers'
import './TrainerDashboard.css'

const CALENDAR_DAYS = Array.from({ length: 28 }, (_, i) => i + 1)
const ATTENDED_DAYS = [3, 4, 5, 7, 8, 26]

export default function TrainerDashboard() {
    const { state } = useApp()
    const { user } = useAuth()

    // ── Get the current trainer's data from state ──
    const trainerData = state.trainers.find(t => t.id === user?.id) || state.trainers[0]

    // ── My Clients: members assigned to this trainer ──
    const myClients = state.members.filter(m => m.trainerId === trainerData?.id)
    const clientCount = myClients.length

    // ── Build client roster from actual member data ──
    const clientRoster = myClients.map(m => {
        const progressValue = m.goal === 'Weight Loss' ? `${(m.weight - 2).toFixed(1)}kg ↓` :
            m.goal === 'Muscle Gain' ? `+${(m.totalWorkouts * 0.05).toFixed(1)}kg ↑` :
                m.streak > 5 ? 'On Track' : 'Stagnant'
        const attendanceRate = m.totalWorkouts > 0 ? Math.min(100, Math.round(m.totalWorkouts / 2.5)) : 0
        const status = m.streak > 7 ? 'On Fire' : m.streak === 0 ? 'At Risk' : 'Active'
        const statusColor = status === 'On Fire' ? 'var(--accent)' : status === 'At Risk' ? 'var(--danger)' : 'var(--success)'
        const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#22C55E', '#EF4444', '#F59E0B']

        return {
            name: m.name,
            sub: `${m.goal} · ${m.totalWorkouts} workouts`,
            goal: m.goal,
            attendance: attendanceRate,
            progress: progressValue,
            status,
            statusColor,
            initials: getInitials(m.name),
            color: colors[myClients.indexOf(m) % colors.length]
        }
    })

    // ── Today's sessions (from my clients with workouts) ──
    const todaysSessions = myClients.slice(0, 3).map((m, i) => ({
        time: ['11:00 AM', '5:00 PM', '7:00 PM'][i],
        client: m.name,
        plan: `${m.goal} · 60 min`,
        status: i < 2 ? 'Confirmed' : 'Pending'
    }))

    const presentToday = Math.round(clientCount * 0.75)
    const absentToday = clientCount - presentToday

    return (
        <div className="td animate-fade-in-up">
            {/* Header */}
            <div className="td-header">
                <div>
                    <h1 className="td-title">
                        <span className="font-mono" style={{ fontWeight: 800 }}>TRAINER</span>{' '}
                        <span className="text-gradient font-mono" style={{ fontWeight: 800 }}>HUB</span>
                    </h1>
                    <p className="td-sub font-mono">{trainerData?.name || 'Trainer'} · Thursday, Feb 26 · {todaysSessions.length} sessions today</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn btn-secondary btn-sm">+ Add Client</button>
                    <button className="btn btn-primary btn-sm">+ New Plan</button>
                </div>
            </div>

            <div className="td-layout">
                <div className="td-main">
                    {/* KPI Cards — computed from state */}
                    <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                        <StatCard label="My Clients" value={clientCount} sub={`${myClients.filter(m => m.membershipType === 'pt').length} PT members`} />
                        <StatCard label="Today's Sessions" value={todaysSessions.length} trend="On track" trendVariant="success" trendDirection="none" sub={`Next: ${todaysSessions[0]?.time || 'None'}`} />
                        <StatCard label="Avg Client Rating" value={trainerData?.rating || '—'} trend="Top trainer" trendVariant="success" trendDirection="none" sub={`From ${clientCount} clients`} />
                        <StatCard label="Client Retention" value={`${clientCount > 0 ? Math.round(myClients.filter(m => m.status === 'active').length / clientCount * 100) : 0}%`} trend={`${clientCount} total`} trendDirection="none" sub={`Gym avg: 80%`} />
                    </div>

                    {/* Client Roster — from state members */}
                    <div className="card-flat" style={{ marginBottom: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontWeight: 800, letterSpacing: '0.05em' }}>MY CLIENT ROSTER</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <span className="tag tag-success">★ {clientCount} clients</span>
                                <button className="btn btn-ghost btn-sm">View All →</button>
                            </div>
                        </div>

                        {clientRoster.length > 0 ? (
                            <div className="td-roster-table">
                                <div className="td-roster-header">
                                    <span>CLIENT</span><span>GOAL</span><span>ATTENDANCE</span><span>PROGRESS</span><span>STATUS</span><span></span>
                                </div>
                                {clientRoster.map((c, i) => (
                                    <div key={i} className="td-roster-row">
                                        <div className="td-client-cell">
                                            <div className="td-client-avatar" style={{ background: c.color }}>{c.initials}</div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{c.name}</p>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.sub}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 'var(--text-sm)' }}>{c.goal}</span>
                                        <div>
                                            <div className="td-progress-bar"><div style={{ width: `${c.attendance}%`, background: c.attendance > 60 ? 'var(--success)' : 'var(--danger)' }} /></div>
                                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.attendance}%</span>
                                        </div>
                                        <span style={{ fontSize: 'var(--text-sm)', color: c.progress.includes('↑') ? 'var(--success)' : c.progress.includes('↓') ? 'var(--accent)' : 'var(--text-muted)' }}>{c.progress}</span>
                                        <span className="tag" style={{ background: `${c.statusColor}22`, color: c.statusColor }}>{c.status}</span>
                                        <button className="btn btn-secondary btn-sm" style={{ fontSize: 10, padding: '4px 8px' }}>{c.status === 'At Risk' ? 'Follow Up' : 'Edit Plan'}</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-4)' }}>No clients assigned to you yet.</p>
                        )}
                    </div>

                    {/* Assignments + Diet */}
                    <div className="grid-2">
                        <div className="card-flat">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontWeight: 700 }}>TODAY'S ASSIGNMENTS</h3>
                                <span className="tag tag-success">★ AI Suggested</span>
                            </div>
                            {myClients.length > 0 ? (
                                <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{myClients[0].name} — {myClients[0].goal}</p>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Assigned by you · {myClients[0].totalWorkouts} workouts done</p>
                                    </div>
                                    <button className="btn btn-primary btn-sm" style={{ fontSize: 10 }}>Edit</button>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No assignments today.</p>
                            )}
                        </div>
                        <div className="card-flat">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontWeight: 700 }}>DIET CHART BUILDER</h3>
                                <span className="tag tag-success">★ AI Generated</span>
                            </div>
                            {myClients.filter(m => m.membershipType === 'pt').length > 0 ? (
                                <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{myClients.filter(m => m.membershipType === 'pt')[0].name} — {myClients.filter(m => m.membershipType === 'pt')[0].goal} Plan</p>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>2,500 kcal · High Protein</p>
                                    </div>
                                    <button className="btn btn-primary btn-sm" style={{ fontSize: 10 }}>Edit</button>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No PT clients for diet charts.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="td-right">
                    {/* Today's Sessions — from computed data */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>TODAY'S SESSIONS</h3>
                        {todaysSessions.length > 0 ? todaysSessions.map((s, i) => (
                            <div key={i} className="td-session-card" style={{ borderLeft: `3px solid ${s.status === 'Confirmed' ? 'var(--success)' : 'var(--warning)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)' }}>TODAY · {s.time}</span>
                                    <span className={`tag ${s.status === 'Confirmed' ? 'tag-success' : 'tag-warning'}`} style={{ fontSize: 9 }}>■ {s.status}</span>
                                </div>
                                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: 4 }}>{s.client}</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{s.plan}</p>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No sessions today.</p>
                        )}
                    </div>

                    {/* Attendance Calendar */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>ATTENDANCE TODAY</h3>
                        <div className="td-cal-grid">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="td-cal-label">{d}</span>)}
                            {CALENDAR_DAYS.map(d => (
                                <div key={d} className={`td-cal-day ${ATTENDED_DAYS.includes(d) ? 'td-cal-attended' : ''}`}>{d}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                            <span>■ {presentToday}/{clientCount} clients today</span>
                            <span style={{ color: 'var(--danger)' }}>✕ {absentToday} absent</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>MESSAGES</h3>
                        {myClients.length > 0 ? (
                            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{myClients[0].name.split(' ')[0]} {myClients[0].name.split(' ').pop()[0]}. — "Should I do cardio after today's session?"</p>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No messages yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
