import { useEffect, useState } from "react";
import { getPedidosPorMesAnio } from "../../services/PedidoApi";
import PedidosPorMesAnioDTO from "../../models/PedidosPorMesAnioDTO";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

type BarParams = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderWidth: number;
    }[];
}


const BarChart = () => {
    const [chartData, setChartData] = useState<BarParams>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPedidosPorMesAnio();

                const labels = data.map((d: PedidosPorMesAnioDTO) => `${d.month}-${d.year}`);
                const counts = data.map((d: PedidosPorMesAnioDTO) => d.count);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cantidad de Pedidos',
                            data: counts,
                            backgroundColor: '#e7a17a',
                            borderWidth: 4,
                        },
                    ],
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Color de los labels de la leyenda
                }
            },
            title: {
                display: true,
                text: 'Pedidos por Mes y Año',
                color: 'white', // Color del título
            },
            tooltip: {
                titleColor: 'white', // Color del título del tooltip
                bodyColor: 'white', // Color del cuerpo del tooltip
                backgroundColor: 'rgba(0, 0, 0, 0.7)' // Fondo del tooltip
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white' // Color de los labels del eje X
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)' // Color de las líneas de la cuadrícula
                }
            },
            y: {
                ticks: {
                    color: 'white' // Color de los labels del eje Y
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)' // Color de las líneas de la cuadrícula
                }
            }
        }
    };

    return (
        <div>
            {chartData ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Cargando datos del gráfico...</p>
            )}
        </div>
    );
};

export default BarChart;