import Domicilio from "../models/Domicilio";

//GET
export async function getDomicilios() {
    const ENDPOINT = 'http://localhost:9000/domicilio/all';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Domicilio[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getDomicilioPorId(id: number) {
    const ENDPOINT = `http://localhost:9000/domicilio/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Domicilio;
    } catch (e) {
        throw new Error('Error al hacer fetch de sucursal')
    }
}

//POST - PUT
export async function saveDomicilio(domicilio?: Domicilio) {
    let endpoint = 'http://localhost:9000/domicilio';
    let method: string = "POST";

    if (domicilio && domicilio.id !== 0) {
        endpoint = `http://localhost:9000/domicilio/${domicilio.id}`;
        method = "PUT";
    }

    const response = await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(domicilio)
    });

    return response.json() as Promise<Domicilio>;
}

//DELETE
export async function deleteDomicilioPorId(id: number) {
    const ENDPOINT = `http://localhost:9000/domicilio/${id}`

    try {
        const response = await fetch(ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el domicilio: ${response.status} ${response.statusText}`);
        }

        const isDeleted = await response.json();
        return isDeleted as boolean;
    } catch (e) {
        throw new Error('Error al hacer fetch de localidad')
    }
}
