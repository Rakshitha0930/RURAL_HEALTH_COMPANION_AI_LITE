import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AIChatPage from './pages/AIChatPage'
import ClinicFinderPage from './pages/ClinicFinderPage'
import HealthRecordsPage from './pages/HealthRecordsPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute'
import GuestRoute from './components/guards/GuestRoute'

export default function App() {
  return (
    <Routes>
      {/* Public home */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Auth pages */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected app pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/clinic-finder" element={<ClinicFinderPage />} />
          <Route path="/health-records" element={<HealthRecordsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
