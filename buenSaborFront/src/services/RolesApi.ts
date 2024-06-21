import Rol from "../models/Rol";

export async function getRoles() {
    const ROLES_ENDPOINT = 'http://localhost:9000/rol/all';

    try {
        const response = await fetch(ROLES_ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Rol[];
    } catch (e) {
        throw new Error('Error al hacer fetch de ROLES')
    }
}
