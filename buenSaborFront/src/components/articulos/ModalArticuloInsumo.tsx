import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Categoria from '../../models/Categoria';
import { getArbolCategorias } from '../../services/CategoriaApi';
import UnidadMedida from '../../models/UnidadMedida';
import { getUMByEstaEliminado } from '../../services/UnidadMedidaApi';
import ArticuloInsumo from '../../models/ArticuloInsumo';
import { getArticuloInsumoPorID, saveArticuloInsumo } from '../../services/ArticuloInsumoApi';

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    selectedId?: number | null;
    getListadoArticulosInsumos: () => void;
}

export const ModalArticuloInsumo: React.FC<ModalProps> = ({ showModal, handleClose, editing, selectedId, getListadoArticulosInsumos }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidades, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [insumo, setArticuloInsumo] = useState<ArticuloInsumo>(new ArticuloInsumo());
    const [imagenes, setImagenes] = useState<string[]>(['']);
    const [nuevaCategoria, setNuevaCategoria] = useState<string>("");
    const [nuevaUnidad, setNuevaUnidad] = useState<string>("");
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    const handleCloseAndClear = () => {
        setImagenes(['']);
        setTxtValidacion("");
        setArticuloInsumo(new ArticuloInsumo())
        handleClose();
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number) => {
        const newImagenes = [...imagenes];
        newImagenes[index] = e.target.value;
        setImagenes(newImagenes);

        // Limpiamos el mensaje de validación
        setTxtValidacion("");
    }

    const handleAddImage = () => {
        setImagenes([...imagenes, '']);
    }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!selectedId) {
            setArticuloInsumo(new ArticuloInsumo());
        } else {
            getArticuloInsumoPorID(selectedId)
                .then(data => {
                    setArticuloInsumo(data)
                    setImagenes(data.imagenes.map(img => img.url));
                })
                .catch(e => console.error(e));
        }
    }, [selectedId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value: string | boolean;

        if (e.target.type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked;
        } else {
            value = e.target.value;
        }

        // Limpiamos el mensaje de validación
        setTxtValidacion("");

        if (e.target.name === 'categoriaNueva') {
            setNuevaCategoria(value as string)
        } else if (e.target.name === 'unidadNueva') {
            setNuevaUnidad(value as string)
        } else if (e.target.name === 'categoria') {
            const selectedCategoria = categorias.find(categoria => categoria.id === Number(value));
            if (selectedCategoria) {
                setArticuloInsumo({ ...insumo, categoria: selectedCategoria });
            }
        } else if (e.target.name === 'unidadMedida') {
            const selectedUnidadMedida = unidades.find(unidad => unidad.id === Number(value));
            if (selectedUnidadMedida) {
                setArticuloInsumo({ ...insumo, unidadMedida: selectedUnidadMedida });
            }
        } else {
            setArticuloInsumo({ ...insumo, [e.target.name]: value });
        }
    };

    // Manejador de envío del formulario
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (insumo?.denominacion === undefined || insumo.denominacion === "") {
            setTxtValidacion("Debe ingresar una denominacion");
            return;
        }
        if (insumo.precioVenta === undefined || insumo.precioVenta === 0) {
            setTxtValidacion("Debe ingresar un precio de venta");
            return;
        }
        if (!insumo.imagenes || imagenes.every(url => url === "")) {
            setTxtValidacion("Debe ingresar al menos una imagen");
            return;
        }
        if (insumo.unidadMedida.denominacion === undefined || insumo.unidadMedida.denominacion === "") {
            setTxtValidacion("Debe ingresar una unidad de medida");
            return;
        }
        if (insumo.categoria.denominacion === undefined || insumo.categoria.denominacion === "") {
            setTxtValidacion("Debe ingresar una categoria");
            return;
        }
        if (insumo.precioCompra === undefined || insumo.precioCompra === 0) {
            setTxtValidacion("Debe ingresar un precioCompra");
            return;
        }
        if (insumo.stockActual === undefined || insumo.stockActual === 0) {
            setTxtValidacion("Debe ingresar un stock Actual");
            return;
        }
        if (insumo.stockMaximo === undefined || insumo.stockMaximo === 0) {
            setTxtValidacion("Debe ingresar un stock Maximo");
            return;
        }
        if (insumo.stockActual > insumo.stockMaximo) {
            setTxtValidacion("El stock actual no debe superar al stock maximo");
            return;
        }


        // Creas nuevos objetos de imagen con las URLs proporcionadas
        const nuevasImagenes = imagenes.map((url) => ({ id: 0, url }));
        console.log("NUEVAS IMAGENES" + JSON.stringify(nuevasImagenes))

        // Creas una copia del estado del insumo
        const insumoActualizado = { ...insumo };

        // Actualizas la copia del insumo
        insumoActualizado.imagenes = nuevasImagenes;

        // Luego, asignas el array de nuevas imágenes al estado del insumo
        setArticuloInsumo(insumoActualizado);

        console.log(JSON.stringify(insumoActualizado));
        await saveArticuloInsumo(insumoActualizado);

        handleCloseAndClear()
        getListadoArticulosInsumos()

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
            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Editar' : 'Añadir'} Artículo Insumo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" name="denominacion" value={insumo?.denominacion} onChange={handleInputChange} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio de Compra</Form.Label>
                                <Form.Control type="number" name="precioCompra" value={insumo?.precioCompra} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio de Venta</Form.Label>
                                <Form.Control type="number" name="precioVenta" value={insumo?.precioVenta} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock Actual</Form.Label>
                                <Form.Control type="number" name="stockActual" value={insumo?.stockActual} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock Maximo</Form.Label>
                                <Form.Control type="number" name="stockMaximo" value={insumo?.stockMaximo} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                            label="¿Es para elaborar?"
                            name="esParaElaborar"
                            checked={insumo?.esParaElaborar}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Select aria-label="Default select example" name="categoria"
                                    value={insumo?.categoria?.id || 0}
                                    onChange={handleInputChange}
                                    hidden={nuevaCategoria.length !== 0}>
                                    <option value={0}>Seleccionar Categoria</option>
                                    {/* {renderCategorias(categoriasPadre)} */}
                                    {categorias.map((categoria: Categoria) =>
                                        <option key={categoria.id} value={categoria.id}>{categoria.codigo} {categoria.denominacion}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Unidad de medida</Form.Label>
                                <Form.Select aria-label="Default select example" name="unidadMedida" value={insumo?.unidadMedida.id} onChange={handleInputChange} hidden={nuevaUnidad.length != 0}>
                                    <option value={0}>Seleccionar Unidad de medida</option>
                                    {unidades.map((unidad: UnidadMedida) =>
                                        <option key={unidad.id} value={unidad.id}> {unidad.denominacion} </option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    {imagenes.map((imagen, index) => (
                        <Row key={index}>
                            <Form.Group as={Col} className="mb-3" >
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