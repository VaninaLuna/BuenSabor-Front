import ArticuloInsumo from "../models/ArticuloInsumo";


//GET
export async function getArticulosInsumos() {
    const ENDPOINT = 'http://localhost:9000/articuloInsumo/esta_eliminado/false';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloInsumo[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}
export async function getArticulosInsumosByEsParaElaborar(esParaElaborar: boolean) {
    const ENDPOINT = `http://localhost:9000/articuloInsumo/esParaElaborar/${esParaElaborar}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloInsumo[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getArticuloInsumoPorID(id: number) {
    const ENDPOINT = `http://localhost:9000/articuloInsumo/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloInsumo;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

//POST - PUT
export async function saveArticuloInsumo(articuloInsumo?: ArticuloInsumo) {
    const dataInsumo = { ...articuloInsumo, type: "articuloInsumo" }
    let endpoint = 'http://localhost:9000/articuloInsumo';
    let method: string = "POST";

    if (articuloInsumo && articuloInsumo.id !== 0) {
        endpoint = `http://localhost:9000/articuloInsumo/${articuloInsumo.id}`;
        method = "PUT";
    }

    await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(dataInsumo)
    });
}

//DELETE
export async function deleteArticuloInsumoPorID(id: number) {
    const DELETE_ENDPOINT = `http://localhost:9000/articuloInsumo/${id}`

    try {
        const response = await fetch(DELETE_ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el articuloInsumo: ${response.status} ${response.statusText}`);
        }

        const isDeleted = await response.json();
        return isDeleted as boolean;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

//Delete logico
export async function updateEstadoEliminadoInsumo(id: number) {
    const endpoint = `http://localhost:9000/articuloInsumo/cambiar_estado_eliminado/${id}`;

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
export async function getInsumoByEstaEliminado(eliminado: boolean) {
    const endpoint = `http://localhost:9000/articuloInsumo/esta_eliminado/${eliminado}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloInsumo[];
    } catch (e) {
        throw new Error('Error al hacer fetch')
    }
}
