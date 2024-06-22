import Imagen from "./Imagen";
import PromocionDetalle from "./PromocionDetalle";

export default class Promocion {
    id: number = 0;
    denominacion: string = "";
    fechaDesde: string = "";
    fechaHasta: string = "";
    horaDesde: string = "";
    horaHasta: string = "";
    descripcionDescuento: string = "";
    precioPromocional: number = 0;
    tipoPromocion: string = "";
    imagenes: Imagen[] = [];
    promocionDetalles: PromocionDetalle[] = [];
}