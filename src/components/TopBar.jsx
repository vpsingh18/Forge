import { useState, useRef, useEffect } from 'react'
import { Search, Settings, Users, Star, Flame, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '../utils/helpers'
import './TopBar.css'

export default function TopBar() {
    const { user, logout } = useAuth()
    const { state } = useApp()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const memberCount = state.members.length
    const trainerData = state.trainers.find(t => t.id === user?.id) || state.trainers[0]
    const memberData = state.members.find(m => m.id === user?.id) || state.members[0]

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleLogout() {
        setDropdownOpen(false)
        logout()
        navigate('/login')
    }

    return (
        <header className="topbar">
            {/* Logo and Module Pill */}
            <div className="topbar-brand">
                <span className="logo-text text-gradient">FORGE.</span>
                <span className="module-pill">{user?.role ? `${user.role} module` : 'owner module'}</span>
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

                {/* Settings icon with dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                        className="topbar-icon-btn"
                        aria-label="Settings"
                        onClick={() => setDropdownOpen(o => !o)}
                    >
                        <Settings size={20} />
                    </button>

                    {dropdownOpen && (
                        <div className="topbar-dropdown">
                            <div className="topbar-dropdown-header">
                                <div className="topbar-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                                    {getInitials(user?.name || 'U')}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{user?.name}</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
                                </div>
                            </div>
                            <div className="topbar-dropdown-divider" />
                            <button className="topbar-dropdown-item topbar-dropdown-danger" onClick={handleLogout}>
                                <LogOut size={15} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className="topbar-user">
                    <div className="topbar-avatar">
                        {getInitials(user?.name || 'U')}
                    </div>
                </div>
            </div>
        </header>
    )
}
