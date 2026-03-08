import { createContext, useContext, useReducer } from 'react'
import { members } from '../data/members'
import { trainers } from '../data/trainers'
import { workouts } from '../data/workouts'
import { diets } from '../data/diets'
import { analytics } from '../data/analytics'

const AppContext = createContext(null)

const initialState = {
    members,
    trainers,
    workouts,
    diets,
    analytics,
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
