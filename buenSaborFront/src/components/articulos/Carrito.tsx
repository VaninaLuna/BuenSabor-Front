import { useEffect, useState } from "react";
import "../../styles/Carrito.css";
import { CCloseButton, COffcanvas, COffcanvasBody, COffcanvasHeader, CSpinner } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCart } from "@coreui/icons";
import PedidoDetalle from "../../models/PedidoDetalle";
import ArticuloDTO from "../../models/ArticuloDTO";
import { useCarrito } from "../../hooks/UseCarrito";
import { PedidoCliente } from "../../models/Pedido";
import { getTiempoDemoraCocina, savePedido } from "../../services/PedidoApi";
import { ModalMensaje } from "./ModalMensaje";
import { CheckoutMP } from "./CheckOut";
import { UsuarioCliente } from "../../models/Usuario";
import Cliente from "../../models/Cliente";
import { Form } from "react-bootstrap";
import Factura from "../../models/Factura";
import { getArticuloManufacturadoPorID } from "../../services/ArticuloManufacturadoApi";
import { saveFactura, sendMailFactura } from "../../services/FacturaApi";

function CartItem({ item, addCarrito, removeItemCarrito }: { item: PedidoDetalle, addCarrito: (articulo: ArticuloDTO) => void, removeItemCarrito: (articulo: ArticuloDTO) => void }) {
    return (
        <li key={item.id}>
            <img
                className="cart-img"
                src={`${item.articulo.imagenes[0].url}`}
                alt={item.articulo.denominacion}
            />
            <div style={{ marginBottom: '10px' }}>
                <strong>{item.articulo.denominacion}</strong> - ${item.articulo.precioVenta}
            </div>
            <footer>
                <button onClick={() => removeItemCarrito(item.articulo)}>-</button>
                <small>
                    {item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'}
                </small>
                <button type="button" onClick={() => addCarrito(item.articulo)}>+</button>
            </footer>
        </li>
    );
}

export function Carrito({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
    const { cart, addCarrito, removeItemCarrito, limpiarCarritoDespuesPago, limpiarCarrito, totalPedido, totalCosto } = useCarrito();
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [pedidoGuardado, setPedidoGuardado] = useState<PedidoCliente>(new PedidoCliente());
    const [pagoRealizado] = useState(false);
    const [tipoEnvio, setTipoEnvio] = useState('');
    const [formaPago, setFormaPago] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;

    const handleTipoEnvioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTipoEnvio(e.target.id);
        setFormaPago('');

        if (e.target.id === 'delivery') {
            handleFormaPagoChange({ target: { id: 'mp' } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleFormaPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormaPago(e.target.id);

    };

    const getTiempoManufacturado = async (detalle: PedidoDetalle) => {
        let tiempo = 0;
        const m = await getArticuloManufacturadoPorID(detalle.articulo.id)
        if (m) {
            tiempo = m.tiempoEstimadoMinutos * detalle.cantidad;
        }
        return tiempo;
    }

    const crearFactura = async (pedido: PedidoCliente) => {

        if (formaPago == "efectivo") {
            const factura = new Factura();
            factura.fechaFacturacion = pedido.fechaPedido;
            factura.totalVenta = pedido.total;
            factura.totalCosto = pedido.totalCosto;
            factura.pedido = pedido;
            factura.formaPago = "Efectivo" //formaPago == "mp" ? "MercadoPago" : "Efectivo";

            if (tipoEnvio == 'pickup') {
                factura.montoDescuento = pedido.total / 0.9 * 0.1;
            }

            const facturaFromDB: Factura = await saveFactura(factura);

            await sendMailFactura(facturaFromDB.id, pedido.cliente.email as string)

        } else {
            setShowModal(true);
        }
    }

    const guardarPedido = async () => {
        setIsLoading(true);
        let demoraDelivery = 0
        if (cart.length === 0) {
            setMessage("Al menos debe agregar un articulo al carrito");
            setShowModal(true);
            setIsLoading(false);
            return;
        }

        if (tipoEnvio === 'delivery' && !usuarioLogueado.cliente.domicilio) {
            demoraDelivery = 10
            setMessage("Debe configurar su domicilio antes de generar un pedido con envío");
            setShowModal(true);
            setIsLoading(false);
            return;
        }

        const tiempoDemoraCocina = await getTiempoDemoraCocina();
        let tiempoDemoraPedidoActual = 0;

        const fechaPedido = new Date();

        //Validar horario de atencion
        const validarDia = fechaPedido.getDay();
        const validarHoras = fechaPedido.getHours();

        if ((validarDia == 0 || validarDia == 6) && (validarHoras >= 0 && validarHoras < 11 || (validarHoras >= 15 && validarHoras < 20))) {
            setMessage("No puede realizar un pedido fuera del horario de apertura");
            setShowModal(true);
            setIsLoading(false);
            return
        } else if (validarHoras >= 0 && validarHoras < 20) {
            setMessage("No puede realizar un pedido fuera del horario de apertura");
            setShowModal(true);
            setIsLoading(false);
            return
        }

        for (const detalle of cart) {
            if (detalle.articulo.type === 'articuloManufacturado') {
                tiempoDemoraPedidoActual += await getTiempoManufacturado(detalle)
            }
        }
        const clienteActualizado = JSON.parse(JSON.stringify(usuarioLogueado.cliente)) as Cliente;

        const pedido: PedidoCliente = new PedidoCliente();

        fechaPedido.setMinutes(fechaPedido.getMinutes() + tiempoDemoraCocina + tiempoDemoraPedidoActual + demoraDelivery);

        const diaFecha = fechaPedido.getDate().toString().padStart(2, '0');
        const mes = (fechaPedido.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaPedido.getFullYear();

        pedido.fechaPedido = `${diaFecha}/${mes}/${año}`;
        const horas = fechaPedido.getHours();
        const minutos = fechaPedido.getMinutes().toString().padStart(2, '0');
        const segundos = fechaPedido.getSeconds().toString().padStart(2, '0');
        pedido.horaEstimadaFinalizacion = `${horas.toString().padStart(2, '0')}:${minutos}:${segundos}`;

        pedido.total = totalPedido ?? 0;
        pedido.totalCosto = totalCosto ?? 0;
        pedido.pedidoDetalles = cart;

        pedido.cliente = clienteActualizado;

        if (tipoEnvio == 'pickup') {
            pedido.total -= pedido.total * 0.10;
        }

        try {
            const pedidoFromDB: PedidoCliente = await savePedido(pedido);
            setPedidoGuardado(pedidoFromDB);
            setShowModal(true);
            await crearFactura(pedidoFromDB);
        } catch (error) {
            setMessage("Hubo un error al guardar el pedido. Intente nuevamente.");
            setShowModal(true);
        }

        setIsLoading(false);

    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (formaPago == "efectivo") {
            limpiarTodo()
        }
    };

    const limpiarTodo = () => {
        limpiarCarrito();
        setTipoEnvio('');
        setFormaPago('');
        setPedidoGuardado(new PedidoCliente());
    };

    useEffect(() => {
        if (pagoRealizado) {
            limpiarCarritoDespuesPago();
        }
    }, [pagoRealizado, limpiarCarritoDespuesPago]);

    return (
        <>
            <ModalMensaje
                showModal={showModal}
                pedido={pedidoGuardado}
                message={message}
                handleClose={handleCloseModal}
            />

            <COffcanvas placement="end" visible={visible} scroll={true} onHide={() => setVisible(false)} className="text-center cart">
                <COffcanvasHeader className="text-center">
                    <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
                </COffcanvasHeader>
                <COffcanvasBody>
                    <h4><CIcon className="text-success" size="xl" style={{ marginRight: '10px' }} icon={cilCart} />
                        Carrito de Compras</h4>
                    <hr />
                    {isLoading ? (
                        <CSpinner />
                    ) : (
                        cart && cart.length > 0 ? (
                            <>
                                <ul>
                                    {
                                        cart.map(detalle =>
                                            <CartItem key={detalle.articulo.id} item={detalle} addCarrito={addCarrito} removeItemCarrito={removeItemCarrito} />
                                        )
                                    }
                                </ul>
                                <div>
                                    <h3>Total: ${totalPedido}</h3>
                                </div>
                                <br />
                                <button title='Limpiar Todo' onClick={() => limpiarTodo()}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                        <path d='M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
                                        <path d='M17 17a2 2 0 1 0 2 2' />
                                        <path d='M17 17h-11v-11' />
                                        <path d='M9.239 5.231l10.761 .769l-1 7h-2m-4 0h-7' />
                                        <path d='M3 3l18 18' />
                                    </svg>
                                </button>
                                <br />
                                <br />

                                {
                                    pedidoGuardado && pedidoGuardado.id > 0 && formaPago === 'mp' ? (
                                        <CheckoutMP pedido={pedidoGuardado} tipoDePago={formaPago} tipoDeEnvio={tipoEnvio} />
                                    ) : (
                                        (usuarioLogueado && usuarioLogueado.rol) ? (
                                            <>
                                                <Form>
                                                    <Form.Group className="d-flex" style={{ justifyContent: 'space-evenly', marginTop: '50px', marginBottom: '50px' }}>
                                                        <Form.Check type="radio" label="Envío a domicilio"
                                                            id="delivery" checked={tipoEnvio === 'delivery'} onChange={handleTipoEnvioChange}
                                                        />
                                                        <Form.Check type="radio" label="Retiro en el local" id="pickup"
                                                            checked={tipoEnvio === 'pickup'} onChange={handleTipoEnvioChange}
                                                        />
                                                    </Form.Group>

                                                    <p>10% de descuento retirando en tienda</p>

                                                    {tipoEnvio && (
                                                        <Form.Group className="d-flex" style={{ justifyContent: 'space-evenly', marginTop: '50px', marginBottom: '50px' }}>
                                                            <Form.Check type="radio" label="MercadoPago" id="mp" disabled={tipoEnvio === 'delivery'}
                                                                checked={formaPago === 'mp'} onChange={handleFormaPagoChange}
                                                            />
                                                            <Form.Check type="radio" label="Efectivo" id="efectivo" disabled={tipoEnvio === 'delivery'}
                                                                checked={formaPago === 'efectivo'} onChange={handleFormaPagoChange}
                                                            />
                                                        </Form.Group>
                                                    )}
                                                </Form>
                                                {formaPago && <button onClick={guardarPedido}> Generar Pedido </button>}
                                            </>
                                        ) : <h5>Para realizar un pedido Inicie Sesion</h5>
                                    )
                                }
                            </>
                        ) : (
                            <p>No hay productos en el carrito.</p>
                        )
                    )}
                </COffcanvasBody>
            </COffcanvas >
        </>
    );
}
