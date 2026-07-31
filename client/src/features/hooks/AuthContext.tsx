import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'trainer' | 'student';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


//componente para envolver la app y proveer el contexto de auth
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    //se monta el comp y dice quien soy en la funcion authcontroller > getUser > auth/me y trae el rol tambien
    useEffect(() => {
        api.get('/auth/me')
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    function login() {
        // redirige a google oauth en el backend
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }

    function logout() {
        api.post('/auth/logout')
            .then(() => setUser(null));
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}


//compartir el contexto de auth
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}