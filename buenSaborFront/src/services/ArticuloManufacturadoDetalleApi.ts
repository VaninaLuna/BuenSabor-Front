import ArticuloManufacturadoDetalle from "../models/ArticuloManufacturadoDetalle";

export async function getArticuloManufacturadoDetallePorID(id: number) {
    const INSTRUMENTO_ENDPOINT = `http://localhost:9000/instrumento/${id}`;

    try {
        const response = await fetch(INSTRUMENTO_ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloManufacturadoDetalle;
    } catch (e) {
        throw new Error('Error al hacer fetch de instrumentos')
    }
}
