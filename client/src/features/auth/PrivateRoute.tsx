import { useAuth } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles: ('trainer' | 'student')[];
}

//compont ente que protege rutas privadas, solo permite el acceso a usuarios autenticados con roles permitidos
export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}