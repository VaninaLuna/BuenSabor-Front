import { useEffect, useState } from 'react';
import { Button, Table, FormControl } from 'react-bootstrap';


import Empresa from '../../models/Empresa';
import { deleteEmpresaPorID, getEmpresas } from '../../services/EmpresaApi';
import { ModalEmpresa } from './ModalEmpresa';
import { ModalSucursal } from './ModalSucursal';
import { ModalSucursales } from './ModalSucursales';


export function GrillaEmpresa() {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);

    const [showModalSucursal, setShowModalSucursal] = useState(false);
    const [editingSucursal, setEditingSucursal] = useState(false);
    const [showModalSucursales, setShowModalSucursales] = useState(false);

    const [empresa, setEmpresa] = useState<Empresa[]>([]);
    const [filtro, setFiltro] = useState('');

    const getListadoEmpresas = async () => {
        const datos: Empresa[] = await getEmpresas();
        setEmpresa(datos);
    };

    const handleOpenCreate = () => {
        setShowModal(true);
        setEditing(false);
        setSelectedId(0);
    };

    const handleOpenEdit = () => {
        setShowModal(true);
        setEditing(true);
    };

    const handleCloseSucursal = () => {
        setShowModalSucursal(false);
        setEditingSucursal(false);
        setSelectedId(0);
    };
    const handleOpenCreateSucursal = () => {
        setShowModalSucursal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditing(false);
        setSelectedId(0);
    };

    const handleCloseSucursales = () => {
        setShowModalSucursales(false);
        setSelectedId(0);
    };

    const deleteEmpresa = async (idEmpresa: number) => {
        await deleteEmpresaPorID(idEmpresa);
        getListadoEmpresas();
    };

    const handleShowSucursales = () => {
        setShowModalSucursales(true);
    };

    useEffect(() => {
        getListadoEmpresas();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const filteredEmpresas = empresa.filter(empresaF =>
        empresaF.id.toString().includes(filtro) ||
        empresaF.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Empresas</h1>
                <ModalEmpresa
                    handleClose={handleClose}
                    showModal={showModal}
                    editing={editing}
                    selectedId={selectedId}
                    getListadoEmpresas={getListadoEmpresas}
                />
                <ModalSucursal
                    handleCloseSucursal={handleCloseSucursal}
                    showModal={showModalSucursal}
                    editing={editingSucursal}
                    selectedIdEmpresa={selectedId}
                />
                <ModalSucursales
                    empresaId={selectedId}
                    handleCloseSucursales={handleCloseSucursales}
                    showModalSucursales={showModalSucursales}
                />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControl
                        placeholder="Filtrar por ID o Nombre"
                        value={filtro}
                        onChange={handleFilterChange}
                        style={{ margin: 20, width: '300px', height: '50px' }}
                    />
                    <Button size="lg" style={{ margin: 20, backgroundColor: '#EE7F46', border: '#EE7F46' }} onClick={handleOpenCreate}>
                        Crear Empresa
                    </Button>
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th style={{ maxWidth: "80px" }}>ID</th>
                            <th style={{ minWidth: "150px" }}>nombre</th>
                            <th>Razon Social</th>
                            <th>Cuil</th>
                            <th style={{ width: "200px" }}>Sucursales</th>
                            <th style={{ width: "300px" }}>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmpresas.map((empresa: Empresa, index) =>
                            <tr key={index}>
                                <td>{empresa.id}</td>
                                <td>{empresa.nombre}</td>
                                <td>{empresa.razonSocial}</td>
                                <td>{empresa.cuil}</td>
                                <td>
                                    <Button variant="outline-success" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => { setSelectedId(empresa.id); handleOpenCreateSucursal() }}>Agregar</Button>
                                    <Button variant="outline-info" style={{ maxHeight: "40px" }} onClick={() => { setSelectedId(empresa.id); handleShowSucursales(); }}>Ver</Button>
                                </td>
                                <td>
                                    <Button variant="outline-warning" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => { setSelectedId(empresa.id); handleOpenEdit(); }}>Modificar</Button>
                                    <Button variant="outline-danger" style={{ maxHeight: "40px" }} onClick={() => deleteEmpresa(empresa.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
}
