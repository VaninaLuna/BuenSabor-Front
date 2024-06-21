import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import Categoria from '../../models/Categoria';
import { getArbolCategorias } from '../../services/CategoriaApi';
import UnidadMedida from '../../models/UnidadMedida';
import { getUMByEstaEliminado } from '../../services/UnidadMedidaApi';
import { getArticuloManufacturadoPorID, saveArticuloManufacturado } from '../../services/ArticuloManufacturadoApi';
import ArticuloManufacturado from '../../models/ArticuloManufacturado';
import { ModalAgregarInsumo } from './ModalAgregarInsumo';
import ArticuloInsumo from '../../models/ArticuloInsumo';

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    selectedId?: number | null;
    getListadoArticulosManufacturados: () => void;
}

export const ModalArticuloManufacturado: React.FC<ModalProps> = ({ showModal, handleClose, editing, selectedId, getListadoArticulosManufacturados }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidades, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [manufacturado, setArticuloManufacturado] = useState<ArticuloManufacturado>(new ArticuloManufacturado());
    const [imagenes, setImagenes] = useState<string[]>(['']);
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const [showModalInsumos, setShowModalInsumos] = useState(false);

    const handleCloseAndClear = () => {
        setImagenes(['']);
        setTxtValidacion("");
        setArticuloManufacturado(new ArticuloManufacturado());
        handleClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number) => {
        const newImagenes = [...imagenes];
        newImagenes[index] = e.target.value;
        setImagenes(newImagenes);
        setTxtValidacion("");
    };

    const handleAddImage = () => {
        setImagenes([...imagenes, '']);
    };

    const handleCantidadInsumoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number) => {
        const newCantidad = e.target.value;
        setArticuloManufacturado(prevState => {
            const nuevosDetalles = [...prevState.articuloManufacturadoDetalles];
            nuevosDetalles[index].cantidad = Number(newCantidad);
            return { ...prevState, articuloManufacturadoDetalles: nuevosDetalles };
        });
    };

    const handleRemoveInsumo = (index: number) => {
        setArticuloManufacturado(prevState => {
            const nuevosDetalles = [...prevState.articuloManufacturadoDetalles];
            nuevosDetalles.splice(index, 1); // Eliminar el insumo en el índice especificado
            return { ...prevState, articuloManufacturadoDetalles: nuevosDetalles };
        });
    };

    const handleRemoveImagen = (index: number) => {
        if (index > 0) {
            setImagenes(prevState => {
                const nuevasImagenes = [...prevState];
                nuevasImagenes.splice(index, 1); // Eliminar las imagenes en el índice especificado
                return nuevasImagenes;
            });
        }

    };

    useEffect(() => {
        getArbolCategorias()
            .then(data => {
                setCategorias(renderCategorias(data))
            })
            .catch(e => console.error(e));

        getUMByEstaEliminado(false)
            .then(data => setUnidadesMedida(data))
            .catch(e => console.error(e));
    }, []);

    useEffect(() => {
        if (showModal) {
            if (selectedId) {
                getArticuloManufacturadoPorID(selectedId) // Editar artículo existente
                    .then(data => {
                        setArticuloManufacturado(data);
                        setImagenes(data.imagenes.map(img => img.url));
                    })
                    .catch(e => console.error(e));
            } else {
                setArticuloManufacturado(new ArticuloManufacturado()); // Crear nuevo artículo
                setImagenes(['']);
            }
        }
    }, [showModal, selectedId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value: string | boolean;
        if (e.target.type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked;
        } else {
            value = e.target.value;
        }
        setTxtValidacion("");
        if (e.target.name === 'categoria') {
            const selectedCategoria = categorias.find(categoria => categoria.id === Number(value));
            if (selectedCategoria) {
                setArticuloManufacturado({ ...manufacturado, categoria: selectedCategoria });
            }
        } else if (e.target.name === 'unidadMedida') {
            const selectedUnidadMedida = unidades.find(unidad => unidad.id === Number(value));
            if (selectedUnidadMedida) {
                setArticuloManufacturado({ ...manufacturado, unidadMedida: selectedUnidadMedida });
            }
        } else {
            setArticuloManufacturado({ ...manufacturado, [e.target.name]: value });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (manufacturado?.denominacion === undefined || manufacturado.denominacion === "") {
            setTxtValidacion("Debe ingresar una denominacion");
            return;
        }
        if (manufacturado.precioVenta === undefined || manufacturado.precioVenta === 0) {
            setTxtValidacion("Debe ingresar un precio de venta");
            return;
        }
        if (!manufacturado.imagenes || imagenes.every(url => url === "")) {
            setTxtValidacion("Debe ingresar al menos una imagen");
            return;
        }
        console.log(manufacturado.articuloManufacturadoDetalles)
        if (manufacturado.articuloManufacturadoDetalles.length <= 0) {
            setTxtValidacion("Debe ingresar al menos un insumo al detalle");
            return;
        }
        if (manufacturado && manufacturado.articuloManufacturadoDetalles && !manufacturado.articuloManufacturadoDetalles.every(d => d.cantidad > 0)) {
            setTxtValidacion("La cantidad del insumo debe ser mayor  a CERO");
            return;
        }
        if (manufacturado.unidadMedida.denominacion === undefined || manufacturado.unidadMedida.denominacion === "") {
            setTxtValidacion("Debe ingresar una unidad de medida");
            return;
        }
        if (manufacturado.categoria.denominacion === undefined || manufacturado.categoria.denominacion === "") {
            setTxtValidacion("Debe ingresar una categoria");
            return;
        }
        if (manufacturado.descripcion === undefined || manufacturado.descripcion === "") {
            setTxtValidacion("Debe ingresar un descripcion");
            return;
        }
        if (manufacturado.tiempoEstimadoMinutos === undefined || manufacturado.tiempoEstimadoMinutos === 0) {
            setTxtValidacion("Debe ingresar un tiempoEstimadoMinutos");
            return;
        }
        if (manufacturado.preparacion === undefined || manufacturado.preparacion === "") {
            setTxtValidacion("Debe ingresar una preparacion");
            return;
        }
        const nuevasImagenes = imagenes.map((url) => ({ id: 0, url }));
        const manufacturadoActualizado = { ...manufacturado };
        manufacturadoActualizado.imagenes = nuevasImagenes;
        setArticuloManufacturado(manufacturadoActualizado);
        console.log(manufacturadoActualizado);
        await saveArticuloManufacturado(manufacturadoActualizado);

        handleCloseAndClear()
        getListadoArticulosManufacturados()
    };

    const agregarInsumoModal = () => {
        setShowModalInsumos(true);
    };

    const handleCloseInsumos = (items: ArticuloInsumo[]) => {
        const nuevosDetalles = items.map(item => ({
            id: 0,
            articuloInsumo: item,
            cantidad: 0
        }));

        setArticuloManufacturado(prevState => ({
            ...prevState,
            articuloManufacturadoDetalles: [...prevState.articuloManufacturadoDetalles, ...nuevosDetalles]
        }));

        setShowModalInsumos(false);
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


    return (
        <Modal show={showModal} onHide={handleCloseAndClear} size="xl">
            <ModalAgregarInsumo
                handleCloseInsumos={handleCloseInsumos}
                showModalInsumos={showModalInsumos}
            />
            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Editar' : 'Añadir'} Artículo Manufacturado</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" name="denominacion" value={manufacturado?.denominacion} onChange={handleInputChange} />
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control type="number" name="precioVenta" value={manufacturado?.precioVenta} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Tiempo Estimado en Minutos</Form.Label>
                            <Form.Control type="number" name="tiempoEstimadoMinutos" value={manufacturado?.tiempoEstimadoMinutos} onChange={handleInputChange} />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripcion</Form.Label>
                        <Form.Control type="text" name="descripcion" value={manufacturado?.descripcion} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Preparacion</Form.Label>
                        <Form.Control type="text" name="preparacion" value={manufacturado?.preparacion} onChange={handleInputChange} />
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select aria-label="Default select example" name="categoria" value={manufacturado?.categoria?.id || 0} onChange={handleInputChange}>
                                <option value={0}>Seleccionar Categoria</option>
                                {categorias.map((categoria: Categoria) =>
                                    <option key={categoria.id} value={categoria.id}>{categoria.codigo} {categoria.denominacion}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Unidad de medida</Form.Label>
                            <Form.Select aria-label="Default select example" name="unidadMedida" value={manufacturado?.unidadMedida?.id || 0} onChange={handleInputChange}>
                                <option value={0}>Seleccionar Unidad de medida</option>
                                {unidades.map((unidad: UnidadMedida) =>
                                    <option key={unidad.id} value={unidad.id}> {unidad.denominacion} </option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    {manufacturado.articuloManufacturadoDetalles.map((detalle, index) => (
                        <Row key={index}>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Insumo {index + 1}</Form.Label>
                                <Form.Control type="insumo" name="insumo" value={detalle.articuloInsumo.denominacion}
                                    onChange={e => handleCantidadInsumoChange(e, index)} disabled />
                            </Form.Group>
                            <Form.Group as={Col} xs="auto" className="mb-3">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="number" name="cantidad" style={{ width: '150px' }} value={detalle.cantidad} onChange={e => handleCantidadInsumoChange(e, index)} />
                            </Form.Group>

                            <Form.Group as={Col} xs="auto" className="mb-8">
                                <Form.Label>Unidad de Medida</Form.Label>
                                <Form.Control type="text" name="unidad" style={{ width: '150px' }} value={detalle.articuloInsumo.unidadMedida.denominacion} readOnly />
                            </Form.Group>
                            <Col xs="auto">
                                <Button variant="danger" style={{ marginTop: '32px' }} onClick={() => handleRemoveInsumo(index)}>X</Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="secondary" style={{ marginBottom: '10px' }} onClick={agregarInsumoModal}>Agregar Insumo</Button>
                    {imagenes.map((imagen, index) => (
                        <Row key={index}>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Agregar URL de la Imagen {index + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`urlImagen${index}`}
                                    value={imagen}
                                    onChange={e => handleImageChange(e, index)}
                                />
                            </Form.Group>
                            <Col xs="auto">
                                <Button variant="danger" style={{ marginTop: '32px' }} onClick={() => handleRemoveImagen(index)}>X</Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="secondary" onClick={handleAddImage}>Agregar otra imagen</Button>
                    <div>
                        <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleCloseAndClear}>Cancelar</Button>
                <Button style={{ backgroundColor: '#83CA6A' }} onClick={handleSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
};