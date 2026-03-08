import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const ROLES = [
    {
        id: 'owner',
        label: 'Owner',
        emoji: '👔',
        description: 'Manage your gym — members, revenue & analytics'
    },
    {
        id: 'trainer',
        label: 'Trainer',
        emoji: '🏋️',
        description: 'Manage your clients, plans & progress'
    },
    {
        id: 'member',
        label: 'Member',
        emoji: '🙋',
        description: 'Track workouts, diet & gym attendance'
    }
]

export default function Login() {
    const [selectedRole, setSelectedRole] = useState(null)
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()

    const handleLogin = () => {
        if (!selectedRole) return
        login(selectedRole)
        setTimeout(() => navigate(`/${selectedRole}`), 700)
    }

    return (
        <div className="login-page">
            <div className="login-bg-glow" />

            <div className="login-container animate-fade-in-up">
                <div className="login-header">
                    <span className="login-logo-icon">⚒️</span>
                    <h1 className="login-title text-gradient">FORGE</h1>
                    <p className="login-subtitle">Gym Management Platform</p>
                </div>

                <div className="login-card card-flat">
                    <h2 className="login-card-title">Sign in as</h2>
                    <p className="login-card-desc">Choose your role to access your dashboard</p>

                    <div className="role-grid">
                        {ROLES.map(role => (
                            <button
                                key={role.id}
                                className={`role-card ${selectedRole === role.id ? 'role-card-selected' : ''}`}
                                onClick={() => setSelectedRole(role.id)}
                                id={`role-${role.id}`}
                            >
                                <span className="role-emoji">{role.emoji}</span>
                                <span className="role-label">{role.label}</span>
                                <span className="role-desc">{role.description}</span>
                                {selectedRole === role.id && (
                                    <span className="role-check">✓</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary btn-lg login-btn"
                        onClick={handleLogin}
                        disabled={!selectedRole || isLoading}
                        id="login-submit"
                    >
                        {isLoading ? (
                            <span className="login-spinner" />
                        ) : (
                            `Continue as ${selectedRole ? ROLES.find(r => r.id === selectedRole)?.label : '...'}`
                        )}
                    </button>

                    <p className="login-demo-note">
                        🔒 Demo mode — no credentials needed
                    </p>
                </div>
            </div>
        </div>
    )
}
