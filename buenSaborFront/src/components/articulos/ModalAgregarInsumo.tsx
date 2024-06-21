import { useEffect, useState } from 'react';
import { Table, FormControl, Modal, Button, Image, FormCheck } from 'react-bootstrap';
import ArticuloInsumo from '../../models/ArticuloInsumo';
import { getArticulosInsumosByEsParaElaborar } from '../../services/ArticuloInsumoApi';

interface ModalProps {
    showModalInsumos: boolean;
    handleCloseInsumos: (insumosSeleccionados: ArticuloInsumo[]) => void;
}

export const ModalAgregarInsumo: React.FC<ModalProps> = ({ showModalInsumos, handleCloseInsumos }) => {

    const [articulosInsumos, setArticulosInsumos] = useState<ArticuloInsumo[]>([]);
    const [filtro, setFiltro] = useState('');
    const [insumosSeleccionados, seInsumosSeleccionados] = useState<ArticuloInsumo[]>([]);



    const getListadoArticulosInsumos = async () => {
        const datos: ArticuloInsumo[] = await getArticulosInsumosByEsParaElaborar(true);
        setArticulosInsumos(datos);
    };


    useEffect(() => {
        getListadoArticulosInsumos();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const filteredArticulosInsumos = articulosInsumos.filter(articulo =>
        articulo.id.toString().includes(filtro) ||
        articulo.denominacion.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleSelectChange = (articulo: ArticuloInsumo, isChecked: boolean) => {
        if (isChecked) {
            articulo.type = "articuloInsumo"
            seInsumosSeleccionados([...insumosSeleccionados, articulo]);
        } else {
            seInsumosSeleccionados(insumosSeleccionados.filter(item => item.id !== articulo.id));
        }

        console.log(insumosSeleccionados);
    };

    const handleCloseAndClear = () => {
        handleCloseInsumos(insumosSeleccionados);
        seInsumosSeleccionados([]);  // Clear selected items
    };


    return (
        <Modal show={showModalInsumos} onHide={handleCloseAndClear}
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
                        value={filtro}
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
                            <th>Medida</th>
                            <th>Categoria</th>
                            <th>Precio de Compra</th>
                            <th>Precio Venta</th>
                            <th>Para Elaborar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticulosInsumos.map((articuloInsumo: ArticuloInsumo, index) =>
                            <tr key={index}>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <FormCheck type="checkbox" name="agregar"
                                        onChange={(e) => handleSelectChange(articuloInsumo, e.target.checked)} />
                                </td>
                                <td>{articuloInsumo.id}</td>
                                <td>{articuloInsumo.imagenes && articuloInsumo.imagenes[0] ?
                                    <Image src={articuloInsumo.imagenes[0].url}
                                        alt={articuloInsumo.denominacion} style={{ height: "50px", width: "50px", objectFit: 'cover' }} rounded />
                                    : 'No image'
                                }</td>
                                <td>{articuloInsumo.denominacion}</td>
                                <td>{articuloInsumo.unidadMedida.denominacion}</td>
                                <td>{articuloInsumo.categoria.denominacion}</td>
                                <td>{articuloInsumo.precioCompra}</td>
                                <td>{articuloInsumo.precioVenta}</td>
                                <td>{articuloInsumo.esParaElaborar ? 'Si' : 'No'}</td>
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
