import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Plus, Trash2, Save } from 'lucide-react'

const EXERCISE_LIBRARY = [
    { name: 'Bench Press', muscle: 'Chest' },
    { name: 'Squats', muscle: 'Legs' },
    { name: 'Deadlifts', muscle: 'Back' },
    { name: 'Overhead Press', muscle: 'Shoulders' },
    { name: 'Barbell Rows', muscle: 'Back' },
    { name: 'Pull-ups', muscle: 'Back' },
    { name: 'Bicep Curls', muscle: 'Arms' },
    { name: 'Tricep Dips', muscle: 'Arms' },
    { name: 'Lunges', muscle: 'Legs' },
    { name: 'Leg Press', muscle: 'Legs' },
    { name: 'Plank', muscle: 'Core' },
    { name: 'Push-ups', muscle: 'Chest' },
    { name: 'Calf Raises', muscle: 'Legs' },
    { name: 'Lat Pulldown', muscle: 'Back' },
    { name: 'Cable Flyes', muscle: 'Chest' }
]

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']

export default function WorkoutBuilder() {
    const { state } = useApp()
    const [planName, setPlanName] = useState('Push Day')
    const [selectedDay, setSelectedDay] = useState('Monday')
    const [exercises, setExercises] = useState([])
    const [muscleFilter, setMuscleFilter] = useState('All')
    const [saved, setSaved] = useState(false)

    const filteredLibrary = EXERCISE_LIBRARY.filter(e => muscleFilter === 'All' || e.muscle === muscleFilter)

    const addExercise = (ex) => {
        setExercises(prev => [...prev, { ...ex, id: Date.now(), sets: 3, reps: 10, rest: '60s', weight: '', duration: 10 }])
    }

    const updateExercise = (id, field, value) => {
        setExercises(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
    }

    const removeExercise = (id) => {
        setExercises(prev => prev.filter(e => e.id !== id))
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Workout Builder</h1>
                <p>Create and assign workout plans to your clients</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'var(--space-6)', alignItems: 'start' }}>
                {/* Exercise Library */}
                <div className="card-flat">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Exercise Library</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                        {MUSCLE_GROUPS.map(g => (
                            <button key={g} className={`btn btn-sm ${muscleFilter === g ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMuscleFilter(g)}>{g}</button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {filteredLibrary.map(ex => (
                            <button key={ex.name} onClick={() => addExercise(ex)}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left', transition: 'all var(--transition-fast)' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{ex.name}</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ex.muscle}</p>
                                </div>
                                <Plus size={16} style={{ color: 'var(--accent)' }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plan Builder */}
                <div className="card-flat">
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>Plan Name</label>
                            <input className="input" value={planName} onChange={e => setPlanName(e.target.value)} id="plan-name" />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', display: 'block' }}>Day</label>
                            <select className="input" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ minWidth: 130 }} id="plan-day">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {exercises.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                            ← Pick exercises from the library to add them here
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                            {exercises.map(ex => (
                                <div key={ex.id} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                        <div>
                                            <p style={{ fontWeight: 700 }}>{ex.name}</p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ex.muscle}</p>
                                        </div>
                                        <button onClick={() => removeExercise(ex.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                                        {[
                                            { label: 'Sets', field: 'sets', type: 'number' },
                                            { label: 'Reps', field: 'reps', type: 'number' },
                                            { label: 'Weight', field: 'weight', type: 'text' },
                                            { label: 'Rest', field: 'rest', type: 'text' }
                                        ].map(({ label, field, type }) => (
                                            <div key={field}>
                                                <label style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</label>
                                                <input type={type} className="input" style={{ padding: 'var(--space-2)' }} value={ex[field]} onChange={e => updateExercise(ex.id, field, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {exercises.length > 0 && (
                        <button className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`} onClick={handleSave} style={{ width: '100%' }} id="save-plan">
                            <Save size={16} />
                            {saved ? '✓ Plan Saved!' : 'Save Plan'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
