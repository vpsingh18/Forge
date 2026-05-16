import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Users, Star, Flame, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { getInitials } from '../utils/helpers'
import './TopBar.css'

export default function TopBar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { state } = useApp()
    const moduleName = user?.role ? `${user.role} module` : 'owner module'

    // Dynamic stat values from state
    const memberCount = state.members.length
    const trainerData = state.trainers.find(t => t.id === user?.id) || state.trainers[0]
    const memberData = state.members.find(m => m.id === user?.id) || state.members[0]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="topbar">
            {/* Logo and Module Pill */}
            <div className="topbar-brand">
                <span className="logo-text text-gradient">FORGE.</span>
                {/* <span className="module-pill">{moduleName}</span> */}
            </div>

            <div className="topbar-search">
                <Search size={18} className="topbar-search-icon" />
                <input
                    type="text"
                    className="input topbar-search-input"
                    placeholder="Search members, workouts, reports..."
                />
            </div>

            <div className="topbar-actions">
                <div className="topbar-stat-pill">
                    {user?.role === 'trainer' ? (
                        <><Star size={14} className="stat-icon" /> Rated {trainerData?.rating || '—'}</>
                    ) : user?.role === 'member' ? (
                        <><Flame size={14} className="stat-icon" /> {memberData?.streak || 0}-day streak</>
                    ) : (
                        <><Users size={14} className="stat-icon" /> {memberCount} Members</>
                    )}
                </div>

                <button className="topbar-icon-btn" aria-label="Notifications">
                    <Bell size={18} />
                    <span className="topbar-badge" /></button>

                <div className="topbar-user" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <div className="topbar-avatar">
                        {getInitials(user?.name || 'U')}
                    </div>

                    {isProfileOpen && (
                        <div className="topbar-profile-dropdown">
                            <div className="topbar-dropdown-header">
                                <span className="topbar-dropdown-name">{user?.name || 'User'}</span>
                                <span className="topbar-dropdown-email">{user?.email || 'user@example.com'}</span>
                            </div>
                            <div className="topbar-dropdown-divider" />
                            <button className="topbar-dropdown-item">
                                <User size={16} /> Profile Actions
                            </button>
                            <button className="topbar-dropdown-item topbar-logout-item" onClick={handleLogout}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
