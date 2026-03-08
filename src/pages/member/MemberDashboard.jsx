import React from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import { getInitials, formatDate, daysUntil } from '../../utils/helpers'
import './MemberDashboard.css'

const CALENDAR_DAYS = Array.from({ length: 28 }, (_, i) => i + 1)
const GYM_DAYS = [3, 4, 5, 7, 8, 26, 27]

export default function MemberDashboard() {
    const { state } = useApp()
    const { user } = useAuth()

    // ── Get current member from state ──
    const memberData = state.members.find(m => m.id === user?.id) || state.members[0]
    const todayWorkout = state.workouts.find(w => w.memberId === memberData?.id)
    const totalExercises = todayWorkout?.exercises.length || 0
    const completedExercises = todayWorkout?.exercises.filter(e => e.completed).length || 0

    // ── Computed KPIs from actual member data ──
    const workoutsThisMonth = memberData?.totalWorkouts || 0
    const memberWeight = memberData?.weight || 0
    const memberStreak = memberData?.streak || 0
    const memberPoints = memberData?.points || 0
    const memberStatus = memberData?.status || 'active'
    const expiryDate = memberData?.expiryDate || ''
    const daysLeft = expiryDate ? daysUntil(expiryDate) : 0

    // ── Get assigned trainer info ──
    const myTrainer = memberData?.trainerId ? state.trainers.find(t => t.id === memberData.trainerId) : null

    // ── Build leaderboard from all members, sorted by points ──
    const leaderboard = [...state.members]
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
        .map((m, i) => {
            const colors = ['#8B5CF6', '#EC4899', 'var(--accent)', '#EF4444', '#22C55E', '#F59E0B']
            return {
                name: m.id === memberData?.id ? `${m.name.split(' ')[0]} (You)` : `${m.name.split(' ')[0]} ${m.name.split(' ').pop()[0]}.`,
                initials: getInitials(m.name),
                color: colors[i % colors.length],
                points: m.points,
                rank: i + 1,
                isYou: m.id === memberData?.id
            }
        })

    const myRank = leaderboard.find(l => l.isYou)
    const aboveRank = leaderboard.find(l => l.rank === (myRank?.rank || 0) - 1)

    return (
        <div className="md animate-fade-in-up">
            {/* Header */}
            <div className="md-header">
                <div>
                    <h1 className="md-title">
                        <span className="font-mono" style={{ fontWeight: 800 }}>GOOD MORNING,</span>{' '}
                        <span className="text-gradient font-mono" style={{ fontWeight: 800 }}>{memberData?.name?.split(' ')[0]?.toUpperCase()}</span>
                    </h1>
                    <p className="md-sub font-mono">Thursday, Feb 26 · {memberData?.goal || 'Training'} · 🔥 {memberStreak}-day streak</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Membership Valid Until</p>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                        {expiryDate ? formatDate(expiryDate) : '—'}{' '}
                        <span style={{ color: memberStatus === 'active' ? 'var(--success)' : memberStatus === 'expiring' ? 'var(--warning)' : 'var(--danger)' }}>
                            {memberStatus === 'active' ? '✓ Active' : memberStatus === 'expiring' ? `⚠ ${daysLeft}d left` : '✕ Expired'}
                        </span>
                    </p>
                </div>
            </div>

            <div className="md-layout">
                <div className="md-main">
                    {/* KPI Cards — computed from member data */}
                    <div className="md-stats" style={{ marginBottom: 'var(--space-6)' }}>
                        <StatCard
                            label="Total Workouts"
                            value={workoutsThisMonth}
                            trend={`🔥 ${memberStreak} streak`}
                            trendDirection="none"
                            trendVariant="success"
                            sub={`Goal: ${memberData?.goal || 'General'}`}
                        />
                        <StatCard
                            label="Points Earned"
                            value={memberPoints.toLocaleString()}
                            trend={myRank ? `#${myRank.rank} rank` : '—'}
                            trendDirection="none"
                            trendVariant="warning"
                            sub={`${memberData?.badges?.length || 0} badges unlocked`}
                        />
                        <StatCard
                            label="Current Weight"
                            value={`${memberWeight}KG`}
                            trend={memberData?.membershipType === 'pt' ? 'PT Member' : 'Regular'}
                            trendDirection="none"
                            trendVariant={memberData?.membershipType === 'pt' ? 'info' : 'warning'}
                            sub={myTrainer ? `Trainer: ${myTrainer.name}` : 'No trainer assigned'}
                        />
                    </div>

                    {/* Today's Workout */}
                    <div className="card-flat" style={{ marginBottom: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontWeight: 800, letterSpacing: '0.05em' }}>TODAY'S WORKOUT</h3>
                            <a href="/member/workout-log" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Full Plan →</a>
                        </div>

                        {todayWorkout ? (
                            <>
                                <div className="md-workout-header">
                                    <div className="md-day-badge">DAY {workoutsThisMonth + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{memberData?.goal || 'Workout'} — {todayWorkout.exercises.length} exercises</p>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{totalExercises} exercises · ~50 min · {memberData?.membershipType === 'pt' ? 'PT Program' : 'Self-guided'}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>PROGRESS</span>
                                        <p className="font-mono" style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>{completedExercises}/{totalExercises}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="md-progress-bar" style={{ marginBottom: 'var(--space-4)' }}>
                                    <div style={{ width: `${totalExercises > 0 ? (completedExercises / totalExercises * 100) : 0}%` }} />
                                </div>

                                {/* Exercise List */}
                                {todayWorkout.exercises.map((ex, i) => (
                                    <div key={ex.id} className={`md-exercise-row ${ex.completed ? 'md-ex-done' : i === completedExercises ? 'md-ex-current' : ''}`}>
                                        <div className={`md-ex-check ${ex.completed ? 'md-ex-checked' : ''}`}>
                                            {ex.completed ? '✓' : ''}
                                        </div>
                                        <span style={{ flex: 1, fontWeight: i === completedExercises && !ex.completed ? 700 : 400 }}>
                                            {i === completedExercises && !ex.completed ? `${ex.name} (Current)` : ex.name}
                                        </span>
                                        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                            {ex.sets}×{ex.reps} · {ex.weight || '?'}kg
                                        </span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-4)' }}>No workout assigned for today. Check your workout plan!</p>
                        )}
                    </div>

                    {/* Today's Nutrition */}
                    <div className="card-flat">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontWeight: 800, letterSpacing: '0.05em' }}>TODAY'S NUTRITION</h3>
                            <a href="/member/diet" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Diet Plan →</a>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button className="btn btn-secondary btn-sm">CALORIES</button>
                            <button className="btn btn-ghost btn-sm">MEAL SCHEDULE</button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="md-right">
                    {/* Attendance Calendar */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>ATTENDANCE</h3>
                        <div className="md-cal-grid">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="md-cal-label">{d}</span>)}
                            {CALENDAR_DAYS.map(d => (
                                <div key={d} className={`md-cal-day ${GYM_DAYS.includes(d) ? 'md-cal-attended' : ''}`}>{d}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                            <span>■ {GYM_DAYS.length} present</span>
                            <span style={{ color: 'var(--text-muted)' }}>{workoutsThisMonth} total workouts</span>
                        </div>
                    </div>

                    {/* Leaderboard — from state members */}
                    <div className="card-flat">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontWeight: 700 }}>LEADERBOARD</h3>
                            <span className="tag tag-success" style={{ fontSize: 9 }}>FCR CHALLENGE</span>
                        </div>
                        {leaderboard.map((l, i) => (
                            <div key={i} className={`md-lb-row ${l.isYou ? 'md-lb-you' : ''}`}>
                                <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', width: 16 }}>{l.rank}</span>
                                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: l.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{l.initials}</div>
                                <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: l.isYou ? 700 : 400 }}>{l.name}</span>
                                <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 700 }}>{l.points.toLocaleString()} pts</span>
                            </div>
                        ))}
                        {myRank && aboveRank && (
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 'var(--space-3)', textAlign: 'center' }}>{aboveRank.points - myRank.points} pts to #{myRank.rank - 1}</p>
                        )}
                    </div>

                    {/* Trainer Info */}
                    {myTrainer && (
                        <div className="card-flat">
                            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>YOUR TRAINER</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{getInitials(myTrainer.name)}</div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{myTrainer.name}</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{myTrainer.specialization} · ★ {myTrainer.rating}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
