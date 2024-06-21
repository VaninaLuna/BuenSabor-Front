import { useContext } from "react";
import { RolName } from "../../models/RolName";
import { UsuarioCliente } from "../../models/Usuario";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
    roles: RolName[];
}

function RolUsuario({ roles }: Props) {
    const { auth } = useContext(AuthContext); // Obtiene el estado de autenticación del contexto


    if (auth.usuario) { // Verifica si hay un token de autenticación
        const usuarioLogueado: UsuarioCliente | null = auth.usuario; // Obtiene el usuario logueado del estado de autenticación
        if (usuarioLogueado && roles.includes(usuarioLogueado.rol.rolName)) { // Verifica si el rol del usuario coincide con el rol esperado
            return <Outlet />; // Si coincide, permite el acceso al contenido protegido
        }
    }

    return <Navigate to='/home' replace />; // Si no hay token de autenticación, redirige al login
}
export default RolUsuario;