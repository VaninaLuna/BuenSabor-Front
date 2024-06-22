import ArticuloManufacturado from "../models/ArticuloManufacturado";

//GET
export async function getArticulosManufacturados() {
    const ENDPOINT = 'http://localhost:9000/articuloManufacturado/esta_eliminado/false';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloManufacturado[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloManufacturado')
    }
}

export async function getArticuloManufacturadoPorID(id: number) {
    const ENDPOINT = `http://localhost:9000/articuloManufacturado/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloManufacturado;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloManufacturado')
    }
}





//POST - PUT
export async function saveArticuloManufacturado(articuloManufacturado?: ArticuloManufacturado) {
    const dataManufacturado = { ...articuloManufacturado, type: "articuloManufacturado" }
    let endpoint = 'http://localhost:9000/articuloManufacturado';
    let method: string = "POST";

    if (articuloManufacturado && articuloManufacturado.id !== 0) {
        endpoint = `http://localhost:9000/articuloManufacturado/${articuloManufacturado.id}`;
        method = "PUT";
    }

    await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(dataManufacturado)
    });
}

//DELETE
export async function deleteArticuloManufacturadoPorID(id: number) {
    const DELETE_ENDPOINT = `http://localhost:9000/articuloManufacturado/${id}`

    try {
        const response = await fetch(DELETE_ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el articuloManufacturado: ${response.status} ${response.statusText}`);
        }

        const isDeleted = await response.json();
        return isDeleted as boolean;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloManufacturado')
    }
}

//Delete logico
export async function updateEstadoEliminadoManufacturado(id: number) {
    const endpoint = `http://localhost:9000/articuloManufacturado/cambiar_estado_eliminado/${id}`;

    try {
        const response = await fetch(endpoint, {
            "method": "PUT",
            "headers": {
                "Content-Type": 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        throw new Error('Error al cambiar el estado eliminado')
    }
}

//Get eliminados o no eliminados
export async function getManufacturadoByEstaEliminado(eliminado: boolean) {
    const endpoint = `http://localhost:9000/articuloManufacturado/esta_eliminado/${eliminado}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloManufacturado[];
    } catch (e) {
        throw new Error('Error al hacer fetch')
    }
}