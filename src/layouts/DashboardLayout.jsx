import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
    const { user } = useAuth()
    const themeClass = `theme-${user?.role || 'owner'}`

    return (
        <div className={`dashboard-layout ${themeClass}`}>
            <TopBar />
            <div className="dashboard-bottom">
                <Sidebar />
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    )
}
