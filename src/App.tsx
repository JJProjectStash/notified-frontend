import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ToastContainer } from '@/components/ui/toast'
import { ROUTES } from '@/utils/constants'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const StudentsPage = lazy(() => import('@/pages/StudentsPage'))
const SubjectsPage = lazy(() => import('@/pages/SubjectsPage'))
const RecordsPage = lazy(() => import('@/pages/RecordsPage'))
const EmailHistoryPage = lazy(() => import('@/pages/EmailHistoryPage'))

/**
 * Loading component shown while routes are being lazy loaded
 */
function PageLoadingFallback() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Main application component with lazy-loaded routes
 */
function App() {
  return (
    <>
      <Suspense fallback={<PageLoadingFallback />}>
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
          <Route
            path={ROUTES.EMAIL_HISTORY}
            element={
              <ProtectedRoute>
                <EmailHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  )
}

export default App
