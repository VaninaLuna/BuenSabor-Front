import { useEffect, useState } from "react";
import { FormControl, Table } from "react-bootstrap";
import { UsuarioCliente } from "../../models/Usuario";
import { getClientes } from "../../services/UsuarioClienteAPI";

export function GrillaCliente() {

    const [clientes, setClientes] = useState<UsuarioCliente[]>([]);
    const [filtro, setFiltro] = useState('');

    const getListaDeClientes = async () => {
        const datos: UsuarioCliente[] = await getClientes();
        setClientes(datos);
    };

    useEffect(() => {
        getListaDeClientes();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.cliente.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        cliente.cliente.apellido?.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Clientes</h1>

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
                            <th>Fecha Nacimiento</th>
                            <th>Email</th>
                            <th>Telefono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.map((usuario: UsuarioCliente) =>
                            <tr key={usuario.id}>
                                <td>{usuario.cliente?.nombre}</td>
                                <td>{usuario.cliente?.apellido}</td>
                                <td>{usuario.cliente?.fechaNacimiento}</td>
                                <td>{usuario.cliente?.email}</td>
                                <td>{usuario.cliente?.telefono}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    )
}