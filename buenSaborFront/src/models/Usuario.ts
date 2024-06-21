import Cliente, { ClienteRegistro } from "./Cliente";
import Rol from "./Rol";

export default class Usuario {
    id?: number;
    nombreUsuario?: string;
    //password?: string = "";
    rol: Rol = new Rol();
}

export class UsuarioLogin {
    nombreUsuario?: string;
    password: string = "";
}

export class UsaurioRegistro {
    id?: number;
    nombreUsuario?: string;
    rol: Rol = new Rol();
    cliente: ClienteRegistro = new ClienteRegistro();
}

export class UsuarioCliente {
    id?: number;
    nombreUsuario?: string;
    rol: Rol = new Rol();
    cliente: Cliente = new Cliente();
}