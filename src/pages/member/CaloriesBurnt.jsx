import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { calculateCalories, calculateTotalCalories } from '../../utils/helpers'
import { Flame } from 'lucide-react'

export default function CaloriesBurnt() {
    const { state } = useApp()
    const { user } = useAuth()
    const memberData = state.members.find(m => m.id === user?.id) || state.members[0]
    const workouts = state.workouts.filter(w => w.memberId === memberData?.id)

    const totalCalories = workouts.reduce((sum, w) => sum + calculateTotalCalories(w.exercises, memberData?.weight || 75), 0)

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Calories Burnt</h1>
                <p>Estimated using MET formula · Based on {memberData?.weight}kg body weight</p>
            </div>

            {/* Total */}
            <div className="card-flat" style={{ marginBottom: 'var(--space-6)', textAlign: 'center', padding: 'var(--space-10)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🔥</div>
                <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 800, background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {totalCalories}
                </div>
                <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>Total kcal across all plans</div>
            </div>

            {/* Per Workout Plan */}
            {workouts.map(workout => {
                const planTotal = calculateTotalCalories(workout.exercises, memberData?.weight || 75)
                return (
                    <div className="card-flat" key={workout.id} style={{ marginBottom: 'var(--space-5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                            <div>
                                <h3 style={{ fontWeight: 700 }}>{workout.name}</h3>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{workout.day}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent)' }}>{planTotal}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>kcal total</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {workout.exercises.map(ex => {
                                const cals = calculateCalories(ex.name, memberData?.weight || 75, ex.duration || 10)
                                const pct = Math.round((cals / planTotal) * 100)
                                return (
                                    <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                        <div style={{ width: 120, fontSize: 'var(--text-sm)', fontWeight: 600, flexShrink: 0 }}>{ex.name}</div>
                                        <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)' }} />
                                        </div>
                                        <div className="font-mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 700, width: 70, textAlign: 'right', flexShrink: 0 }}>
                                            {cals} kcal
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
