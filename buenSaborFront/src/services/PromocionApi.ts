import Promocion from "../models/Promocion";

//GET
export async function getPromociones() {
    const ENDPOINT = 'http://localhost:9000/promociones/all';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Promocion[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getPromocionPorID(id: number) {
    const ENDPOINT = `http://localhost:9000/promociones/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Promocion;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

//POST-PUT
export async function savePromocion(promocion?: Promocion) {
    let endpoint = 'http://localhost:9000/promociones';
    let method: string = "POST";

    if (promocion && promocion.id !== 0) {
        endpoint = `http://localhost:9000/promociones/${promocion.id}`;
        method = "PUT";
    }

    await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(promocion)
    });
}

//DELETE
export async function deletePromocionPorID(id: number) {
    const DELETE_ENDPOINT = `http://localhost:9000/promociones/${id}`

    try {
        const response = await fetch(DELETE_ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la unidadMedida: ${response.status} ${response.statusText}`);
        }

        const isDeleted = await response.json();
        return isDeleted as boolean;
    } catch (e) {
        throw new Error('Error al hacer fetch de unidadMedida')
    }
}