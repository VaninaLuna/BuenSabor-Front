import Localidad from "../models/Localidad";

//GET
export async function getLocalidades() {
    const ENDPOINT = 'http://localhost:9000/localidad/all';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Localidad[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getLocalidadPorId(id: number) {
    const ENDPOINT = `http://localhost:9000/localidad/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Localidad;
    } catch (e) {
        throw new Error('Error al hacer fetch de sucursal')
    }
}

export async function getLocalidadesPorProvincia(idProvincia: number) {
    const ENDPOINT = `http://localhost:9000/localidad/por_provincia/${idProvincia}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Localidad[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}


//POST - PUT
export async function saveLocalidad(localidad?: Localidad) {
    let endpoint = 'http://localhost:9000/localidad';
    let method: string = "POST";

    if (localidad && localidad.id !== 0) {
        endpoint = `http://localhost:9000/localidad/${localidad.id}`;
        method = "PUT";
    }

    const response = await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(localidad)
    });

    return response.json() as Promise<Localidad>;
}

//DELETE
export async function deleteLocalidadPorId(id: number) {
    const ENDPOINT = `http://localhost:9000/localidad/${id}`

    try {
        const response = await fetch(ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la localidad: ${response.status} ${response.statusText}`);
        }

        const isDeleted = await response.json();
        return isDeleted as boolean;
    } catch (e) {
        throw new Error('Error al hacer fetch de localidad')
    }
}
