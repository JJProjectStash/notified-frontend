import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/utils/constants'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}
