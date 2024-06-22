import { useState } from 'react';
import { getReporteFechas } from '../../services/ReporteApi';

const ReporteExcel = () => {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {

            const url = await getReporteFechas(fechaDesde, fechaHasta);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_pedidos_${fechaDesde}_${fechaHasta}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setMessage('');
        }
    };

    const validateForm = () => {
        if (fechaDesde === undefined || fechaDesde === "") {
            setMessage("Debe ingresar fecha de inicio");
            return false;
        }
        if (fechaHasta === undefined || fechaHasta === "") {
            setMessage("Debe ingresar fecha de fin");
            return false;
        }
        return true;
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <h2 style={{ alignSelf: "center", color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Generar Reporte De Pedidos En Excel</h2>
            </div>
            <div className="d-flex flex-column w-50  m-auto"
                style={{ minHeight: '35vh', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: "15px" }}>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <h2><label htmlFor="fechaDesde" className="form-label" style={{ color: "whitesmoke" }}>Fecha Desde:</label></h2>
                        <input type="date" id="fechaDesde" value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}

                            style={{
                                width: ' 100%',
                                padding: '.375rem .75rem',
                                fontSize: '1rem',
                                fontWeight: '400',
                                lineHeight: '1.5'
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <h2><label htmlFor="fechaHasta" className="form-label" style={{ color: "whitesmoke" }}>Fecha Hasta:</label></h2>
                        <input type="date" id="fechaHasta" value={fechaHasta}
                            style={{
                                width: ' 100%',
                                padding: '.375rem .75rem',
                                fontSize: '1rem',
                                fontWeight: '400',
                                lineHeight: '1.5'
                            }}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </div>

                    <div>
                        {message && <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{message}</p>}
                    </div>

                    <button type="submit" className="btn btn-success" style={{ backgroundColor: '#e06f72', border: '#e06f72', fontWeight: 'initial', color: 'whitesmoke' }}>Generar Reporte</button>
                </form>
            </div>
        </>

    );
};

export default ReporteExcel;