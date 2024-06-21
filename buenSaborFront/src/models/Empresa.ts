import Sucursal from "./Sucursal";

export default class Empresa {
    id: number = 0;
    nombre: string = "";
    razonSocial: string = "";
    cuil: string = "";
    sucursales: Sucursal[] = [];
}