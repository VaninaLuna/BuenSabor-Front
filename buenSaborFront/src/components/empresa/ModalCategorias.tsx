import { useEffect, useState } from 'react';
import { Table, FormControl, Modal, FormCheck, Button } from 'react-bootstrap';
import Sucursal from '../../models/Sucursal';
import Categoria from '../../models/Categoria';
import { getArbolCategorias } from '../../services/CategoriaApi';
import { saveSucursal } from '../../services/SucursalApi';

interface ModalProps {
    onlyShowCategorias: boolean;
    selectedSucursal: Sucursal;
    showModalCategorias: boolean;
    handleClose: () => void;
}

export const ModalCategorias: React.FC<ModalProps> = ({ onlyShowCategorias, selectedSucursal, showModalCategorias, handleClose }) => {

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<Categoria[]>([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        if (onlyShowCategorias && selectedSucursal.categorias) {
            setCategorias(selectedSucursal.categorias)
        } else {
            if (selectedSucursal.categorias) setCategoriasSeleccionadas(selectedSucursal.categorias)
            getArbolCategorias().then(c => setCategorias(renderCategorias(c)))
        }
    }, [onlyShowCategorias, selectedSucursal]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const handleCloseAndClear = () => {
        handleClose();
        setCategoriasSeleccionadas([])
        setFiltro('')
    };

    const GuardarCategorias = async () => {
        selectedSucursal.categorias = categoriasSeleccionadas
        await saveSucursal(selectedSucursal);
        handleClose();
        setCategoriasSeleccionadas([])
    };

    const renderCategorias = (categorias: Categoria[]): Categoria[] => {
        const todasCategorias: Categoria[] = [];
        const agregarCategorias = (categorias: Categoria[]) => {
            categorias.filter(c => !c.eliminado).forEach(categoria => {
                todasCategorias.push(categoria);
                if (categoria.subCategorias) {
                    agregarCategorias(categoria.subCategorias);
                }
            });
        };
        agregarCategorias(categorias);

        return todasCategorias;
    };

    const filteredCategorias = categorias.filter(c =>
        c.codigo.toString().includes(filtro) ||
        c.denominacion.toLowerCase().includes(filtro.toLowerCase())
    );


    const handleSelectChange = (c: Categoria, isChecked: boolean) => {
        if (isChecked) {
            setCategoriasSeleccionadas([...categoriasSeleccionadas, c]);
        } else {
            setCategoriasSeleccionadas(categoriasSeleccionadas.filter(item => item.id !== c.id));
        }
    };

    const isCategoriaSeleccionada = (categoriaId: number) => {
        return categoriasSeleccionadas.some(c => c.id === categoriaId);
    };

    return (
        <Modal show={showModalCategorias} onHide={handleCloseAndClear}
            size="xl" style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header style={{ backgroundColor: 'gainsboro' }} closeButton>
                <Modal.Title>Categorias</Modal.Title>
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
                            {!onlyShowCategorias && <th style={{ maxWidth: "100px" }}>Seleccionar</th>}
                            <th>Codigo</th>
                            <th>Denominacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategorias.map((c: Categoria, index) =>
                            <tr key={index}>
                                {!onlyShowCategorias && <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <FormCheck type="checkbox" name="agregar"
                                        checked={isCategoriaSeleccionada(c.id)}
                                        onChange={(e) => handleSelectChange(c, e.target.checked)} />
                                </td>}
                                <td>{c.codigo}</td>
                                <td>{c.denominacion}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>

            {!onlyShowCategorias &&
                <Modal.Footer style={{ backgroundColor: 'gainsboro' }}>
                    <Button style={{ backgroundColor: '#83CA6A' }} onClick={GuardarCategorias}>Cerrar y Guardar</Button>
                </Modal.Footer>
            }
        </Modal>
    );
}
