import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioLogin } from "../../models/Usuario";
// import { AuthContext, AuthContextType } from "../context/AuthContext";
import { login } from "../../services/AuthApi";
import { LoginAuth0Button } from "./LoginAuth0Button";

export default function Login() {

    const navigate = useNavigate();
    const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(new UsuarioLogin());
    const [message, setMessage] = useState<string>("");
    //const { setAuth }: AuthContextType = useContext(AuthContext);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setUsuarioLogin(usuarioLogin)
        try {
            if (validateForm()) {
                const response = await login(usuarioLogin);

                if (!response) {
                    setMessage("Error al iniciar sesión");
                } else {
                    console.log(response);
                    //setAuth({ usuario: response });
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error(error);
            setMessage('Error al iniciar sesión');
        }
    };

    const validateForm = () => {
        if (usuarioLogin?.nombreUsuario === undefined || usuarioLogin.nombreUsuario === "") {
            setMessage("Debe ingresar el nombre de Usuario");
            return false;
        }
        if (usuarioLogin?.password === undefined || usuarioLogin.password === "") {
            setMessage("Debe ingresar la contraseña");
            return false;
        }
        return true;
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <h2 style={{ alignSelf: "center" }}>Iniciar Sesion</h2>
            </div>
            <div className="d-flex flex-column w-50  m-auto"
                style={{ minHeight: '80vh' }}>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="txtNombreUsuario" className="form-label">Nombre de Usuario</label>
                        <input type="text" id='txtNombreUsuario' className="form-control" placeholder="Ingrese el nombre de usuario"
                            defaultValue={usuarioLogin.nombreUsuario} onChange={e => usuarioLogin.nombreUsuario = String(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="txtContraseña" className="form-label">Contraseña</label>
                        <input type="password" name="password" id='txtContraseña' className="form-control" placeholder="Ingrese la Contraseña"
                            defaultValue={usuarioLogin.password} onChange={e => usuarioLogin.password = String(e.target.value)} />
                    </div>

                    <div>
                        {message && <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{message}</p>}
                    </div>

                    <div className="col mb-4">
                        <button type="submit" className="btn btn-success" style={{ fontWeight: 'initial', color: 'whitesmoke' }}>Iniciar Sesión</button>
                    </div>
                </form>


                <div>
                    <h3>
                        Iniciar sesion con AuthO
                    </h3>
                    <LoginAuth0Button />
                </div>
            </div>
        </>

    );
}