import { useEffect, useState } from "react";
import ArticuloDTO from "../../models/ArticuloDTO";
import ArticuloInsumo from "../../models/ArticuloInsumo";
import ArticuloManufacturado from "../../models/ArticuloManufacturado";
import { getArticulosInsumosByEsParaElaborar } from "../../services/ArticuloInsumoApi";
import { getArticulosManufacturados } from "../../services/ArticuloManufacturadoApi";
import { Button, FormCheck, FormControl, Image, Modal, Table } from "react-bootstrap";

interface ModalProps {
    showModalAgregar: boolean;
    handleCloseAgregar: (articulosSeleccionados: ArticuloDTO[]) => void;
}

export const ModalAgregarArticulos: React.FC<ModalProps> = ({ showModalAgregar, handleCloseAgregar }) => {

    const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
    const [filteredArticulos, setFilteredArticulos] = useState<ArticuloDTO[]>([]);
    const [filter, setFilter] = useState("");
    const [articulosSeleccionados, setArticulosSeleccionados] = useState<ArticuloDTO[]>([]);



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

            setArticulos(newArticulos);
            setFilteredArticulos(newArticulos);
        };

        fetchData();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);

        const filtered = articulos.filter(articulo =>
            articulo.denominacion.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredArticulos(filtered);
    };

    const handleSelectChange = (articulo: ArticuloDTO, isChecked: boolean) => {
        if (isChecked) {
            setArticulosSeleccionados([...articulosSeleccionados, articulo]);
        } else {
            setArticulosSeleccionados(articulosSeleccionados.filter(item => item.id !== articulo.id));
        }

        console.log(articulosSeleccionados);
    };

    const handleCloseAndClear = () => {
        handleCloseAgregar(articulosSeleccionados);
        setArticulosSeleccionados([]);  // Clear selected items
    };


    return (
        <Modal show={showModalAgregar} onHide={handleCloseAndClear}
            size="lg" style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header style={{ backgroundColor: 'gainsboro' }} closeButton>
                <Modal.Title>Agregar Insumos</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: 'gainsboro' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <FormControl
                        placeholder="Filtrar por ID o Denominacion"
                        value={filter}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '20px', width: '300px' }}
                    />
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th style={{ maxWidth: "100px" }}>Seleccionar</th>
                            <th style={{ maxWidth: "80px" }}>ID</th>
                            <th>Imagen</th>
                            <th style={{ minWidth: "150px" }}>Denominacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticulos.map((articulo: ArticuloDTO, index) =>
                            <tr key={index}>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <FormCheck type="checkbox" name="agregar"
                                        onChange={(e) => handleSelectChange(articulo, e.target.checked)} />
                                </td>
                                <td>{articulo.id}</td>
                                <td>{articulo.imagenes && articulo.imagenes[0] ?
                                    <Image src={articulo.imagenes[0].url}
                                        alt={articulo.denominacion} style={{ height: "50px", width: "50px", objectFit: 'cover' }} rounded />
                                    : 'No image'
                                }</td>
                                <td>{articulo.denominacion}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>

            <Modal.Footer style={{ backgroundColor: 'gainsboro' }}>
                <Button style={{ backgroundColor: '#83CA6A' }} onClick={handleCloseAndClear}>Cerrar y Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
}