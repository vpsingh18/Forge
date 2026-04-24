import { createContext, useContext, useReducer } from 'react'
import { members }          from '../data/members'
import { trainers }         from '../data/trainers'
import { workouts }         from '../data/workouts'
import { diets }            from '../data/diets'
import { analytics }        from '../data/analytics'
import { programs }         from '../data/presetWorkouts'
import { progressLogs }     from '../data/progressLogs'
import { sessions }         from '../data/sessions'
import { trainerAttendance } from '../data/trainerAttendance'
import { clientAttendance }  from '../data/clientAttendance'

const AppContext = createContext(null)

const initialState = {
    members,
    trainers,
    workouts,
    diets,
    analytics,
    programs,
    progressLogs,
    sessions,
    trainerAttendance,
    clientAttendance,
    notifications: [],
    messages: []
}

function appReducer(state, action) {
    switch (action.type) {
        // ── Members CRUD ────────────────────────
        case 'ADD_MEMBER':
            return { ...state, members: [...state.members, action.payload] }

        case 'UPDATE_MEMBER':
            return {
                ...state,
                members: state.members.map(m =>
                    m.id === action.payload.id ? { ...m, ...action.payload } : m
                )
            }

        case 'DELETE_MEMBER':
            return {
                ...state,
                members: state.members.filter(m => m.id !== action.payload)
            }

        // ── Trainers CRUD ───────────────────────
        case 'ADD_TRAINER':
            return { ...state, trainers: [...state.trainers, action.payload] }

        case 'UPDATE_TRAINER':
            return {
                ...state,
                trainers: state.trainers.map(t =>
                    t.id === action.payload.id ? { ...t, ...action.payload } : t
                )
            }

        case 'DELETE_TRAINER':
            return {
                ...state,
                trainers: state.trainers.filter(t => t.id !== action.payload)
            }

        // ── Programs (multi-day workout programs) ─────
        case 'ADD_PROGRAM':
            return {
                ...state,
                programs: [...state.programs, action.payload]
            }

        case 'DELETE_PROGRAM':
            return {
                ...state,
                programs: state.programs.filter(p => p.id !== action.payload)
            }

        // ── Progress Logs ────────────────────────
        case 'ADD_PROGRESS_LOG': {
            const { memberId, log } = action.payload
            const exists = state.progressLogs.find(e => e.memberId === memberId)
            return {
                ...state,
                progressLogs: exists
                    ? state.progressLogs.map(e =>
                        e.memberId === memberId
                            ? { ...e, logs: [...e.logs, log] }
                            : e
                    )
                    : [...state.progressLogs, { memberId, logs: [log] }]
            }
        }

        // ── Sessions ─────────────────────────────
        case 'ADD_SESSION':
            return { ...state, sessions: [...state.sessions, action.payload] }

        case 'CANCEL_SESSION':
            return {
                ...state,
                sessions: state.sessions.map(s =>
                    s.id === action.payload ? { ...s, status: 'Cancelled' } : s
                )
            }

        // ── Trainer Attendance ───────────────────
        case 'ADD_TRAINER_ATTENDANCE':
            return {
                ...state,
                // If record for this date+trainer already exists, update it; else append
                trainerAttendance: state.trainerAttendance.find(
                    r => r.trainerId === action.payload.trainerId && r.date === action.payload.date
                )
                    ? state.trainerAttendance.map(r =>
                        r.trainerId === action.payload.trainerId && r.date === action.payload.date
                            ? { ...r, ...action.payload }
                            : r
                    )
                    : [...state.trainerAttendance, action.payload]
            }

        // ── Client Attendance ────────────────────
        case 'ADD_CLIENT_ATTENDANCE':
            return {
                ...state,
                clientAttendance: [...state.clientAttendance, action.payload]
            }

        // ── Existing actions ────────────────────
        case 'TOGGLE_WORKOUT_EXERCISE':
            return {
                ...state,
                workouts: state.workouts.map(w =>
                    w.id === action.payload.workoutId
                        ? {
                            ...w,
                            exercises: w.exercises.map(e =>
                                e.id === action.payload.exerciseId
                                    ? { ...e, completed: !e.completed }
                                    : e
                            )
                        }
                        : w
                )
            }
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            }
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        default:
            return state
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState)

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used within AppProvider')
    return context
}
