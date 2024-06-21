import { useEffect, useState } from "react"
import ArticuloInsumo from "../../models/ArticuloInsumo";
import { getArticulosInsumosByEsParaElaborar } from "../../services/ArticuloInsumoApi";
import { getArticulosManufacturados } from "../../services/ArticuloManufacturadoApi";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import ArticuloDTO from "../../models/ArticuloDTO";
import { Form } from "react-bootstrap";
import { CarritoContextProvider } from "../context/CarritoContext";
import { Carrito } from "./Carrito";
import { ArticuloTarjeta } from "./ArticuloTarjeta";

export function Articulos() {

    const [filteredArticulos, setFilteredArticulos] = useState<ArticuloDTO[]>([]);
    const [allArticulos, setAllArticulos] = useState<ArticuloDTO[]>([]);
    const [filter, setFilter] = useState("");
    const [verCarrito, setVerCarrito] = useState(false);


    const handleVerCarrito = () => {
        setVerCarrito(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            const insumos: ArticuloInsumo[] = await getArticulosInsumosByEsParaElaborar(false);
            const manufacturados: ArticuloManufacturado[] = await getArticulosManufacturados();

            const newArticulos: ArticuloDTO[] = [];

            insumos.map((insumo: ArticuloInsumo) => {
                const newArticulo = {
                    id: insumo.id,
                    denominacion: insumo.denominacion,
                    precioVenta: insumo.precioVenta,
                    imagenes: insumo.imagenes,
                    type: "articuloInsumo"
                }
                newArticulos.push(newArticulo);
            })

            manufacturados.map((manufacturado: ArticuloManufacturado) => {
                const newArticulo = {
                    id: manufacturado.id,
                    denominacion: manufacturado.denominacion,
                    precioVenta: manufacturado.precioVenta,
                    imagenes: manufacturado.imagenes,
                    articuloManufacturadoDetalles: manufacturado.articuloManufacturadoDetalles,
                    type: "articuloManufacturado"
                }
                newArticulos.push(newArticulo);
            })

            setAllArticulos(newArticulos);
            setFilteredArticulos(newArticulos);
        };

        fetchData();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);

        const filtered = allArticulos.filter(articulo =>
            articulo.denominacion.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredArticulos(filtered);
    };

    return (
        <>
            <CarritoContextProvider>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Control
                        type="text"
                        placeholder="Filtrar por Nombre"
                        value={filter}
                        onChange={handleFilterChange}
                        style={{ margin: 50, width: '300px', height: '50px' }}
                    />
                    <div style={{ margin: 30 }}>
                        <button type="button" className="btn btn-success mt-4" style={{ width: '150px', backgroundColor: '#e06f72', border: '#e06f72', fontWeight: 'initial', color: 'whitesmoke' }} onClick={handleVerCarrito}>Ver Carrito</button>
                    </div>
                </div>
                <div className="main container">
                    <div className="row justify-content-center">
                        {
                            filteredArticulos.map((articulo: ArticuloDTO) => {
                                return (
                                    <ArticuloTarjeta key={articulo.id} articulo={articulo} />
                                )
                            })
                        }
                    </div>
                </div>

                <Carrito visible={verCarrito}
                    setVisible={setVerCarrito} />
            </CarritoContextProvider >
        </>
    )
}