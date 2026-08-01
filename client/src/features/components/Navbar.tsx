import { useAuth } from '../hooks/AuthContext';

export function Navbar() {
    const { user, login, logout } = useAuth();

    return (
        <nav>
            <span>Kauan Freitas</span>
            {user ? (
                <button onClick={logout}>Sair</button>
            ) : (
                <button onClick={login}>Entrar</button>
            )}
        </nav>
    );
}