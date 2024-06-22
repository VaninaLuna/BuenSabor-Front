import { useEffect, useState } from "react";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import { getManufacturadoByEstaEliminado, updateEstadoEliminadoManufacturado } from "../../services/ArticuloManufacturadoApi";
import { Button, Table, Form, Modal, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ModalArticuloManufacturado } from "./ModalArticuloManufacturado";
import { UsuarioCliente } from "../../models/Usuario";
import { RolName } from "../../models/RolName";
import { ConfirmModal } from "./ConfirmModal";

export function GrillaArticuloManufacturado() {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [articulosmanufacturados, setArticulosmanufacturados] = useState<ArticuloManufacturado[]>([]);
    const [filteredArticulos, setFilteredArticulos] = useState<ArticuloManufacturado[]>([]);
    const [filter, setFilter] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedArticulo, setSelectedArticulo] = useState<ArticuloManufacturado | null>(null);
    const [showPreparationModal, setShowPreparationModal] = useState(false);
    const [preparationText, setPreparationText] = useState("");

    //estado para alternar entre obtener datos con eliminacion logica o no
    const [eliminados, setEliminados] = useState<boolean>(false);

    //Modal Confirmar eliminacion
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;

    const getListadoArticulosManufacturados = async () => {
        const datos: ArticuloManufacturado[] = await getManufacturadoByEstaEliminado(eliminados);
        setArticulosmanufacturados(datos);
        setFilteredArticulos(datos);
    };

    const handleOpenCreate = () => {
        setShowModal(true);
        setEditing(false);
    };

    const handleOpenEdit = () => {
        setShowModal(true);
        setEditing(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditing(false);
        setSelectedId(null);
        setSelectedArticulo(null);
    };

    const handleConfirmClose = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        handleConfirmClose();
    };

    const confirmUpdateEstadoDelete = (idUMedida: number, actionType: 'eliminar' | 'restaurar') => {
        setConfirmAction(() => () => updateEstadoDelete(idUMedida));
        setConfirmMessage(`¿Está seguro que desea ${actionType} ?`);
        setShowConfirmModal(true);
    };

    const updateEstadoDelete = async (id: number) => {
        await updateEstadoEliminadoManufacturado(id);
        getListadoArticulosManufacturados();
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);

        const filtered = articulosmanufacturados.filter(articulo =>
            articulo.id.toString().includes(value) || articulo.denominacion.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredArticulos(filtered);
    };

    const handleShowDetails = (articulo: ArticuloManufacturado) => {
        setSelectedArticulo(articulo);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedArticulo(null);
    };

    const handleShowPreparation = (preparation: string) => {
        setPreparationText(preparation);
        setShowPreparationModal(true);
    };

    const handleClosePreparationModal = () => {
        setShowPreparationModal(false);
        setPreparationText("");
    };

    useEffect(() => {
        getListadoArticulosManufacturados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eliminados]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>{eliminados ? "Articulos Manufacturados Eliminados" : "Articulos Manufacturados"}</h1>

                <ModalArticuloManufacturado
                    handleClose={handleClose}
                    showModal={showModal}
                    editing={editing}
                    selectedId={selectedId}
                    getListadoArticulosManufacturados={getListadoArticulosManufacturados}
                />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Control
                        type="text"
                        placeholder="Filtrar por ID o Denominación"
                        value={filter}
                        onChange={handleFilterChange}
                        style={{ margin: 20, width: '300px', height: '50px' }}
                    />
                    {
                        (usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName == RolName.ADMIN) &&
                        <Button size="lg" style={{ margin: 20, backgroundColor: '#EE7F46', border: '#EE7F46' }} onClick={handleOpenCreate}>
                            Crear Articulo Manufacturado
                        </Button>
                    }
                </div>


                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th style={{ minWidth: "150px" }}>Denominacion</th>
                            <th>Unidad de Medida</th>
                            <th>Categoria</th>
                            <th style={{ minWidth: "150px" }}>Descripcion</th>
                            <th>Precio Venta</th>
                            <th>Tiempo Estimado Minutos</th>
                            <th style={{ minWidth: "150px" }}>Preparacion</th>
                            <th style={{ minWidth: "300px" }}>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticulos.map((articulomanufacturado: ArticuloManufacturado, index) =>
                            <tr key={index}>
                                <td>{articulomanufacturado.imagenes && articulomanufacturado.imagenes[0] ?
                                    <Image src={articulomanufacturado.imagenes[0].url}
                                        alt={articulomanufacturado.denominacion} style={{ height: "50px", width: "50px", objectFit: 'cover' }} rounded />
                                    : 'No image'
                                }</td>
                                <td>{articulomanufacturado.denominacion}</td>
                                <td>{articulomanufacturado.unidadMedida.denominacion}</td>
                                <td>{articulomanufacturado.categoria.codigo} {articulomanufacturado.categoria.denominacion}</td>
                                <td>{articulomanufacturado.descripcion}</td>
                                <td>{articulomanufacturado.precioVenta}</td>
                                <td>{articulomanufacturado.tiempoEstimadoMinutos}</td>
                                <td style={{ minWidth: "400px" }}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>{articulomanufacturado.preparacion}</Tooltip>}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>
                                                {articulomanufacturado.preparacion.length > 40 ?
                                                    articulomanufacturado.preparacion.substring(0, 40) + "..." :
                                                    articulomanufacturado.preparacion
                                                }
                                            </span>
                                            <Button variant="secondary" className="ml-auto" onClick={() => handleShowPreparation(articulomanufacturado.preparacion)}>+</Button>
                                        </div>
                                    </OverlayTrigger>
                                </td>
                                <td>
                                    {
                                        (usuarioLogueado && usuarioLogueado.rol && (usuarioLogueado.rol.rolName == RolName.ADMIN
                                            || usuarioLogueado.rol.rolName == RolName.COCINERO
                                            || usuarioLogueado.rol.rolName == RolName.DELIVERY)) &&
                                        <>
                                            <Button variant="outline-warning" style={{ maxHeight: "40px", marginRight: '10px' }}
                                                onClick={() => { setSelectedId(articulomanufacturado.id); handleOpenEdit(); }}>Modificar</Button>
                                            {usuarioLogueado.rol.rolName == RolName.ADMIN && (
                                                eliminados
                                                    ?
                                                    <Button variant="outline-info" style={{ maxHeight: "40px", marginRight: '10px' }}
                                                        onClick={() => confirmUpdateEstadoDelete(articulomanufacturado.id, 'restaurar')}>Restaurar</Button>
                                                    :
                                                    <Button variant="outline-danger" style={{ maxHeight: "40px", marginRight: '10px' }}
                                                        onClick={() => confirmUpdateEstadoDelete(articulomanufacturado.id, 'eliminar')}>Eliminar</Button>
                                            )
                                            }
                                        </>
                                    }
                                    <Button variant="outline-success" style={{ maxHeight: "40px" }} onClick={() => handleShowDetails(articulomanufacturado)}>Detalle</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <div style={{ width: '100%', display: "flex", justifyContent: 'flex-end' }}>
                    <Button size="lg" style={{ margin: 10, backgroundColor: '#478372', border: '#478372' }} onClick={() => { setEliminados(!eliminados) }}>
                        {eliminados ? "Ver Actuales" : "Ver Eliminados"}
                    </Button>
                </div>


                <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedArticulo?.denominacion}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-center">{<h5><span style={{ fontWeight: 'bold' }}>--INGREDIENTES-- </span> </h5>}</p>
                        {selectedArticulo && selectedArticulo.articuloManufacturadoDetalles.map((detalle, index) => (

                            <p key={index}>
                                <span style={{ fontWeight: 'bold' }}>Insumo:</span> {detalle.articuloInsumo.denominacion} <br />
                                <span style={{ fontWeight: 'bold' }}>Cantidad:</span> {detalle.cantidad} {detalle.articuloInsumo.unidadMedida.denominacion}
                            </p>

                        ))}
                        <p className="text-center">{<h5><span style={{ fontWeight: 'bold' }}>--RECETA--</span></h5>}</p>
                        <p>{<span style={{ fontWeight: 'bold' }}>Preparacion:</span>} {selectedArticulo?.preparacion}</p>
                        <p className="text-center">{<h5><span style={{ fontWeight: 'bold' }}>--TIEMPO DE PREPARACION--</span></h5>}</p>
                        <p>{<span style={{ fontWeight: 'bold' }}>Tiempo:</span>} {selectedArticulo?.tiempoEstimadoMinutos} minutos</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDetailModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showPreparationModal} onHide={handleClosePreparationModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Preparación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {preparationText}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePreparationModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <ConfirmModal
                show={showConfirmModal}
                handleClose={handleConfirmClose}
                handleConfirm={handleConfirm}
                message={confirmMessage}
            />
        </>
    );
}
