import Provincia from "../models/Provincia";

//GET
export async function getPronviciasPorPais(idPais: number) {
    const ENDPOINT = `http://localhost:9000/provincia/por_pais/${idPais}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as Provincia[];
    } catch (e) {
        throw new Error('Error al hacer fetch de articuloInsumo')
    }
}
