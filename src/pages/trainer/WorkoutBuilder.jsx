import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Plus, Trash2, Save, Dumbbell, ChevronDown, ChevronUp, Search, X, Minus, Calendar, Eye } from 'lucide-react'
import Modal from '../../components/Modal'

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
const EXERCISE_LIBRARY = [
    { name: 'Barbell Bench Press', category: 'Strength Training', muscle: 'Chest', type: 'Compound', equipment: 'Barbell' },
    { name: 'Incline Barbell Press', category: 'Strength Training', muscle: 'Chest', type: 'Compound', equipment: 'Barbell' },
    { name: 'Decline Barbell Press', category: 'Strength Training', muscle: 'Chest', type: 'Compound', equipment: 'Barbell' },
    { name: 'Dumbbell Flat Press', category: 'Strength Training', muscle: 'Chest', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'Incline Dumbbell Press', category: 'Strength Training', muscle: 'Chest', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'Dumbbell Chest Flyes', category: 'Strength Training', muscle: 'Chest', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Dumbbell Pullover', category: 'Strength Training', muscle: 'Chest', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Chest Press Machine', category: 'Machine', muscle: 'Chest', type: 'Compound', equipment: 'Machine' },
    { name: 'Pec Deck Fly', category: 'Machine', muscle: 'Chest', type: 'Isolation', equipment: 'Machine' },
    { name: 'Cable Flyes (High-to-Low)', category: 'Machine', muscle: 'Chest', type: 'Isolation', equipment: 'Cable' },
    { name: 'Cable Flyes (Low-to-High)', category: 'Machine', muscle: 'Chest', type: 'Isolation', equipment: 'Cable' },
    { name: 'Push-ups', category: 'Bodyweight', muscle: 'Chest', type: 'Compound', equipment: 'None' },
    { name: 'Diamond Push-ups', category: 'Bodyweight', muscle: 'Chest', type: 'Compound', equipment: 'None' },
    { name: 'Chest Dips', category: 'Bodyweight', muscle: 'Chest', type: 'Compound', equipment: 'Parallel Bars' },
    { name: 'Conventional Deadlift', category: 'Strength Training', muscle: 'Back', type: 'Compound', equipment: 'Barbell' },
    { name: 'Sumo Deadlift', category: 'Strength Training', muscle: 'Back', type: 'Compound', equipment: 'Barbell' },
    { name: 'Bent Over Barbell Row', category: 'Strength Training', muscle: 'Back', type: 'Compound', equipment: 'Barbell' },
    { name: 'One-Arm Dumbbell Row', category: 'Strength Training', muscle: 'Back', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'T-Bar Row', category: 'Strength Training', muscle: 'Back', type: 'Compound', equipment: 'Barbell' },
    { name: 'Barbell Shrugs', category: 'Strength Training', muscle: 'Back', type: 'Isolation', equipment: 'Barbell' },
    { name: 'Lat Pulldown (Wide Grip)', category: 'Machine', muscle: 'Back', type: 'Compound', equipment: 'Cable' },
    { name: 'Seated Cable Row', category: 'Machine', muscle: 'Back', type: 'Compound', equipment: 'Cable' },
    { name: 'Straight Arm Pulldown', category: 'Machine', muscle: 'Back', type: 'Isolation', equipment: 'Cable' },
    { name: 'Face Pulls', category: 'Machine', muscle: 'Back', type: 'Isolation', equipment: 'Cable' },
    { name: 'Back Extensions', category: 'Machine', muscle: 'Back', type: 'Isolation', equipment: 'Bench' },
    { name: 'Pull-ups', category: 'Bodyweight', muscle: 'Back', type: 'Compound', equipment: 'Pull-up Bar' },
    { name: 'Chin-ups', category: 'Bodyweight', muscle: 'Back', type: 'Compound', equipment: 'Pull-up Bar' },
    { name: 'Inverted Rows', category: 'Bodyweight', muscle: 'Back', type: 'Compound', equipment: 'Barbell' },
    { name: 'Power Clean', category: 'Athletic', muscle: 'Back', type: 'Compound', equipment: 'Barbell' },
    { name: 'Back Squat', category: 'Strength Training', muscle: 'Legs', type: 'Compound', equipment: 'Barbell' },
    { name: 'Front Squat', category: 'Strength Training', muscle: 'Legs', type: 'Compound', equipment: 'Barbell' },
    { name: 'Romanian Deadlift', category: 'Strength Training', muscle: 'Legs', type: 'Compound', equipment: 'Barbell' },
    { name: 'Goblet Squat', category: 'Strength Training', muscle: 'Legs', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'Barbell Hip Thrust', category: 'Strength Training', muscle: 'Legs', type: 'Compound', equipment: 'Barbell' },
    { name: 'Leg Press', category: 'Machine', muscle: 'Legs', type: 'Compound', equipment: 'Machine' },
    { name: 'Hack Squat Machine', category: 'Machine', muscle: 'Legs', type: 'Compound', equipment: 'Machine' },
    { name: 'Leg Extension', category: 'Machine', muscle: 'Legs', type: 'Isolation', equipment: 'Machine' },
    { name: 'Lying Leg Curl', category: 'Machine', muscle: 'Legs', type: 'Isolation', equipment: 'Machine' },
    { name: 'Seated Leg Curl', category: 'Machine', muscle: 'Legs', type: 'Isolation', equipment: 'Machine' },
    { name: 'Standing Calf Raise', category: 'Machine', muscle: 'Legs', type: 'Isolation', equipment: 'Machine' },
    { name: 'Seated Calf Raise', category: 'Machine', muscle: 'Legs', type: 'Isolation', equipment: 'Machine' },
    { name: 'Air Squats', category: 'Bodyweight', muscle: 'Legs', type: 'Compound', equipment: 'None' },
    { name: 'Bulgarian Split Squats', category: 'Bodyweight', muscle: 'Legs', type: 'Compound', equipment: 'None' },
    { name: 'Walking Lunges', category: 'Bodyweight', muscle: 'Legs', type: 'Compound', equipment: 'None' },
    { name: 'Step-ups', category: 'Bodyweight', muscle: 'Legs', type: 'Compound', equipment: 'Box' },
    { name: 'Kettlebell Swings', category: 'Athletic', muscle: 'Legs', type: 'Compound', equipment: 'Kettlebell' },
    { name: 'Box Jumps', category: 'Athletic', muscle: 'Legs', type: 'Compound', equipment: 'Box' },
    { name: 'Overhead Press', category: 'Strength Training', muscle: 'Shoulders', type: 'Compound', equipment: 'Barbell' },
    { name: 'Seated Dumbbell Press', category: 'Strength Training', muscle: 'Shoulders', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'Arnold Press', category: 'Strength Training', muscle: 'Shoulders', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'Dumbbell Lateral Raise', category: 'Strength Training', muscle: 'Shoulders', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Dumbbell Front Raise', category: 'Strength Training', muscle: 'Shoulders', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Dumbbell Rear Delt Fly', category: 'Strength Training', muscle: 'Shoulders', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Cable Lateral Raise', category: 'Machine', muscle: 'Shoulders', type: 'Isolation', equipment: 'Cable' },
    { name: 'Machine Shoulder Press', category: 'Machine', muscle: 'Shoulders', type: 'Compound', equipment: 'Machine' },
    { name: 'Pike Push-ups', category: 'Bodyweight', muscle: 'Shoulders', type: 'Compound', equipment: 'None' },
    { name: 'Battle Ropes', category: 'Athletic', muscle: 'Shoulders', type: 'Compound', equipment: 'Ropes' },
    { name: 'Barbell Bicep Curls', category: 'Strength Training', muscle: 'Arms', type: 'Isolation', equipment: 'Barbell' },
    { name: 'Dumbbell Hammer Curls', category: 'Strength Training', muscle: 'Arms', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Preacher Curls', category: 'Strength Training', muscle: 'Arms', type: 'Isolation', equipment: 'EZ-Bar' },
    { name: 'Incline Dumbbell Curls', category: 'Strength Training', muscle: 'Arms', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Close Grip Bench Press', category: 'Strength Training', muscle: 'Arms', type: 'Compound', equipment: 'Barbell' },
    { name: 'Skull Crushers', category: 'Strength Training', muscle: 'Arms', type: 'Isolation', equipment: 'Barbell' },
    { name: 'Dumbbell Overhead Ext.', category: 'Strength Training', muscle: 'Arms', type: 'Isolation', equipment: 'Dumbbell' },
    { name: 'Tricep Rope Pushdown', category: 'Machine', muscle: 'Arms', type: 'Isolation', equipment: 'Cable' },
    { name: 'Cable Bicep Curls', category: 'Machine', muscle: 'Arms', type: 'Isolation', equipment: 'Cable' },
    { name: 'Bench Dips', category: 'Bodyweight', muscle: 'Arms', type: 'Compound', equipment: 'Bench' },
    { name: 'Tricep Push-ups', category: 'Bodyweight', muscle: 'Arms', type: 'Compound', equipment: 'None' },
    { name: "Farmer's Walk", category: 'Athletic', muscle: 'Arms', type: 'Compound', equipment: 'Dumbbell' },
    { name: 'Plank', category: 'Bodyweight', muscle: 'Core', type: 'Isolation', equipment: 'None' },
    { name: 'Side Plank', category: 'Bodyweight', muscle: 'Core', type: 'Isolation', equipment: 'None' },
    { name: 'Hanging Leg Raises', category: 'Bodyweight', muscle: 'Core', type: 'Isolation', equipment: 'Pull-up Bar' },
    { name: 'Bicycle Crunches', category: 'Bodyweight', muscle: 'Core', type: 'Isolation', equipment: 'None' },
    { name: 'Russian Twists', category: 'Bodyweight', muscle: 'Core', type: 'Isolation', equipment: 'None' },
    { name: 'Cable Crunch', category: 'Machine', muscle: 'Core', type: 'Isolation', equipment: 'Cable' },
    { name: 'Woodchoppers', category: 'Machine', muscle: 'Core', type: 'Isolation', equipment: 'Cable' },
    { name: 'Ab Wheel Rollouts', category: 'Athletic', muscle: 'Core', type: 'Compound', equipment: 'Ab Wheel' },
    { name: 'Medicine Ball Slams', category: 'Athletic', muscle: 'Core', type: 'Compound', equipment: 'Med Ball' },
]

const CATEGORIES = ['All', 'Strength Training', 'Bodyweight', 'Machine', 'Athletic']
const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const EQUIP_COLORS = {
    'Barbell': { bg: '#3b4fd8', text: '#fff' },
    'Dumbbell': { bg: '#6d28d9', text: '#fff' },
    'Cable': { bg: '#0369a1', text: '#fff' },
    'Machine': { bg: '#0f766e', text: '#fff' },
    'None': { bg: '#374151', text: '#d1d5db' },
    'Pull-up Bar': { bg: '#065f46', text: '#fff' },
    'EZ-Bar': { bg: '#7c3aed', text: '#fff' },
    'Kettlebell': { bg: '#b45309', text: '#fff' },
    'Box': { bg: '#1d4ed8', text: '#fff' },
    'Ropes': { bg: '#be185d', text: '#fff' },
    'Ab Wheel': { bg: '#0e7490', text: '#fff' },
    'Med Ball': { bg: '#15803d', text: '#fff' },
    'Bench': { bg: '#92400e', text: '#fff' },
    'Parallel Bars': { bg: '#374151', text: '#d1d5db' },
}

function getInputSchema(ex) {
    const isTimeBased =
        (ex.category === 'Bodyweight' && ex.type === 'Isolation') ||
        ex.name === "Farmer's Walk" ||
        ex.name === 'Battle Ropes'
    const showWeight =
        (ex.type === 'Compound' || ex.category === 'Strength Training' || ex.category === 'Machine') &&
        !isTimeBased
    return { isTimeBased, showWeight }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
// Monotonic unique-ID generator — never produces duplicates even in the same ms
let _uid = Date.now()
const uid = () => `${++_uid}-${Math.random().toString(36).slice(2, 7)}`

export default function WorkoutBuilder() {
    const { state, dispatch } = useApp()

    // ── Program state ─────────────────────────────────────────────────────────
    const [programName, setProgramName] = useState('My Program')
    const [days, setDays] = useState([])
    const [activeDayId, setActiveDayId] = useState(null)
    const [saved, setSaved] = useState(false)

    // ── Library filter state ──────────────────────────────────────────────────
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [muscleFilter, setMuscleFilter] = useState('All')
    const [search, setSearch] = useState('')

    // ── View program modal ──────────────────────────────────────────────
    const [viewingProgramId, setViewingProgramId] = useState(null)
    const [viewingDayId,     setViewingDayId]     = useState(null)

    // Always derive from live state so the modal reflects the actual saved data
    const viewingProgram = viewingProgramId
        ? state.programs.find(p => p.id === viewingProgramId) ?? null
        : null

    const activeDay = days.find(d => d.id === activeDayId) ?? null

    // ── Library filtering ─────────────────────────────────────────────────────
    const filteredLibrary = EXERCISE_LIBRARY.filter(ex => {
        const matchCat = categoryFilter === 'All' || ex.category === categoryFilter
        const matchMuscle = muscleFilter === 'All' || ex.muscle === muscleFilter
        const matchSearch = search.trim() === '' || ex.name.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchMuscle && matchSearch
    })

    // ── Day management ────────────────────────────────────────────────────────
    const addDay = () => {
        const usedDays = days.map(d => d.day)
        const nextDay = DAYS_OF_WEEK.find(d => !usedDays.includes(d)) ?? 'Monday'
        const newDay = { id: `day-${Date.now()}`, day: nextDay, label: '', exercises: [] }
        setDays(prev => [...prev, newDay])
        setActiveDayId(newDay.id)
    }

    const removeDay = (dayId) => {
        const updated = days.filter(d => d.id !== dayId)
        setDays(updated)
        if (activeDayId === dayId) setActiveDayId(updated[0]?.id ?? null)
    }

    const updateDay = (dayId, field, value) => {
        setDays(prev => prev.map(d => d.id === dayId ? { ...d, [field]: value } : d))
    }

    // ── Exercise management ───────────────────────────────────────────────────
    const addExercise = (ex) => {
        if (!activeDayId) return
        const { isTimeBased, showWeight } = getInputSchema(ex)
        const defaultSet = {
            id: `set-${uid()}`,
            ...(isTimeBased ? { duration: 30 } : { reps: 10, ...(showWeight ? { weight: '' } : {}) }),
        }
        const newEx = {
            id: `ex-${uid()}`,
            name: ex.name, muscle: ex.muscle, category: ex.category,
            type: ex.type, equipment: ex.equipment, isTimeBased, showWeight,
            sets: [defaultSet],
        }
        setDays(prev => prev.map(d =>
            d.id === activeDayId ? { ...d, exercises: [...d.exercises, newEx] } : d
        ))
    }

    const removeExercise = (exId) => {
        setDays(prev => prev.map(d =>
            d.id === activeDayId ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) } : d
        ))
    }

    // ── Set management ────────────────────────────────────────────────────────
    const addSet = (exId) => {
        setDays(prev => prev.map(d => {
            if (d.id !== activeDayId) return d
            return {
                ...d,
                exercises: d.exercises.map(ex => {
                    if (ex.id !== exId) return ex
                    const last = ex.sets[ex.sets.length - 1] ?? {}
                    const newSet = {
                        id: `set-${uid()}`,
                        ...(ex.isTimeBased
                            ? { duration: last.duration ?? 30 }
                            : { reps: last.reps ?? 10, ...(ex.showWeight ? { weight: last.weight ?? '' } : {}) }
                        ),
                    }
                    return { ...ex, sets: [...ex.sets, newSet] }
                })
            }
        }))
    }

    const removeSet = (exId, setId) => {
        setDays(prev => prev.map(d => {
            if (d.id !== activeDayId) return d
            return {
                ...d,
                exercises: d.exercises.map(ex => {
                    if (ex.id !== exId || ex.sets.length <= 1) return ex
                    return { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
                })
            }
        }))
    }

    const updateSet = (exId, setId, field, value) => {
        setDays(prev => prev.map(d => {
            if (d.id !== activeDayId) return d
            return {
                ...d,
                exercises: d.exercises.map(ex => {
                    if (ex.id !== exId) return ex
                    return { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) }
                })
            }
        }))
    }

    // ── Save program ──────────────────────────────────────────────────────────
    const handleSave = () => {
        if (!programName.trim() || days.length === 0) return
        dispatch({
            type: 'ADD_PROGRAM',
            payload: {
                id: `program-${uid()}`,
                name: programName.trim(),
                createdAt: new Date().toISOString().split('T')[0],
                days,
            }
        })
        setSaved(true)
        setTimeout(() => {
            setSaved(false)
            setDays([])
            setActiveDayId(null)
            setProgramName('My Program')
        }, 1500)
    }

    const totalExercises = days.reduce((acc, d) => acc + d.exercises.length, 0)

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1><span>Workout</span> <span className="text-gradient">Builder</span></h1>
                <p>{state.programs.length} saved program{state.programs.length !== 1 ? 's' : ''} · Assign to PT clients after saving</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-6)', height: 'calc(100vh - 210px)' }}>

                {/* ══ LEFT: Exercise Library ══ */}
                <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Exercise Library</h3>

                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 'var(--space-3)' }}>
                        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input className="input" placeholder="Search exercises…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 32, fontSize: 'var(--text-sm)' }} />
                    </div>

                    {/* Dropdowns */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                        <div>
                            <label style={filterLabelStyle}>Category</label>
                            <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)' }}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={filterLabelStyle}>Muscle</label>
                            <select className="input" value={muscleFilter} onChange={e => setMuscleFilter(e.target.value)}
                                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)' }}>
                                {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Result count */}
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                        {filteredLibrary.length} exercise{filteredLibrary.length !== 1 ? 's' : ''}
                        {!activeDayId && days.length === 0 && (
                            <span style={{ color: 'var(--warning, #f59e0b)', marginLeft: 8 }}>← Add a day first</span>
                        )}
                    </p>

                    {/* Exercise list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2 }}>
                        {filteredLibrary.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                No exercises match.
                            </div>
                        ) : filteredLibrary.map(ex => {
                            const ec = EQUIP_COLORS[ex.equipment] ?? EQUIP_COLORS['None']
                            return (
                                <div key={ex.name}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', gap: 10, transition: 'border-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ex.muscle}</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: ec.bg, color: ec.text }}>{ex.equipment}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addExercise(ex)}
                                        disabled={!activeDayId}
                                        title={activeDayId ? `Add to ${activeDay?.label || activeDay?.day}` : 'Select a day first'}
                                        style={{ width: 28, height: 28, borderRadius: '50%', background: activeDayId ? 'var(--accent)' : 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: activeDayId ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'transform 0.15s, opacity 0.15s', opacity: activeDayId ? 1 : 0.35 }}
                                        onMouseEnter={e => activeDayId && (e.currentTarget.style.transform = 'scale(1.15)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        <Plus size={15} color="#fff" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ══ RIGHT: Program Builder ══ */}
                <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Program name */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap', flexShrink: 0 }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <label style={filterLabelStyle}>Program Name</label>
                            <input className="input" value={programName} onChange={e => setProgramName(e.target.value)} placeholder="e.g. PPL Hypertrophy" id="program-name" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }} />
                        </div>
                        {days.length > 0 && (
                            <button
                                className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={handleSave}
                                style={{ minWidth: 180 }}
                            >
                                <Save size={16} />
                                {saved ? '✓ Saved!' : `Save Program (${days.length} days)`}
                            </button>
                        )}
                    </div>

                    {/* Day tabs */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-4)', flexShrink: 0 }}>
                        {days.map(day => (
                            <div
                                key={day.id}
                                onClick={() => setActiveDayId(day.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px 6px 14px', borderRadius: 'var(--radius-full)',
                                    background: day.id === activeDayId ? 'var(--accent)' : 'var(--bg-input)',
                                    border: `2px solid ${day.id === activeDayId ? 'var(--accent)' : 'var(--border)'}`,
                                    cursor: 'pointer', transition: 'all 0.18s ease', userSelect: 'none',
                                }}
                            >
                                <Calendar size={13} color={day.id === activeDayId ? '#fff' : 'var(--text-muted)'} />
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: day.id === activeDayId ? '#fff' : 'var(--text-primary)' }}>
                                    {day.day.slice(0, 3)}{day.label ? `: ${day.label}` : ''}
                                </span>
                                {day.exercises.length > 0 && (
                                    <span style={{ fontSize: 9, background: day.id === activeDayId ? 'rgba(255,255,255,0.25)' : 'var(--accent)', color: '#fff', borderRadius: 999, padding: '1px 6px', fontWeight: 700 }}>
                                        {day.exercises.length}
                                    </span>
                                )}
                                <button
                                    onClick={e => { e.stopPropagation(); removeDay(day.id) }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: day.id === activeDayId ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginLeft: 2 }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <button className="btn btn-secondary btn-sm" onClick={addDay} style={{ borderStyle: 'dashed' }}>
                            <Plus size={14} /> Add Day
                        </button>
                    </div>

                    {/* ── Scrollable content area ── */}
                    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2 }}>

                    {/* ── No days state ── */}
                    {days.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 'var(--space-14)', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                            <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.25 }} />
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>No days yet</p>
                            <p style={{ fontSize: 'var(--text-sm)' }}>Click <strong>Add Day</strong> above to start building your program.</p>
                        </div>
                    )}

                    {/* ── Active day content ── */}
                    {activeDay && (
                        <div>
                            {/* Day settings row */}
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                                <div>
                                    <label style={filterLabelStyle}>Day of Week</label>
                                    <select className="input" value={activeDay.day} onChange={e => updateDay(activeDayId, 'day', e.target.value)} style={{ fontSize: 'var(--text-sm)', minWidth: 130 }}>
                                        {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: 160 }}>
                                    <label style={filterLabelStyle}>Session Name</label>
                                    <input className="input" placeholder="e.g. Push Day, Legs, Upper Body…"
                                        value={activeDay.label}
                                        onChange={e => updateDay(activeDayId, 'label', e.target.value)}
                                        style={{ fontSize: 'var(--text-sm)' }} />
                                </div>
                            </div>

                            {/* Exercises empty state */}
                            {activeDay.exercises.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)' }}>
                                    <Dumbbell size={24} style={{ margin: '0 auto 8px', opacity: 0.25 }} />
                                    Click <strong>+</strong> on any exercise in the library to add it here.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {activeDay.exercises.map((ex, exIdx) => {
                                        const ec = EQUIP_COLORS[ex.equipment] ?? EQUIP_COLORS['None']
                                        // grid cols: # | [time or reps] | [weight?] | del
                                        const gridCols = ex.isTimeBased
                                            ? '28px 1fr 28px'
                                            : ex.showWeight
                                                ? '28px 1fr 1fr 28px'
                                                : '28px 1fr 28px'

                                        return (
                                            <div key={ex.id} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                                {/* Exercise header */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, minWidth: 24 }}>#{exIdx + 1}</span>
                                                        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{ex.name}</span>
                                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: ec.bg, color: ec.text }}>{ex.equipment}</span>
                                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: ex.isTimeBased ? '#064e3b' : ex.type === 'Compound' ? '#1e3a5f' : '#3b1d60', color: '#fff' }}>
                                                            {ex.isTimeBased ? '⏱ Timed' : ex.type}
                                                        </span>
                                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ex.muscle}</span>
                                                    </div>
                                                    <button onClick={() => removeExercise(ex.id)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>

                                                {/* Set table */}
                                                <div style={{ padding: '10px 14px' }}>
                                                    {/* Table header */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, marginBottom: 6 }}>
                                                        <span style={thStyle}>Set</span>
                                                        {ex.isTimeBased ? <span style={thStyle}>Time (s)</span> : <span style={thStyle}>Reps</span>}
                                                        {ex.showWeight && !ex.isTimeBased && <span style={thStyle}>Weight (kg)</span>}
                                                        <span />
                                                    </div>

                                                    {/* Set rows */}
                                                    {ex.sets.map((set, si) => (
                                                        <div key={set.id} style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, marginBottom: 6, alignItems: 'center' }}>
                                                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 6 }}>{si + 1}</span>

                                                            {ex.isTimeBased ? (
                                                                <input type="number" className="input" style={setInputStyle}
                                                                    value={set.duration ?? 30} min={5}
                                                                    onChange={e => updateSet(ex.id, set.id, 'duration', e.target.value)} />
                                                            ) : (
                                                                <input type="number" className="input" style={setInputStyle}
                                                                    value={set.reps ?? 10} min={1}
                                                                    onChange={e => updateSet(ex.id, set.id, 'reps', e.target.value)} />
                                                            )}

                                                            {ex.showWeight && !ex.isTimeBased && (
                                                                <input type="text" className="input" style={setInputStyle}
                                                                    value={set.weight ?? ''} placeholder="kg"
                                                                    onChange={e => updateSet(ex.id, set.id, 'weight', e.target.value)} />
                                                            )}

                                                            <button
                                                                onClick={() => removeSet(ex.id, set.id)}
                                                                disabled={ex.sets.length <= 1}
                                                                style={{ background: 'none', border: 'none', color: ex.sets.length <= 1 ? 'var(--border)' : 'var(--danger)', cursor: ex.sets.length <= 1 ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', padding: 0 }}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Add Set button */}
                                                    <button className="btn btn-secondary btn-sm" onClick={() => addSet(ex.id)}
                                                        style={{ marginTop: 4, fontSize: 'var(--text-xs)' }}>
                                                        <Plus size={13} /> Add Set
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Summary bar when exercises exist */}
                            {activeDay.exercises.length > 0 && (
                                <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                    <span>{activeDay.exercises.length} exercise{activeDay.exercises.length !== 1 ? 's' : ''} · {activeDay.exercises.reduce((a, e) => a + e.sets.length, 0)} total sets</span>
                                    <span>Program total: {days.length} day{days.length !== 1 ? 's' : ''} · {totalExercises} exercises</span>
                                </div>
                            )}
                        </div>
                    )}
                    </div>{/* end scrollable content */}
                </div>
            </div>

            {/* ══ Saved Programs ══ */}
            {state.programs.length > 0 && (
                <div style={{ marginTop: 'var(--space-8)' }}>
                    <h2 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                        Saved Programs
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)', alignItems: 'stretch' }}>
                        {state.programs.map(prog => {
                            const totalEx = prog.days.reduce((a, d) => a + d.exercises.length, 0)
                            return (
                                <div key={prog.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
                                    {/* Header row */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Dumbbell size={20} color="#fff" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prog.name}</p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                                                {prog.days.length} day{prog.days.length !== 1 ? 's' : ''}/week &middot; {totalEx} exercises &middot; {prog.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Day pills */}
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {prog.days.map(day => (
                                            <span key={day.id} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'var(--bg-input)', border: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                {day.day.slice(0, 3)}{day.label ? `: ${day.label}` : ''}
                                                <span style={{ opacity: 0.6, marginLeft: 4 }}>({day.exercises.length})</span>
                                            </span>
                                        ))}
                                    </div>
                                    {/* Actions */}
                                    <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                                        <button className="btn btn-secondary btn-sm"
                                            onClick={() => { setViewingProgramId(prog.id); setViewingDayId(prog.days[0]?.id ?? null) }}>
                                            <Eye size={13} /> View
                                        </button>
                                        <button className="btn btn-sm"
                                            style={{ color: 'var(--danger)', background: 'transparent', border: '1px solid var(--danger)' }}
                                            onClick={() => dispatch({ type: 'DELETE_PROGRAM', payload: prog.id })}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ══ View Program Modal ══ */}
            <Modal isOpen={!!viewingProgram} onClose={() => { setViewingProgramId(null); setViewingDayId(null) }} title={viewingProgram?.name ?? ''} className="modal-content--wide">
                {viewingProgram && (() => {
                    const vProg = viewingProgram
                    const activeDayIdV = viewingDayId ?? vProg.days[0]?.id
                    const activeViewDay = vProg.days.find(d => d.id === activeDayIdV) ?? vProg.days[0]
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>

                            {/* ── Day-tab row (non-scrolling) ── */}
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                                {vProg.days.map(day => (
                                    <button key={day.id} onClick={() => setViewingDayId(day.id)}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            fontSize: 11, padding: '5px 14px', borderRadius: 999, fontWeight: 700, cursor: 'pointer',
                                            border: `2px solid ${day.id === activeDayIdV ? 'var(--accent)' : 'var(--border)'}`,
                                            background: day.id === activeDayIdV ? 'var(--accent)' : 'var(--bg-input)',
                                            color: day.id === activeDayIdV ? '#fff' : 'var(--text-primary)',
                                            transition: 'all 0.15s',
                                        }}>
                                        <Calendar size={11} />
                                        {day.day.slice(0, 3)}{day.label ? `: ${day.label}` : ''}
                                        <span style={{ opacity: 0.75, marginLeft: 3 }}>({day.exercises.length})</span>
                                    </button>
                                ))}
                            </div>

                            {/* ── Scrollable exercise list (fills remaining modal height) ── */}
                            {activeViewDay && (
                                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingRight: 4 }}>
                                    {activeViewDay.exercises.length === 0 ? (
                                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>No exercises in this session.</p>
                                    ) : activeViewDay.exercises.map((ex, exIdx) => {
                                        const ec = EQUIP_COLORS[ex.equipment] ?? EQUIP_COLORS['None']
                                        const hasWeight = ex.showWeight && !ex.isTimeBased
                                        // columns: set# | reps-or-time | [weight]
                                        const gridCols = ex.isTimeBased
                                            ? '36px 1fr'
                                            : hasWeight ? '36px 1fr 1fr' : '36px 1fr'
                                        return (
                                            <div key={`vex-${exIdx}`} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                                                {/* Exercise header */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 700, minWidth: 24 }}>#{exIdx + 1}</span>
                                                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{ex.name}</span>
                                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: ec.bg, color: ec.text }}>{ex.equipment}</span>
                                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: ex.isTimeBased ? '#064e3b' : ex.type === 'Compound' ? '#1e3a5f' : '#3b1d60', color: '#fff' }}>
                                                        {ex.isTimeBased ? '⏱ Timed' : ex.type}
                                                    </span>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ex.muscle}</span>
                                                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                                                        {ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                {/* Set table */}
                                                <div style={{ padding: '12px 16px' }}>
                                                    {/* Column headers */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, marginBottom: 8 }}>
                                                        <span style={thStyle}>SET</span>
                                                        {ex.isTimeBased
                                                            ? <span style={{ ...thStyle, textAlign: 'center' }}>TIME (s)</span>
                                                            : <span style={{ ...thStyle, textAlign: 'center' }}>REPS</span>}
                                                        {hasWeight && <span style={{ ...thStyle, textAlign: 'center' }}>WEIGHT (KG)</span>}
                                                    </div>
                                                    {/* Set rows — one per actual set */}
                                                    {ex.sets.map((set, si) => (
                                                        <div key={`vex${exIdx}-s${si}`} style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, marginBottom: 6, alignItems: 'center' }}>
                                                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>{si + 1}</span>
                                                            <span style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '7px 0', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                                                {ex.isTimeBased ? `${set.duration ?? 30}s` : (set.reps ?? 10)}
                                                            </span>
                                                            {hasWeight && (
                                                                <span style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '7px 0', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                                                    {set.weight && set.weight !== '' ? `${set.weight} kg` : '— kg'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Summary footer */}
                                    <div style={{ flexShrink: 0, marginTop: 'var(--space-1)', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{activeViewDay.exercises.length} exercise{activeViewDay.exercises.length !== 1 ? 's' : ''} · {activeViewDay.exercises.reduce((a, e) => a + e.sets.length, 0)} total sets</span>
                                        <span>{vProg.days.length} day{vProg.days.length !== 1 ? 's' : ''}/week · {vProg.days.reduce((a, d) => a + d.exercises.length, 0)} total exercises</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })()}
            </Modal>
        </div>
    )
}

// ── Shared micro-styles ────────────────────────────────────────────────────────
const filterLabelStyle = {
    fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
    fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: 4,
}
const thStyle = {
    fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase',
    fontWeight: 700, letterSpacing: '0.05em',
}
const setInputStyle = {
    padding: 'var(--space-2)', fontSize: 'var(--text-sm)', textAlign: 'center',
}
