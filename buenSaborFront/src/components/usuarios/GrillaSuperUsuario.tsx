import { useEffect, useState } from "react";
import { FormControl, Table } from "react-bootstrap";
import { UsuarioCliente } from "../../models/Usuario";
import { getUsuariosCliente, saveUsuarioCliente } from "../../services/UsuarioClienteAPI";
import { RolName } from "../../models/RolName";
import Rol from "../../models/Rol";
import { getRoles } from "../../services/RolesApi";

export function GrillaSuperUsuario() {

    const [usuarios, setUsuarios] = useState<UsuarioCliente[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [filtro, setFiltro] = useState('');

    const getListaDeUsuarios = async () => {
        const datos: UsuarioCliente[] = await getUsuariosCliente();
        setUsuarios(datos);
    };

    const handleRolChange = async (usuario: UsuarioCliente, nuevoRolName: RolName) => {
        // Buscar el rol con el nombre seleccionado
        const nuevoRol = roles.find(rol => rol.rolName === nuevoRolName);

        if (!nuevoRol) {
            console.error(`No se encontró el rol con el nombre ${nuevoRolName}`);
            return;
        }

        // Actualizar el rol del usuario
        usuario.rol = nuevoRol;

        // Guardar el cambio
        await saveUsuarioCliente(usuario);

        // Actualizar la lista de usuarios
        getListaDeUsuarios();
    };

    useEffect(() => {
        getRoles().then(setRoles);
        getListaDeUsuarios();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const filteredUsuarios = usuarios.filter(empleado =>
        empleado.cliente.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        empleado.cliente.apellido?.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Modificar Roles de los Usuarios</h1>

                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControl
                        placeholder="Filtrar por Nombre o Apellido"
                        value={filtro}
                        onChange={handleFilterChange}
                        style={{ margin: 20, width: '300px', height: '50px' }}
                    />
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cambiar Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map((usuario: UsuarioCliente) =>
                            <tr key={usuario.id}>
                                <td>{usuario.cliente?.nombre}</td>
                                <td>{usuario.cliente?.apellido}</td>
                                <td>
                                    <select value={usuario.rol.rolName} onChange={(e) => handleRolChange(usuario, e.target.value as RolName)}>
                                        {Object.values(RolName).map(rol =>
                                            <option key={rol} value={rol}>{rol}</option>
                                        )}
                                    </select>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    )
}