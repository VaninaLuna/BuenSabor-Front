import Cliente from "../models/Cliente";


//GET
export async function getClientePorUsuarioClienteId(id: number) {
    const ENDPOINT = `http://localhost:9000/cliente/usuario_cliente_id/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Cliente;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

//POST - PUT
export async function saveCliente(cliente?: Cliente) {
    let endpoint = 'http://localhost:9000/cliente';
    let method: string = "POST";

    if (cliente && cliente.id !== 0) {
        endpoint = `http://localhost:9000/cliente/${cliente.id}`;
        method = "PUT";
    }

    const response = await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(cliente)
    });

    return response.json() as Promise<Cliente>;
}