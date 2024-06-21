import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import PedidosPorArticuloDTO from '../../models/PedidosPorArticuloDTO';
import { getPedidosPorArticulo } from '../../services/PedidoApi';

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

type PieParams = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderWidth: number;
    }[];
}

const generateColors = (length: number) => {
    const colors = ['#FAA5B7', '#91C7EC', '#C19AE8', '#FFAC9D', '#98D7D1', '#B3E697', '#E2A3DE', '#F1A66C', '#DAEF91'];
    return colors.slice(0, length);
};

const PieChart = () => {
    const [chartData, setChartData] = useState<PieParams>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPedidosPorArticulo();

                const labels = data.map((d: PedidosPorArticuloDTO) => d.articulo);
                const counts = data.map((d: PedidosPorArticuloDTO) => d.count);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cantidad de Pedidos',
                            data: counts,
                            backgroundColor: generateColors(counts.length),
                            borderWidth: 1
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
                },
                position: 'right' as const, // Pone las etiquetas al lado derecho del gráfico
            },
            labels: {
                color: 'white' // Color de los labels de la leyenda
            },
            title: {
                display: true,
                text: 'Cantidad de Pedidos por articulos',
                color: 'white'
            },
            tooltip: {
                titleColor: 'white', // Color del título del tooltip
                bodyColor: 'white', // Color del cuerpo del tooltip
                backgroundColor: 'rgba(0, 0, 0, 0.7)' // Fondo del tooltip
            }
        },
    };

    return (
        <div>
            {chartData ? (
                <Pie data={chartData} options={options} />
            ) : (
                <p>Cargando datos del gráfico...</p>
            )}
        </div>
    );
};

export default PieChart;