import BarChart from '../reportes/BarChart';
import PieChart from '../reportes/PieChart';

// Registrar los componentes necesarios de Chart.js

export default function Estadisticas() {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ margin: '20px 0px 50px 0', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}>Estadisticas</h1>

                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', height: '600px', margin: '20px 0', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px' }}>
                    <div style={{ width: '15cm', height: '5cm' }}>
                        <h2>Pedidos por Mes y Año</h2>
                        <BarChart />
                    </div>
                    <div style={{ width: '15cm', height: '5cm' }}>
                        <h2>Cantidad de Pedidos Por Articulos</h2>
                        <PieChart />
                    </div>
                </div>
                {/* <br></br>
                <br></br>
                <div style={{ width: '15cm', height: '10cm', marginBottom: '20px' }}>
                    <h2>Distribución de Colores</h2>
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div> */}
            </div>
        </>
    )
}