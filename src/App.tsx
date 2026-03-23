import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { UploadPage } from './pages/dashboard/UploadPage'
import { JobStatusPage } from './pages/dashboard/JobStatusPage'
import { HistoryPage } from './pages/dashboard/HistoryPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
import { AuthLayout } from './components/layouts/AuthLayout'
import { DashboardLayout } from './components/layouts/DashboardLayout'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="jobs/:jobId" element={<JobStatusPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

