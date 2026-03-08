import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { getInitials } from '../utils/helpers'
import {
    LayoutDashboard, Users, Dumbbell, UtensilsCrossed,
    TrendingUp, Bell, LogOut, UserCircle, Trophy,
    MessageSquare, CalendarCheck, Flame, ChevronLeft,
    Settings, Target, ChartBar, Camera, Activity, CalendarDays, Key, MapPin
} from 'lucide-react'
import './Sidebar.css'

function buildMenuItems(role, state, user) {
    const memberCount = state.members.length
    const expiringCount = state.members.filter(m => m.status === 'expiring').length
    const trainerData = state.trainers.find(t => t.id === user?.id) || state.trainers[0]
    const myClients = state.members.filter(m => m.trainerId === trainerData?.id)
    const msgCount = state.messages.length

    const menus = {
        owner: [
            { section: 'BUSINESS' },
            { path: '/owner', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/owner/members', icon: Users, label: 'Members', badge: String(memberCount) },
            { path: '/owner/revenue', icon: TrendingUp, label: 'Revenue' },
            { path: '/owner/renewals', icon: Key, label: 'Renewals', badge: expiringCount > 0 ? String(expiringCount) : undefined },
            { path: '/owner/schedule', icon: CalendarDays, label: 'Schedule' },
            { section: 'MANAGEMENT' },
            { path: '/owner/trainers', icon: Dumbbell, label: 'Trainers' },
            { path: '/owner/facilities', icon: MapPin, label: 'Facilities' },
            { path: '/owner/notifications', icon: Bell, label: 'Notifications' },
            { path: '/owner/analytics', icon: ChartBar, label: 'Analytics' },
            { section: 'SYSTEM' },
            { path: '/owner/settings', icon: Settings, label: 'Settings' }
        ],
        trainer: [
            { section: 'CLIENTS' },
            { path: '/trainer', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/trainer/clients', icon: Users, label: 'My Clients', badge: String(myClients.length) },
            { path: '/trainer/workout-builder', icon: Dumbbell, label: 'Workout Plans' },
            { path: '/trainer/diet-builder', icon: UtensilsCrossed, label: 'Diet Charts' },
            { path: '/trainer/progress', icon: TrendingUp, label: 'Progress Tracking' },
            { section: 'SCHEDULE' },
            { path: '/trainer/sessions', icon: CalendarDays, label: 'Sessions' },
            { path: '/trainer/attendance', icon: CalendarCheck, label: 'Attendance' },
            { path: '/trainer/messages', icon: MessageSquare, label: 'Messages', badge: msgCount > 0 ? String(msgCount) : undefined },
            { section: 'TOOLS' },
            { path: '/trainer/photos', icon: Camera, label: 'Progress Photos' },
            { path: '/trainer/measurements', icon: Activity, label: 'Measurements' },
            { path: '/trainer/settings', icon: Settings, label: 'Settings' }
        ],
        member: [
            { section: 'MAIN' },
            { path: '/member', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/member/workout-log', icon: Dumbbell, label: 'Workouts' },
            { path: '/member/diet', icon: UtensilsCrossed, label: 'Diet Plan' },
            { path: '/member/progress', icon: TrendingUp, label: 'My Progress' },
            { path: '/member/book', icon: CalendarDays, label: 'Book Sessions' },
            { section: 'COMMUNITY' },
            { path: '/member/leaderboard', icon: Trophy, label: 'Leaderboard', badgeText: 'LIVE', badgeType: 'danger' },
            { path: '/member/challenges', icon: Flame, label: 'Challenges' },
            { path: '/member/messages', icon: MessageSquare, label: 'Messages', badge: msgCount > 0 ? String(msgCount) : undefined },
            { section: 'ACCOUNT' },
            { path: '/member/profile', icon: UserCircle, label: 'Profile' },
            { path: '/member/settings', icon: Settings, label: 'Settings' }
        ]
    }

    return menus[role] || []
}

export default function Sidebar() {
    const { user, logout } = useAuth()
    const { state } = useApp()
    const navigate = useNavigate()
    const items = buildMenuItems(user?.role, state, user)

    // For member: look up assigned trainer from state
    const memberData = user?.role === 'member' ? (state.members.find(m => m.id === user?.id) || state.members[0]) : null
    const myTrainer = memberData?.trainerId ? state.trainers.find(t => t.id === memberData.trainerId) : null

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {items.map((item, index) => {
                    if (item.section) {
                        return (
                            <div key={`section-${index}`} className="sidebar-section">
                                {item.section}
                            </div>
                        )
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === `/${user?.role}`}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                            }
                        >
                            <div className="sidebar-link-content">
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </div>

                            {item.badge && (
                                <span className="sidebar-badge">{item.badge}</span>
                            )}
                            {item.badgeText && (
                                <span className={`tag tag-${item.badgeType || 'info'} sidebar-tag`}>
                                    {item.badgeText}
                                </span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-link sidebar-logout" onClick={handleLogout} title="Logout">
                    <div className="sidebar-link-content">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </div>
                </button>
            </div>

            {user?.role === 'member' && myTrainer && (
                <div className="sidebar-assigned-staff">
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Trainer</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-input)', padding: 12, borderRadius: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{getInitials(myTrainer.name)}</div>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{myTrainer.name}</p>
                            <p style={{ fontSize: 10, color: 'var(--success)' }}>● {myTrainer.status === 'active' ? 'Active now' : 'Offline'}</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 8 }}>
                        <MessageSquare size={12} /> Message Trainer
                    </button>
                </div>
            )}
        </aside>
    )
}
