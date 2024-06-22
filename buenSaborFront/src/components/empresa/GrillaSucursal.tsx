import { useEffect, useState } from "react";
import Sucursal from "../../models/Sucursal";
import { deleteSucursalPorId, getSucursales } from "../../services/SucursalApi";
import { Button, FormControl, Table } from "react-bootstrap";
import { ModalSucursal } from "./ModalSucursal";
import { ModalCategorias } from "./ModalCategorias";
import { ModalAgregarPromociones } from "./ModalAgregarPromociones";

export function GrillaSucursal() {

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal>(new Sucursal());
    const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<number>(0);
    const [onlyShowCategorias, setOnlyShowCategorias] = useState(false);
    const [onlyShowPromociones, setOnlyShowPromociones] = useState(false);

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [filtro, setFiltro] = useState('');

    const [showModalCategorias, setShowModalCategorias] = useState(false);
    const [showModalAgregarPromociones, setShowModalAgregarPromociones] = useState(false);

    const getListadoSucursales = async () => {
        const datos: Sucursal[] = await getSucursales();
        setSucursales(datos);
    };

    const handleOpenCreate = () => {
        setShowModal(true);
        setEditing(false);
        setSelectedId(null);
    };

    const handleOpenEdit = () => {
        setShowModal(true);
        setEditing(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditing(false);
        setSelectedId(null);
        setShowModalCategorias(false);
        setShowModalAgregarPromociones(false);
    };

    const handleShowCategorias = () => {
        setShowModalCategorias(true);
    };

    const handleShowPromociones = () => {
        setShowModalAgregarPromociones(true);
    };

    const deleteSucursal = async (idSucursal: number) => {
        await deleteSucursalPorId(idSucursal);
        getListadoSucursales()
    };

    useEffect(() => {
        getListadoSucursales();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const filteredSucursales = sucursales.filter(sucursal =>
        sucursal.id.toString().includes(filtro) ||
        sucursal.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Sucursales</h1>
                <ModalSucursal
                    handleCloseSucursal={handleClose}
                    showModal={showModal}
                    editing={editing}
                    selectedIdEmpresa={selectedIdEmpresa}
                    selectedId={selectedId}
                    getListadoSucursales={getListadoSucursales}
                />
                <ModalCategorias
                    onlyShowCategorias={onlyShowCategorias}
                    selectedSucursal={selectedSucursal}
                    showModalCategorias={showModalCategorias}
                    handleClose={handleClose}
                />
                <ModalAgregarPromociones
                    onlyShowPromociones={onlyShowPromociones}
                    selectedSucursal={selectedSucursal}
                    showModalAgregarPromociones={showModalAgregarPromociones}
                    handleClose={handleClose}
                />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControl
                        placeholder="Filtrar por ID o Denominacion"
                        value={filtro}
                        onChange={handleFilterChange}
                        style={{ margin: 20, width: '300px', height: '50px' }}
                    />
                    <Button size="lg" style={{ margin: 20, backgroundColor: '#EE7F46', border: '#EE7F46' }} onClick={handleOpenCreate}>
                        Crear Sucursal
                    </Button>
                </div>

                <Table striped bordered hover size="xl" responsive>
                    <thead>
                        <tr>
                            <th style={{ width: "300px" }}>Nombre</th>
                            <th style={{ width: "200px" }}>Horario</th>
                            <th style={{ width: "150px" }}>Casa Matriz</th>
                            <th style={{ width: "250px" }}>Ubicacion</th>
                            <th style={{ width: "200px" }}>Categoria</th>
                            <th style={{ width: "200px" }}>Promociones</th>
                            <th style={{ width: "300px" }}>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSucursales.map((sucursal: Sucursal, index) =>
                            <tr key={index}>
                                <td>{sucursal.nombre}</td>
                                <td>{sucursal.horarioApertura} - {sucursal.horarioCierre}</td>
                                <td>{sucursal.casaMatriz ? "Si" : "No"}</td>
                                <td>{sucursal.domicilio.localidad.nombre} - {sucursal.domicilio.localidad.provincia.nombre}</td>
                                <td>
                                    <Button variant="outline-success" style={{ maxHeight: "40px", marginRight: '10px' }}
                                        onClick={() => { setSelectedSucursal(sucursal); handleShowCategorias(); setOnlyShowCategorias(false) }}>Agregar</Button>
                                    <Button variant="outline-info" style={{ maxHeight: "40px" }}
                                        onClick={() => { setSelectedSucursal(sucursal); handleShowCategorias(); setOnlyShowCategorias(true) }}>Ver</Button>
                                </td>
                                <td>
                                    <Button variant="outline-primary" style={{ maxHeight: "40px", marginRight: '10px' }}
                                        onClick={() => { setSelectedSucursal(sucursal); handleShowPromociones(); setOnlyShowPromociones(false) }}>Agregar</Button>
                                    <Button variant="outline-info" style={{ maxHeight: "40px" }}
                                        onClick={() => { setSelectedSucursal(sucursal); handleShowPromociones(); setOnlyShowPromociones(true) }}>Ver</Button>
                                </td>
                                <td>
                                    <Button variant="outline-warning" style={{ maxHeight: "40px", marginRight: '10px' }}
                                        onClick={() => { setSelectedId(sucursal.id); setSelectedIdEmpresa(1); handleOpenEdit(); }}>Modificar</Button>
                                    <Button variant="outline-danger" style={{ maxHeight: "40px" }} onClick={() => deleteSucursal(sucursal.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
}