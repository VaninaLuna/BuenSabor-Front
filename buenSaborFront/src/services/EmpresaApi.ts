import Empresa from "../models/Empresa";

export async function getEmpresas() {
    const ENDPOINT = 'http://localhost:9000/empresa/all';

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Empresa[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

export async function getEmpresaPorID(id: number) {
    const ENDPOINT = `http://localhost:9000/empresa/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Empresa;
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}

//POST - PUT
export async function saveEmpresa(empresa?: Empresa) {
    let endpoint = 'http://localhost:9000/empresa';
    let method: string = "POST";

    if (empresa && empresa.id !== 0) {
        endpoint = `http://localhost:9000/empresa/${empresa.id}`;
        method = "PUT";
    }

    await fetch(endpoint, {
        "method": method,
        "headers": {
            "Content-Type": 'application/json'
        },
        "body": JSON.stringify(empresa)
    });
}

//DELETE
export async function deleteEmpresaPorID(id: number) {
    const DELETE_ENDPOINT = `http://localhost:9000/empresa/${id}`

    try {
        const response = await fetch(DELETE_ENDPOINT, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la empresa: ${response.status} ${response.statusText}`);
        }

        const isDeleted = await response.json();
        return isDeleted as boolean;
    } catch (e) {
        throw new Error('Error al hacer fetch de empresa')
    }
}
