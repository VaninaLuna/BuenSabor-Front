import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import Imagen from "./Imagen";

export default class ArticuloDTO {
    id: number = 0;
    denominacion: string = "";
    precioVenta: number = 0;
    imagenes: Imagen[] = [];
    type: string = "";
    articuloManufacturadoDetalles?: ArticuloManufacturadoDetalle[] = []; 
}