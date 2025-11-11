import { Navigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
