import Cliente from "./Cliente";
import PedidoDetalle from "./PedidoDetalle";

export default class Pedido {
    id: number = 0;
    horaEstimadaFinalizacion: string = "";
    total: number = 0;
    totalCosto: number = 0;
    fechaPedido: string = "";
    estado: string = "Recibido";
    pedidoDetalles: PedidoDetalle[] = [];
}

export class PedidoCliente {
    id: number = 0;
    horaEstimadaFinalizacion: string = "";
    total: number = 0;
    totalCosto: number = 0;
    fechaPedido: string = "";
    estado: string = "Recibido";
    pedidoDetalles: PedidoDetalle[] = [];
    cliente: Cliente = new Cliente();
}