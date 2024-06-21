import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setAuth({ usuario: null });  // Restablecer el estado de autenticación
            // localStorage.removeItem('usuario');
            localStorage.clear();

            //await logout();
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }

        navigate('/');
    };

    return <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>;
};

export default Logout;
