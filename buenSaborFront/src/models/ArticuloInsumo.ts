import Imagen from "./Imagen";
import Categoria from "./Categoria";
import UnidadMedida from "./UnidadMedida"

export default class ArticuloInsumo{
    id: number = 0;
    denominacion:string = "";
    precioVenta:number = 0;
    precioCompra:number = 0;
    stockActual:number = 0;
    stockMaximo:number = 0;
    esParaElaborar:boolean = false;
    imagenes:Imagen[] = [];
    unidadMedida:UnidadMedida = new UnidadMedida();
    categoria:Categoria = new Categoria();
    type: string = "articuloInsumo";
}