import {
    CCollapse,
    CContainer,
    CImage,
    CNavbar,
    CNavbarBrand,
    CNavbarToggler,
} from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import title from "../../assets/images/logo.png";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutAuth0Button from "../auth/LogoutAuth0Button";
import { LoginAuth0Button } from "../auth/LoginAuth0Button";
import { UsuarioLogin, UsaurioRegistro } from "../../models/Usuario";
import { register } from "../../services/AuthApi";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import { ClienteRegistro } from "../../models/Cliente";
import Rol from "../../models/Rol";
import { Link } from 'react-router-dom';

function NavBar() {
    const [visible, setVisible] = useState(false);
    const { user, isAuthenticated, logout } = useAuth0();
    const { auth, setAuth }: AuthContextType = useContext(AuthContext);


    const handleLogin = async () => {
        if (isAuthenticated && user) {
            const usuarioLogin = new UsuarioLogin();
            usuarioLogin.nombreUsuario = user.nickname;

            console.log(user);

            const cliente = new ClienteRegistro();
            cliente.nombre = user.given_name;
            cliente.apellido = user.family_name;
            cliente.email = user.email;

            const usuario: UsaurioRegistro = {
                nombreUsuario: user.nickname,
                rol: new Rol(),
                cliente: cliente,
            };

            console.log(usuario);
            const usuarioRegistrado = await register(usuario);
            if (usuarioRegistrado && usuarioRegistrado.id) {
                setAuth({ usuario: usuarioRegistrado });
            } else {
                localStorage.removeItem('usuario');
                logout({ logoutParams: { returnTo: window.location.origin } });
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated && !auth.usuario) {
            handleLogin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (auth.usuario) {
            localStorage.setItem('usuario', JSON.stringify(auth.usuario));
        } else {
            localStorage.removeItem('usuario');
        }
    }, [auth.usuario]);

    return (
        <CNavbar expand="lg" style={{ backgroundColor: 'rgb(224, 224, 224)', height: '80px' }}>
            <CContainer fluid style={{ margin: 30 }}>
                <CNavbarBrand className="navbar-center" href="/">
                    <CImage rounded src={title} width={250} height={80} />
                </CNavbarBrand>
                <CNavbarToggler
                    aria-label="Toggle navigation"
                    aria-expanded={visible}
                    onClick={() => setVisible(!visible)}
                />
                <CCollapse className="navbar-collapse" visible={visible}>
                </CCollapse>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {(!user || !isAuthenticated) ? (
                        <li className="nav-item">
                            <LoginAuth0Button />
                        </li>
                    ) : (
                        <>
                            <li style={{ paddingRight: "10px", paddingTop: "8px" }}>
                                <p>Usuario: {user.nickname}</p>
                            </li>
                            <li className="nav-item" style={{ paddingRight: "10px" }}>
                                <Link to="/profile" className="nav-link btn btn-secondary" style={{ fontWeight: 'bold' }}>
                                    Perfil
                                </Link>
                            </li>
                            <li className="nav-item">
                                <LogoutAuth0Button />
                            </li>
                        </>
                    )}
                </ul>
            </CContainer>
        </CNavbar>
    );
}

export default NavBar;
