import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import Categoria from "./Categoria";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";

export default class ArticuloManufacturado{
    id:number = 0;
    denominacion:string = "";
    precioVenta:number = 0;
    descripcion:string = "";
    tiempoEstimadoMinutos:number = 0;
    preparacion:string = "";    
    imagenes:Imagen[] = [];
    unidadMedida:UnidadMedida = new UnidadMedida();
    categoria:Categoria = new Categoria();
    articuloManufacturadoDetalles:ArticuloManufacturadoDetalle[] = [];
    type: string = "articuloManufacturado";
}