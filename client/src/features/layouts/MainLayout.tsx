import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

//layout principal de la app, contiene el header y el outlet para renderizar las rutas hijas
export default function MainLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();


    //redirijo a login si no hay usuario logueado
    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">My App</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
                {/* Renderiza las rutas hijas sin recargar la pgina */}
                <Outlet />
            </main>
        </div>
    );
}
