import Domicilio from "./Domicilio";

export default class Cliente {
    id: number = 0;
    nombre?: string = "";
    apellido?: string = "";
    email?: string = "";
    telefono: string = "";
    fechaNacimiento: string = "";
    domicilio: Domicilio = new Domicilio();
}

export class ClienteRegistro {
    id: number = 0;
    nombre?: string = "";
    apellido?: string = "";
    email?: string = "";
    telefono: string = "";
    fechaNacimiento: string = "";
}

