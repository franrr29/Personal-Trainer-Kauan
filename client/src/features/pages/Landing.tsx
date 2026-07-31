import { useAuth } from '../hooks/AuthContext';




//pagina principal de la app
export default function Landing() {

    const { login } = useAuth();

  return (
    <button onClick={login}>Login with Google</button>
  )
}