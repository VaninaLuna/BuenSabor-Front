import Categoria from "../models/Categoria";

export async function getCategorias() {
    const ENDPOINT = 'http://localhost:9000/categoria/all';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Categoria[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getArbolCategorias() {
    const ENDPOINT = 'http://localhost:9000/categoria/arbol';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Categoria[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getCategoriaPorID(id: number) {
    const ENDPOINT = `http://localhost:9000/categoria/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Categoria;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getCategoriaPadreDesdeHijo(id: number) {
    const ENDPOINT = `http://localhost:9000/categoria/padre/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Categoria;
    } catch (e) {
        throw new Error('Error al hacer fetch de categoria')
    }
}

export async function saveCategoria(categoria?: Categoria) {
    let endpoint = 'http://localhost:9000/categoria';
    let method: string = "POST";

    if (categoria && categoria.id !== 0) {
        endpoint = `http://localhost:9000/categoria/${categoria.id}`;
        method = "PUT";
    }

    await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(categoria)
    });
}

//Delete logico
export async function updateEstadoEliminadoC(id: number) {
    const endpoint = `http://localhost:9000/categoria/cambiar_estado_eliminado/${id}`

    try {
        const response = await fetch(endpoint, {
            "method": "PUT",
            "headers": {
                "Content-Type": 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la categoria: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (e) {
        throw new Error('Error al hacer fetch de categoria')
    }
}