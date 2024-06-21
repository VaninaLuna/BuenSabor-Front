import { PedidoCliente } from "./Pedido";

export default class Factura {
    id: number = 0;
    fechaFacturacion: string = "";
    mpPreferenceId?: string = "";
    montoDescuento: number = 0;
    formaPago: string = "";
    totalVenta: number = 0;
    totalCosto: number = 0;
    pedido: PedidoCliente = new PedidoCliente();
}