import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const ProtectedRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        // TODO: Replace with a nice loading spinner component
        return (
            <div className="flex items-center justify-center h-screen bg-linen">
                <div className="text-terracotta font-serif text-xl animate-pulse">Cargando...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
