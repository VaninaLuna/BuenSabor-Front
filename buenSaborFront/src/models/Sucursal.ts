import Categoria from "./Categoria";
import Domicilio from "./Domicilio";
import Empresa from "./Empresa";
import Promocion from "./Promocion";

export default class Sucursal {
    id: number = 0;
    nombre: string = "";
    horarioApertura: string = "";
    horarioCierre: string = "";
    casaMatriz: boolean = false;
    url: string = "";
    domicilio: Domicilio = new Domicilio();
    empresa: Empresa = new Empresa();
    categorias?: Categoria[] = [];
    promociones?: Promocion[] = [];

}