import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { UsuarioCliente } from "../../models/Usuario";
import Factura from "../../models/Factura";
import { getFacturaPDF, getFacturas, getFacturasByCliente } from "../../services/FacturaApi";
import { RolName } from "../../models/RolName";

export function GrillaFactura() {

    const [facturas, setFacturas] = useState<Factura[]>([]);
    //Modal detalles
    const [showModalDetalles, setShowModalDetalles] = useState(false);
    const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
    //const [cliente, setCliente] = useState<Cliente>(new Cliente())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;


    const getListaFacturas = async () => {
        const datos: Factura[] = usuarioLogueado && usuarioLogueado.rol.rolName == RolName.CLIENTE
            ? await getFacturasByCliente(usuarioLogueado.cliente.id)
            : await getFacturas()

        setFacturas(datos);
    };

    const handleShowDetalles = (factura: Factura) => {
        setSelectedFactura(factura)
        setShowModalDetalles(true);

    }

    const handleCloseDetalles = () => {
        setShowModalDetalles(false);
        setSelectedFactura(null);
    };

    /*
    const obtenerDatosCliente = async () => {
        if (usuarioLogueado) {
            const cliente = await getClientePorUsuarioClienteId(usuarioLogueado.id as number);
            setCliente(cliente);
        }
    }
        */

    useEffect(() => {
        getListaFacturas();
        //obtenerDatosCliente();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDownloadPdf = (factura: Factura) => {
        const url = getFacturaPDF(factura.id)
        window.open(url, "_blank");
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Facturacion</h1>



                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Nro. Factura</th>
                            <th>Fecha facturacion</th>
                            <th>Forma de pago</th>
                            <th>Total Venta</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura: Factura) =>
                            <tr key={factura.id}>
                                <td>{String(factura.id).padStart(5, '0')}</td>
                                <td>{factura.fechaFacturacion}</td>
                                <td>{factura.formaPago}</td>
                                <td>{factura.totalVenta}</td>

                                <td>
                                    <Button variant="outline-success" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => handleShowDetalles(factura)}>Detalle</Button>
                                    <Button variant="outline-info" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => handleDownloadPdf(factura)}>Descargar como PDF</Button>
                                </td>

                            </tr>
                        )}
                    </tbody>
                </Table>

                {

                    <Modal show={showModalDetalles} onHide={handleCloseDetalles} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles de la factura</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedFactura &&
                                <>
                                    <Row>
                                        <Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Informacion del Cliente</span> <br /></Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Nombre: </span> {selectedFactura.pedido.cliente.nombre}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Apellido: </span> {selectedFactura.pedido.cliente.apellido}</Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Email: </span> {selectedFactura.pedido.cliente.email}</Col>
                                            {/* <Col><span style={{ fontWeight: 'bold' }}>Fecha de nacimiento: </span> {cliente.fechaNacimiento}</Col> */}
                                            <Col><span style={{ fontWeight: 'bold' }}>Telefono: </span> {selectedFactura.pedido.cliente.telefono}</Col>
                                        </Col>
                                    </Row>
                                    <br />

                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Articulo</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>SubTotal</th>
                                            </tr>
                                        </thead>
                                        {selectedFactura.pedido.pedidoDetalles.map((detalle) => (
                                            <tbody>
                                                <tr key={detalle.id}>
                                                    <td>{detalle.articulo.denominacion}</td>
                                                    <td>{detalle.cantidad}</td>
                                                    <td>{detalle.articulo.precioVenta}</td>
                                                    <td>{detalle.subTotal}</td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </Table>
                                    <br />

                                    <Row>
                                        <Col>
                                            <Col><span style={{ fontWeight: 'bold' }}>Monto Descontado: ${selectedFactura.montoDescuento}</span> </Col> <br />
                                            <Col><h5>Total de la factura:  ${selectedFactura.totalVenta} </h5></Col>
                                        </Col>
                                    </Row>
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
            </div>
        </>
    )
}