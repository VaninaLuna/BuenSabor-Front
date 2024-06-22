import { useEffect, useState } from 'react';
import { Table, FormControl, Modal, FormCheck, Button, Image } from 'react-bootstrap';
import Sucursal from '../../models/Sucursal';
import { saveSucursal } from '../../services/SucursalApi';
import Promocion from '../../models/Promocion';
import { getPromociones } from '../../services/PromocionApi';

interface ModalProps {
    onlyShowPromociones: boolean;
    selectedSucursal: Sucursal;
    showModalAgregarPromociones: boolean;
    handleClose: () => void;
}

export const ModalAgregarPromociones: React.FC<ModalProps> = ({ onlyShowPromociones, selectedSucursal, showModalAgregarPromociones, handleClose }) => {

    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [promocionesSeleccionadas, setPromocionesSeleccionadas] = useState<Promocion[]>([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const loadPromociones = async () => {
            if (showModalAgregarPromociones) {
                if (onlyShowPromociones && selectedSucursal.promociones) {
                    // Modo Ver: mostrar solo las promociones de la sucursal seleccionada
                    setPromociones(selectedSucursal.promociones);
                } else {
                    // Modo Agregar: mostrar todas las promociones disponibles
                    const allPromotions = await getPromociones();
                    setPromociones(allPromotions);
                    if (selectedSucursal.promociones) {
                        setPromocionesSeleccionadas(selectedSucursal.promociones);
                    }
                }
            }
        };

        loadPromociones();
    }, [onlyShowPromociones, showModalAgregarPromociones, selectedSucursal]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const handleCloseAndClear = () => {
        handleClose();
        setPromocionesSeleccionadas([])
        setFiltro('')
    };

    const guardarPromociones = async () => {
        selectedSucursal.promociones = promocionesSeleccionadas

        console.log(JSON.stringify(selectedSucursal))
        await saveSucursal(selectedSucursal);
        handleClose();
        setPromocionesSeleccionadas([])
    };

    const filteredPromociones = promociones.filter(promo =>
        promo.denominacion.toLowerCase().includes(filtro.toLowerCase())
    );


    const handleSelectChange = (promo: Promocion, isChecked: boolean) => {
        if (isChecked) {
            setPromocionesSeleccionadas([...promocionesSeleccionadas, promo]);
        } else {
            setPromocionesSeleccionadas(promocionesSeleccionadas.filter(item => item.id !== promo.id));
        }
    };

    const isCategoriaSeleccionada = (id: number) => {
        return promocionesSeleccionadas.some(promo => promo.id === id);
    };


    return (
        <Modal show={showModalAgregarPromociones} onHide={handleCloseAndClear}
            size="xl" style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header style={{ backgroundColor: 'gainsboro' }} closeButton>
                <Modal.Title>Promociones</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: 'gainsboro' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <FormControl
                        placeholder="Filtrar por Codigo o Denominacion"
                        value={filtro}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '20px', width: '300px' }}
                    />
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            {!onlyShowPromociones && <th style={{ maxWidth: "100px" }}>Seleccionar</th>}
                            <th>Imagen</th>
                            <th>Denominacion</th>
                            <th>Tipo promocion</th>
                            <th>Precio Promocional</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPromociones.map((promo: Promocion, index) =>
                            <tr key={index}>
                                {!onlyShowPromociones && <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <FormCheck type="checkbox" name="agregar"
                                        checked={isCategoriaSeleccionada(promo.id)}
                                        onChange={(e) => handleSelectChange(promo, e.target.checked)} />
                                </td>}
                                <td>{promo.imagenes && promo.imagenes[0] ?
                                    <Image src={promo.imagenes[0].url}
                                        alt={promo.denominacion} style={{ height: "50px", width: "50px", objectFit: 'cover' }} rounded />
                                    : 'No image'
                                }</td>
                                <td>{promo.denominacion}</td>
                                <td>{promo.tipoPromocion}</td>
                                <td>{promo.precioPromocional}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>

            {!onlyShowPromociones &&
                <Modal.Footer style={{ backgroundColor: 'gainsboro' }}>
                    <Button style={{ backgroundColor: '#83CA6A' }} onClick={guardarPromociones}>Cerrar y Guardar</Button>
                </Modal.Footer>
            }
        </Modal>
    );
}
