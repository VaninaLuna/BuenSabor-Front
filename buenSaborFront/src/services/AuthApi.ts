import Usuario, { UsuarioLogin, UsuarioCliente, UsaurioRegistro } from "../models/Usuario";

// ---------- LOGIN ----------------------
export async function login(usuarioLogin?: UsuarioLogin) {
    const endpoint = 'http://localhost:9000/auth/login';

    const response = await fetch(endpoint, {
        "method": "POST",
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(usuarioLogin)
    });

    console.log(response);
    const json = await response.json();
    return json as Usuario;
}

// ---------- REGISTER ------------------------
export async function register(usuario: UsaurioRegistro) {
    // const u = {...usuario.usuario, cliente: usuario.cliente}
    const endpoint = 'http://localhost:9000/auth/register';

    try {
        const response = await fetch(endpoint, {
            "method": "POST",
            "headers": {
                "Content-Type": 'application/json'
            },
            "body": JSON.stringify(usuario)
        });

        console.log(response);
        const json = await response.json();

        return json as UsuarioCliente;

    } catch (error) {
        throw new Error('Error al guardar el usuario')
    }
}


// -------------- LOG OUT ----------------


export async function logout() {
    const endpoint = 'http://localhost:9000/auth/logout';

    try {
        const response = await fetch(endpoint, {
            "method": "POST",
            "headers": {
                "Content-Type": 'application/json'
            }
        });

        //const json = response.json();
        console.log(response);
        return response;
    } catch (error) {
        throw new Error('Error al guardar el usuario')
    }
}