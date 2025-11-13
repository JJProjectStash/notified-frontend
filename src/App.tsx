import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from '@/components/ui/toast'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/utils/constants'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardPage from '@/pages/DashboardPage'
import StudentsPage from '@/pages/StudentsPage'
import SubjectsPage from '@/pages/SubjectsPage'
import RecordsPage from '@/pages/RecordsPage'

// Protected Route wrapper
import { ProtectedRoute } from '@/components/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        
        {/* Protected Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENTS}
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SUBJECTS}
          element={
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RECORDS}
          element={
            <ProtectedRoute>
              <RecordsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
