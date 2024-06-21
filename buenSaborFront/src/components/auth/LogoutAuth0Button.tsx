import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LogoutAuth0Button = () => {
    const { logout } = useAuth0();
    const { setAuth } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            setAuth({ usuario: null });  // Restablecer el estado de autenticación
            // localStorage.removeItem('usuario');
            localStorage.clear();

            logout({ logoutParams: { returnTo: window.location.origin } })

            //await logout();
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    };


    return (
        <button className="btn btn-secondary" onClick={handleLogout}>
            Cerrar sesión
        </button>
    );
};

export default LogoutAuth0Button;