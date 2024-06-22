import ArticuloManufacturadoDetalle from "../models/ArticuloManufacturadoDetalle";

export async function getArticuloManufacturadoDetallePorID(id: number) {
    const ENDPOINT = `http://localhost:9000/articuloManufacturado/detalleManufacturado/${id}`;

    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json as ArticuloManufacturadoDetalle;
    } catch (e) {
        throw new Error('Error al hacer fetch de detalle Manufacturado')
    }
}
