import { useEffect, useState } from "react";
import { PedidoCliente } from "../../models/Pedido";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { cancelarPedido, getPedidos, getPedidosByCliente, getPedidosByCocinero, getPedidosByEstado, getPedidosCancelados, updateEstadoPedido } from "../../services/PedidoApi";
import { UsuarioCliente } from "../../models/Usuario";
import { RolName } from "../../models/RolName";
import { ConfirmModal } from "./ConfirmModal";

export function GrillaPedido() {

    const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
    //Modal detalles
    const [showModalDetalles, setShowModalDetalles] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<PedidoCliente | null>(null);
    //Estados del envio
    const [estadosEnvio] = useState<string[]>(["Recibido", "Aprobado", "En Preparacion", "Listo", "En camino", "Entregado", "Cancelado"])

    //estado para alternar entre obtener datos con eliminacion logica o no
    const [eliminados, setEliminados] = useState<boolean>(false);
    const [listos, setListos] = useState<boolean>(false);


    //Modal Confirmar eliminacion
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;

    const getListaPedidos = async () => {
        let datos: PedidoCliente[] = []
        if (usuarioLogueado && usuarioLogueado.rol.rolName == RolName.CLIENTE) {
            datos = await getPedidosByCliente(usuarioLogueado.cliente.id)
        } else if (usuarioLogueado && (usuarioLogueado.rol.rolName == RolName.COCINERO || usuarioLogueado.rol.rolName == RolName.DELIVERY)) {
            datos = await getPedidosByCocinero()
        } else if (eliminados) {
            datos = await getPedidosCancelados();
        } else if (listos) {
            datos = await getPedidosByEstado("Listo");
        } else {
            datos = await getPedidos();
        }
        setPedidos(datos);
    };

    const handleShowDetalles = (pedido: PedidoCliente) => {
        setSelectedPedido(pedido)
        setShowModalDetalles(true);

    }

    const handleCloseDetalles = () => {
        setShowModalDetalles(false);
        setSelectedPedido(null);
    };

    const handleEstadoChange = async (pedido: PedidoCliente, e: string) => {
        // Guardar el cambio
        await updateEstadoPedido(pedido.id, e);

        // Actualizar la lista
        getListaPedidos();
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

    const confirmUpdateEstadoDelete = (idUMedida: number) => {
        setConfirmAction(() => () => updateEstadoDelete(idUMedida));
        setConfirmMessage(`¿Está seguro que desea cancelar el pedido?`);
        setShowConfirmModal(true);
    };

    const updateEstadoDelete = async (id: number) => {

        console.log(id)

        await cancelarPedido(id);
        getListaPedidos();
    }

    useEffect(() => {
        getListaPedidos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eliminados, listos]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>{listos ? "Pedidos Listos" : eliminados ? "Pedidos Cancelados" : "Pedidos"}</h1>

                <div style={{ width: '100%', display: "flex", justifyContent: 'flex-end' }}>
                    <Button size="lg" style={{ margin: 10, backgroundColor: '#EE7F46', border: '#EE7F46' }} onClick={() => { setListos(!listos), setEliminados(false) }}>
                        {listos ? "Ver Todos" : "Ver Listos"}
                    </Button>
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Nro Pedido</th>
                            <th>Fecha pedido</th>
                            <th>Hora estimada de finalizacion</th>
                            <th>Total</th>
                            {/* <th>Total costo</th> */}
                            <th>Estado</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido: PedidoCliente) =>
                            <tr key={pedido.id}>
                                <td>{String(pedido.id).padStart(5, '0')}</td>
                                <td>{pedido.fechaPedido}</td>
                                <td>{pedido.horaEstimadaFinalizacion}</td>
                                <td>{pedido.total}</td>
                                {/* <td>{pedido.totalCosto}</td> */}
                                <td>
                                    <select value={pedido.estado} onChange={(e) => handleEstadoChange(pedido, e.target.value)} disabled={eliminados || pedido.estado == "Cancelado"}>
                                        {estadosEnvio.map((estado, index) =>
                                            <option key={index} value={estado}>{estado}</option>
                                        )}
                                    </select>

                                </td>

                                <td>
                                    <Button variant="outline-success" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => handleShowDetalles(pedido)}>Detalle</Button>
                                    {
                                        (usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName == RolName.ADMIN) &&
                                        <>
                                            {
                                                !eliminados && pedido.estado !== "Cancelado" &&
                                                <Button variant="outline-danger" style={{ maxHeight: "40px" }}
                                                    onClick={() => confirmUpdateEstadoDelete(pedido.id)}>Cancelar</Button>
                                            }
                                        </>
                                    }
                                </td>

                            </tr>
                        )}
                    </tbody>
                </Table>
                <div style={{ width: '100%', display: "flex", justifyContent: 'flex-end' }}>
                    <Button size="lg" style={{ margin: 10, backgroundColor: '#478372', border: '#478372' }} onClick={() => { setEliminados(!eliminados), setListos(false) }}>
                        {eliminados ? "Ver Todos" : "Ver Cancelados"}
                    </Button>
                </div>

                <ConfirmModal
                    show={showConfirmModal}
                    handleClose={handleConfirmClose}
                    handleConfirm={handleConfirm}
                    message={confirmMessage}
                />


                {
                    <Modal show={showModalDetalles} onHide={handleCloseDetalles}>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles del pedido</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            {selectedPedido &&
                                <>
                                    <h5>Informacion del Cliente</h5>
                                    <Row>
                                        <Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Nombre: </span> {selectedPedido.cliente.nombre}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Apellido: </span> {selectedPedido.cliente.apellido}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Email: </span> {selectedPedido.cliente.email}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Telefono: </span> {selectedPedido.cliente.telefono}</Col>
                                        </Col>
                                        <Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Localidad: </span> {selectedPedido.cliente.domicilio.localidad.nombre}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Calle: </span> {selectedPedido.cliente.domicilio.calle}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Numero: </span> {selectedPedido.cliente.domicilio.numero}</Col>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Col>
                                        <Col>{<span style={{ fontWeight: 'bold' }}>Fecha: </span>}{selectedPedido.fechaPedido}</Col>
                                        <Col>{<span style={{ fontWeight: 'bold' }}>Hora del pedido: </span>}{selectedPedido.horaEstimadaFinalizacion}</Col>
                                        <br />
                                        <Col><p>{<span style={{ fontWeight: 'bold' }}>Detalle del pedido </span>}</p></Col>
                                    </Col>

                                    <Row >
                                        {selectedPedido && selectedPedido.pedidoDetalles.map((detalle) => (
                                            <Col key={detalle.id}>
                                                <Col>{detalle.articulo.denominacion}</Col>
                                                <Col> <img style={{ maxWidth: "80px", height: "80px", objectFit: "contain" }}
                                                    className="cart-img"
                                                    src={`${detalle.articulo.imagenes[0].url}`}
                                                    alt={detalle.articulo.denominacion}
                                                /></Col>
                                                <Col>{<span style={{ fontWeight: 'bold' }}>Cantidad: </span>}{detalle.cantidad}</Col>
                                                <Col>{<span style={{ fontWeight: 'bold' }}>Subtotal: </span>} ${detalle.subTotal}</Col>
                                            </Col>
                                        ))}
                                    </Row>
                                    <hr />



                                    <h4><span style={{ fontWeight: 'bold' }}>Total Pedido: </span>${selectedPedido.total}</h4>
                                </>
                            }

                        </Modal.Body>


                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDetalles}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                }
            </div >
        </>
    );
}