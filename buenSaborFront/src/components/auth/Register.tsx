import { useState } from "react";
import Usuario from "../../models/Usuario";
import { useRoles } from "../../hooks/UseRoles";
import { useNavigate } from "react-router-dom";
// import { register } from "../../services/AuthApi";
import { CFormSelect } from "@coreui/react";
import Rol from "../../models/Rol";

const Register: React.FC = () => {
    const [usuario, setUsuario] = useState<Usuario>(new Usuario());
    const [message, setMessage] = useState<string>('');
    const { roles } = useRoles();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (validateForm()) {
                // const response = await register(usuario);
                // if (!response.ok) setMessage("error al guardar el usuario");
                // else 
                navigate('/home');
            }
        } catch (error) {
            console.log(error);
            setMessage('Error al registrar el usuario');
        }
    };

    const validateForm = () => {
        if (usuario?.nombreUsuario === undefined || usuario.nombreUsuario === "") {
            setMessage("Debe ingresar el nombre de Usuario");
            return false;
        }
        // if (usuario?.password === undefined || usuario.password === "") {
        //     setMessage("Debe ingresar la contraseña");
        //     return false;
        // }
        if (usuario?.rol?.rolName === undefined || usuario.rol.rolName === null) {
            setMessage("Debe seleccionar un rol");
            return false;
        }
        return true;
    }

    const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>, roles: Rol[]) => {
        const selectedId = Number(e.target.value);

        const selectedRol = roles.find(rol => rol.id === selectedId);
        if (selectedRol && usuario) {
            setUsuario({ ...usuario, rol: selectedRol });
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <h2 style={{ alignSelf: "center" }}>Registrarse</h2>
            </div>
            <div className="d-flex flex-column w-50  m-auto"
                style={{ minHeight: '80vh' }}>

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="txtNombreUsuario" className="form-label">Nombre de Usuario</label>
                        <input type="text" id='txtNombreUsuario' className="form-control" placeholder="Ingrese el nombre de usuario"
                            defaultValue={usuario.nombreUsuario} onChange={e => usuario.nombreUsuario = String(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="txtContraseña" className="form-label">Contraseña</label>
                        {/* <input type="password" name="password" id='txtContraseña' className="form-control" placeholder="Ingrese la Contraseña"
                            defaultValue={usuario.password} onChange={e => usuario.password = String(e.target.value)} /> */}
                    </div>

                    <div className="d-flex flex-column mb-3">
                        <label htmlFor="selectRol" className="form-label mr-4">Rol</label>

                        <CFormSelect id="selectRol" name="select" value={usuario.rol?.id || 0} onChange={(e) => handleRolChange(e, roles)}>
                            <option value={0} disabled> Seleccionar un rol</option>

                            {roles.map((rol: Rol) =>
                                <option key={rol.id} value={rol.id}> {rol.rolName} </option>
                            )}
                        </CFormSelect>
                    </div>

                    <div>
                        {message && <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{message}</p>}
                    </div>

                    <div className="col mb-4">
                        <button type="submit" className="btn btn-success" style={{ fontWeight: 'initial', color: 'whitesmoke' }}>Registrarse</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
