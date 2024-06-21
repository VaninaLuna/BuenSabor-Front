import ArticuloDTO from "./ArticuloDTO";

export default class PedidoDetalle {
    id: number = 0;
    cantidad: number = 0;
    subTotal: number = 0;
    articulo: ArticuloDTO = new ArticuloDTO();
}