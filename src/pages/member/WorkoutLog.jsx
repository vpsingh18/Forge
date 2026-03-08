import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { calculateCalories } from '../../utils/helpers'

export default function WorkoutLog() {
    const { state, dispatch } = useApp()
    const { user } = useAuth()
    const memberData = state.members.find(m => m.id === user?.id) || state.members[0]
    const workouts = state.workouts.filter(w => w.memberId === memberData?.id)

    const toggle = (workoutId, exerciseId) => {
        dispatch({ type: 'TOGGLE_WORKOUT_EXERCISE', payload: { workoutId, exerciseId } })
    }

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Workout Log</h1>
                <p>Track your exercises and mark them complete</p>
            </div>

            {workouts.length === 0 ? (
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>No workout plans assigned yet. Ask your trainer!</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {workouts.map(workout => {
                        const done = workout.exercises.filter(e => e.completed).length
                        const total = workout.exercises.length
                        return (
                            <div className="card-flat" key={workout.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700 }}>{workout.name}</h3>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{workout.day} · {total} exercises</p>
                                    </div>
                                    <span className={`tag ${done === total ? 'tag-success' : done > 0 ? 'tag-warning' : 'tag-info'}`}>
                                        {done}/{total} done
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div style={{ height: 4, background: 'var(--border)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-5)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(done / total) * 100}%`, background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {workout.exercises.map(ex => {
                                        const cals = calculateCalories(ex.name, memberData?.weight || 75, ex.duration || 10)
                                        return (
                                            <div key={ex.id} onClick={() => toggle(workout.id, ex.id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', background: ex.completed ? 'var(--success-bg)' : 'var(--bg-input)', border: `1px solid ${ex.completed ? 'var(--success)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all var(--transition-base)' }}>
                                                <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', border: `2px solid ${ex.completed ? 'var(--success)' : 'var(--border-light)'}`, background: ex.completed ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all var(--transition-fast)' }}>
                                                    {ex.completed && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, textDecoration: ex.completed ? 'line-through' : 'none', opacity: ex.completed ? 0.6 : 1 }}>{ex.name}</p>
                                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{ex.sets} sets × {ex.reps} reps · {ex.rest} rest · {ex.weight}</p>
                                                </div>
                                                <span className="font-mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600 }}>~{cals} kcal</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
