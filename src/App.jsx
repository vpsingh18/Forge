import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import DashboardLayout from './layouts/DashboardLayout'

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard'
import Members from './pages/owner/Members'
import Trainers from './pages/owner/Trainers'
import Revenue from './pages/owner/Revenue'
import Notifications from './pages/owner/Notifications'

// Trainer pages
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import Clients from './pages/trainer/Clients'
import WorkoutBuilder from './pages/trainer/WorkoutBuilder'
import DietBuilder from './pages/trainer/DietBuilder'
import ProgressTracker from './pages/trainer/ProgressTracker'

// Member pages
import MemberDashboard from './pages/member/MemberDashboard'
import WorkoutLog from './pages/member/WorkoutLog'
import CaloriesBurnt from './pages/member/CaloriesBurnt'
import DietPlan from './pages/member/DietPlan'
import Attendance from './pages/member/Attendance'
import Leaderboard from './pages/member/Leaderboard'
import Messages from './pages/member/Messages'

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />
  return <DashboardLayout>{children}</DashboardLayout>
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={`/${user.role}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Owner */}
      <Route path="/owner" element={<ProtectedRoute allowedRole="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/owner/members" element={<ProtectedRoute allowedRole="owner"><Members /></ProtectedRoute>} />
      <Route path="/owner/trainers" element={<ProtectedRoute allowedRole="owner"><Trainers /></ProtectedRoute>} />
      <Route path="/owner/revenue" element={<ProtectedRoute allowedRole="owner"><Revenue /></ProtectedRoute>} />
      <Route path="/owner/notifications" element={<ProtectedRoute allowedRole="owner"><Notifications /></ProtectedRoute>} />

      {/* Trainer */}
      <Route path="/trainer" element={<ProtectedRoute allowedRole="trainer"><TrainerDashboard /></ProtectedRoute>} />
      <Route path="/trainer/clients" element={<ProtectedRoute allowedRole="trainer"><Clients /></ProtectedRoute>} />
      <Route path="/trainer/workout-builder" element={<ProtectedRoute allowedRole="trainer"><WorkoutBuilder /></ProtectedRoute>} />
      <Route path="/trainer/diet-builder" element={<ProtectedRoute allowedRole="trainer"><DietBuilder /></ProtectedRoute>} />
      <Route path="/trainer/progress" element={<ProtectedRoute allowedRole="trainer"><ProgressTracker /></ProtectedRoute>} />

      {/* Member */}
      <Route path="/member" element={<ProtectedRoute allowedRole="member"><MemberDashboard /></ProtectedRoute>} />
      <Route path="/member/workout-log" element={<ProtectedRoute allowedRole="member"><WorkoutLog /></ProtectedRoute>} />
      <Route path="/member/calories" element={<ProtectedRoute allowedRole="member"><CaloriesBurnt /></ProtectedRoute>} />
      <Route path="/member/diet" element={<ProtectedRoute allowedRole="member"><DietPlan /></ProtectedRoute>} />
      <Route path="/member/attendance" element={<ProtectedRoute allowedRole="member"><Attendance /></ProtectedRoute>} />
      <Route path="/member/leaderboard" element={<ProtectedRoute allowedRole="member"><Leaderboard /></ProtectedRoute>} />
      <Route path="/member/messages" element={<ProtectedRoute allowedRole="member"><Messages /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
