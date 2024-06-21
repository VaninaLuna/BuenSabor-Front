export async function getReporteFechas(fechaDesde: string, fechaHasta: string) {
    const response = await fetch(`http://localhost:9000/report/excel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));

    return url
}