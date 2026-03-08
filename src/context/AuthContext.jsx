import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
    owner: {
        id: 'owner-1',
        name: 'Rajesh Kumar',
        email: 'rajesh@forgegym.com',
        role: 'owner',
        avatar: null,
        gymName: 'Forge Fitness Hub'
    },
    trainer: {
        id: 'trainer-1',
        name: 'Priya Sharma',
        email: 'priya@forgegym.com',
        role: 'trainer',
        avatar: null,
        specialization: 'Strength & Conditioning'
    },
    member: {
        id: 'member-1',
        name: 'Arjun Mehta',
        email: 'arjun@email.com',
        role: 'member',
        avatar: null,
        membershipType: 'pt',
        trainerId: 'trainer-1'
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const login = (role) => {
        setIsLoading(true)
        setTimeout(() => {
            setUser(DEMO_USERS[role])
            setIsLoading(false)
        }, 600)
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
