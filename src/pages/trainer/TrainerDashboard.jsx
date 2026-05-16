import React, { useState } from 'react'
import { CalendarDays, CalendarCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import { getInitials } from '../../utils/helpers'
import SessionBookingModal from './SessionBookingModal'
import AttendanceModal from './AttendanceModal'
import './TrainerDashboard.css'

const CALENDAR_DAYS = Array.from({ length: 28 }, (_, i) => i + 1)

function nowTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}
function todayISO() {
    return new Date().toISOString().split('T')[0]
}
function fmt12(t) {
    if (!t) return t
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function TrainerDashboard() {
    const { state, dispatch } = useApp()
    const { user }            = useAuth()

    const trainerData = state.trainers.find(t => t.id === user?.id) || state.trainers[0]
    const myClients   = state.members.filter(m => m.trainerId === trainerData?.id)
    const ptClients   = myClients.filter(m => m.membershipType === 'pt')
    const clientCount = myClients.length

    // ── Sessions ─────────────────────────────────────────────────────────────
    const today         = todayISO()
    const todaysSessions = (state.sessions || []).filter(
        s => s.trainerId === trainerData?.id && s.date === today && s.status !== 'Cancelled'
    )

    // ── Attendance ───────────────────────────────────────────────────────────
    const trainerRecord = (state.trainerAttendance || []).find(
        r => r.trainerId === trainerData?.id && r.date === today
    ) ?? null

    // Which calendar days this month the trainer attended
    const thisMonthPrefix = today.slice(0, 7)
    const attendedDays = (state.trainerAttendance || [])
        .filter(r => r.trainerId === trainerData?.id && r.date.startsWith(thisMonthPrefix))
        .map(r => parseInt(r.date.split('-')[2]))

    // Client attendance counts today
    const clientsMarkedToday = (state.clientAttendance || []).filter(
        r => r.date === today && ptClients.some(c => c.id === r.memberId)
    )

    // ── Modal state ──────────────────────────────────────────────────────────
    const [sessionModal,    setSessionModal]    = useState(false)
    const [attendanceModal, setAttendanceModal] = useState(false)

    // ── Handlers ─────────────────────────────────────────────────────────────
    function handleBookSession(form) {
        dispatch({
            type: 'ADD_SESSION',
            payload: {
                id:         `session-${Date.now()}`,
                trainerId:  trainerData.id,
                ...form,
                status: 'Confirmed',
            }
        })
    }

    function handleClockIn() {
        dispatch({
            type: 'ADD_TRAINER_ATTENDANCE',
            payload: { id: `ta-${Date.now()}`, trainerId: trainerData.id, date: today, clockIn: nowTime(), clockOut: null }
        })
    }

    function handleClockOut() {
        dispatch({
            type: 'ADD_TRAINER_ATTENDANCE',
            payload: { ...(trainerRecord || {}), trainerId: trainerData.id, date: today, clockOut: nowTime() }
        })
    }

    function handleMarkClientAttendance(member) {
        // Prevent double-marking same client on same day
        const alreadyMarked = (state.clientAttendance || []).some(
            r => r.memberId === member.id && r.date === today
        )
        if (alreadyMarked) return
        dispatch({
            type: 'ADD_CLIENT_ATTENDANCE',
            payload: {
                id: `ca-${Date.now()}`, memberId: member.id, memberName: member.name,
                date: today, time: nowTime(), markedBy: trainerData.id,
            }
        })
    }

    // ── Client Roster ────────────────────────────────────────────────────────
    const clientRoster = myClients.map((m, idx) => {
        const progressValue = m.goal === 'Weight Loss' ? `${(m.weight - 2).toFixed(1)}kg ↓` :
            m.goal === 'Muscle Gain' ? `+${(m.totalWorkouts * 0.05).toFixed(1)}kg ↑` :
                m.streak > 5 ? 'On Track' : 'Stagnant'
        const attendanceRate = m.totalWorkouts > 0 ? Math.min(100, Math.round(m.totalWorkouts / 2.5)) : 0
        const status      = m.streak > 7 ? 'On Fire' : m.streak === 0 ? 'At Risk' : 'Active'
        const statusColor = status === 'On Fire' ? 'var(--accent)' : status === 'At Risk' ? 'var(--danger)' : 'var(--success)'
        const colors      = ['#3B82F6', '#8B5CF6', '#EC4899', '#22C55E', '#EF4444', '#F59E0B']
        return { name: m.name, sub: `${m.goal} · ${m.totalWorkouts} workouts`, goal: m.goal, attendance: attendanceRate, progress: progressValue, status, statusColor, initials: getInitials(m.name), color: colors[idx % colors.length] }
    })

    return (
        <div className="td animate-fade-in-up">
            {/* Header */}
            <div className="td-header">
                <div>
                    <h1 className="td-title">
                        <span style={{ fontWeight: 800 }}>Trainer</span>{' '}
                        <span className="text-gradient" style={{ fontWeight: 800 }}>Hub</span>
                    </h1>
                    <p className="td-sub">
                        {trainerData?.name || 'Trainer'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} · {todaysSessions.length} session{todaysSessions.length !== 1 ? 's' : ''} today
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setAttendanceModal(true)}>
                        <CalendarCheck size={14} /> Mark Attendance
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setSessionModal(true)}>
                        <CalendarDays size={14} /> Book Session
                    </button>
                </div>
            </div>

            <div className="td-layout">
                <div className="td-main">
                    {/* KPI Cards */}
                    <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                        <StatCard label="My Clients" value={clientCount} sub={`${ptClients.length} PT members`} />
                        <StatCard label="Today's Sessions" value={todaysSessions.length} trend="On track" trendVariant="success" trendDirection="none" sub={todaysSessions[0] ? `Next: ${fmt12(todaysSessions[0].timeFrom)}` : 'No sessions'} />
                        <StatCard label="Avg Client Rating" value={trainerData?.rating || '—'} trend="Top trainer" trendVariant="success" trendDirection="none" sub={`From ${clientCount} clients`} />
                        <StatCard label="Client Retention" value={`${clientCount > 0 ? Math.round(myClients.filter(m => m.status === 'active').length / clientCount * 100) : 0}%`} trend={`${clientCount} total`} trendDirection="none" sub="Gym avg: 80%" />
                    </div>

                    {/* Client Roster */}
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
                            {ptClients.length > 0 ? (
                                <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{ptClients[0].name} — {ptClients[0].goal} Plan</p>
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
                    {/* Today's Sessions — from real state */}
                    <div className="card-flat">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontWeight: 700 }}>TODAY'S SESSIONS</h3>
                            <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => setSessionModal(true)}>+ Book</button>
                        </div>
                        {todaysSessions.length > 0 ? todaysSessions.map(s => (
                            <div key={s.id} className="td-session-card" style={{ borderLeft: `3px solid ${s.status === 'Confirmed' ? 'var(--success)' : 'var(--warning)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)' }}>TODAY · {fmt12(s.timeFrom)} – {fmt12(s.timeTo)}</span>
                                    <span className={`tag ${s.status === 'Confirmed' ? 'tag-success' : 'tag-warning'}`} style={{ fontSize: 9 }}>■ {s.status}</span>
                                </div>
                                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: 4 }}>{s.clientName}</p>
                                {s.notes && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{s.notes}</p>}
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No sessions today.</p>
                                <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => setSessionModal(true)}>Book Session</button>
                            </div>
                        )}
                    </div>

                    {/* Trainer Attendance Calendar */}
                    <div className="card-flat">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontWeight: 700 }}>MY ATTENDANCE</h3>
                            <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => setAttendanceModal(true)}>Mark</button>
                        </div>
                        <div className="td-cal-grid">
                            {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="td-cal-label">{d}</span>)}
                            {CALENDAR_DAYS.map(d => (
                                <div key={d} className={`td-cal-day ${attendedDays.includes(d) ? 'td-cal-attended' : ''}`}>{d}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                            {trainerRecord?.clockIn
                                ? <span style={{ color: 'var(--success)' }}>● In: {trainerRecord.clockIn}{trainerRecord.clockOut ? ` · Out: ${trainerRecord.clockOut}` : ''}</span>
                                : <span style={{ color: 'var(--text-muted)' }}>Not clocked in today</span>}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            Clients today: <span style={{ color: '#22c55e', fontWeight: 700 }}>{clientsMarkedToday.length}</span> / {ptClients.length}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>MESSAGES</h3>
                        {myClients.length > 0 ? (
                            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                    {myClients[0].name.split(' ')[0]} {myClients[0].name.split(' ').pop()[0]}. — "Should I do cardio after today's session?"
                                </p>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No messages yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Session Booking Modal ── */}
            <SessionBookingModal
                isOpen={sessionModal}
                onClose={() => setSessionModal(false)}
                ptClients={ptClients}
                onConfirm={handleBookSession}
            />

            {/* ── Attendance Modal ── */}
            <AttendanceModal
                isOpen={attendanceModal}
                onClose={() => setAttendanceModal(false)}
                trainerRecord={trainerRecord}
                ptClients={ptClients}
                allMembers={state.members}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onMarkClientAttendance={handleMarkClientAttendance}
                clientAttendance={state.clientAttendance || []}
            />
        </div>
    )
}
