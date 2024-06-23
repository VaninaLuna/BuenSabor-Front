import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form, Row, Col } from 'react-bootstrap';
import Promocion from "../../models/Promocion";
import { getPromocionPorID, savePromocion } from "../../services/PromocionApi";
import { ModalAgregarArticulos } from "./ModalAgregarArticulos";
import ArticuloDTO from "../../models/ArticuloDTO";
import moment from "moment";

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    selectedId?: number | null;
    getListadoPromociones: () => void;
}

export const ModalPromociones: React.FC<ModalProps> = ({ showModal, handleClose, editing, selectedId, getListadoPromociones }) => {

    const [promocion, setPromocion] = useState<Promocion>(new Promocion());
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    // const [tipoPromocion] = useState<string[]>(["HappyHour", "Promocion"])
    const [imagenes, setImagenes] = useState<string[]>(['']);

    const [showModalAgregar, setShowModalAgregar] = useState(false);

    const handleCloseAndClear = () => {
        setTxtValidacion("");
        setPromocion(new Promocion())
        handleClose();
    };

    useEffect(() => {
        if (!selectedId) {
            setPromocion(new Promocion())
            setImagenes(['']);
        } else {
            getPromocionPorID(selectedId)
                .then(data => {
                    setPromocion({
                        ...data,
                        fechaDesde: moment(data.fechaDesde, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        fechaHasta: moment(data.fechaHasta, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                    })
                    setImagenes(data.imagenes.map(img => img.url));
                })
                .catch(e => console.error(e));
        }
    }, [selectedId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value: string | number;

        if (e.target.type === 'number') {
            value = parseFloat(e.target.value);
        } else {
            value = e.target.value;
        }

        setPromocion({ ...promocion, [e.target.name]: value });
    };

    const handleValidaciones = (): boolean => {
        if (!promocion.denominacion) {
            setTxtValidacion("La denominación es requerida.");
            return false;
        }
        if (!promocion.fechaDesde) {
            setTxtValidacion("La fecha desde es requerida.");
            return false;
        }
        if (!promocion.fechaHasta) {
            setTxtValidacion("La fecha hasta es requerida.");
            return false;
        }
        if (new Date(promocion.fechaDesde) > new Date(promocion.fechaHasta)) {
            setTxtValidacion("La fecha desde no puede ser mayor que la fecha hasta.");
            return false;
        }
        if (!promocion.horaDesde) {
            setTxtValidacion("La hora desde es requerida.");
            return false;
        }
        if (!promocion.horaHasta) {
            setTxtValidacion("La hora hasta es requerida.");
            return false;
        }
        if (!promocion.descripcionDescuento) {
            setTxtValidacion("La descripcion del descuento es requerida.");
            return false;
        }
        if (promocion.precioPromocional <= 0) {
            setTxtValidacion("El precio promocional debe ser mayor que cero.");
            return false;
        }
        // if (!promocion.tipoPromocion || promocion.tipoPromocion === "0") {
        //     setTxtValidacion("Debe seleccionar un tipo de promoción.");
        //     return false;
        // }

        setTxtValidacion(""); // Limpia el mensaje de validación si todo es válido
        return true;
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!handleValidaciones()) return;

        const nuevasImagenes = imagenes.map((url) => ({ id: 0, url }));

        const promocionFormatted: Promocion = {
            ...promocion,
            fechaDesde: moment(promocion.fechaDesde).format('DD/MM/YYYY'),
            fechaHasta: moment(promocion.fechaHasta).format('DD/MM/YYYY'),
            imagenes: nuevasImagenes
        };

        console.log(JSON.stringify(promocionFormatted));

        await savePromocion(promocionFormatted);

        getListadoPromociones();
        handleCloseAndClear();
    };

    const handleCloseAgregar = (articulos: ArticuloDTO[]) => {
        const nuevosDetalles = articulos.map(item => ({
            id: 0,
            cantidad: 0,
            articulo: item
        }));

        setPromocion(prevState => ({
            ...prevState,
            promocionDetalles: [...prevState.promocionDetalles, ...nuevosDetalles]
        }));

        setShowModalAgregar(false);
    };

    const handleCantidadArticuloChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number) => {
        const newCantidad = e.target.value;
        setPromocion(prevState => {
            const nuevosDetalles = [...prevState.promocionDetalles];
            nuevosDetalles[index].cantidad = Number(newCantidad);
            return { ...prevState, promocionDetalles: nuevosDetalles };
        });
    };

    const handleRemoveArticulo = (index: number) => {
        setPromocion(prevState => {
            const nuevosDetalles = [...prevState.promocionDetalles];
            nuevosDetalles.splice(index, 1); // Eliminar el insumo en el índice especificado
            return { ...prevState, promocionDetalles: nuevosDetalles };
        });
    };

    const agregarArticuloModal = () => {
        setShowModalAgregar(true);
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

    const handleRemoveImagen = (index: number) => {
        if (index > 0) {
            setImagenes(prevState => {
                const nuevasImagenes = [...prevState];
                nuevasImagenes.splice(index, 1); // Eliminar las imagenes en el índice especificado
                return nuevasImagenes;
            });
        }

    };


    return (
        <Modal show={showModal} onHide={handleCloseAndClear} size="xl">

            <ModalAgregarArticulos
                handleCloseAgregar={handleCloseAgregar}
                showModalAgregar={showModalAgregar}
            />

            <Modal.Header closeButton>
                <Modal.Title> {editing ? "Editar " : "Agregra "} Promocion </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" name="denominacion" value={promocion.denominacion} onChange={handleInputChange} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Desde</Form.Label>
                                <Form.Control type="date" name="fechaDesde" value={promocion.fechaDesde} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Hasta</Form.Label>
                                <Form.Control type="date" name="fechaHasta" value={promocion.fechaHasta} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Hora Desde</Form.Label>
                                <Form.Control type="time" name="horaDesde" value={promocion.horaDesde} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Hora Hasta</Form.Label>
                                <Form.Control type="time" name="horaHasta" value={promocion.horaHasta} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion del Descuento</Form.Label>
                        <Form.Control type="text" name="descripcionDescuento" value={promocion.descripcionDescuento} onChange={handleInputChange} />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control type="number" name="precioPromocional" value={promocion.precioPromocional} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        {/* <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Promocion</Form.Label>
                                <Form.Select
                                    aria-label="Default select example"
                                    name="tipoPromocion"
                                    value={promocion.tipoPromocion}
                                    onChange={handleInputChange}
                                >
                                    <option value={0}>Seleccionar tipo</option>
                                    {tipoPromocion.map((tipo, index) => (
                                        <option key={index} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </Form.Select>

                            </Form.Group>
                        </Col> */}
                    </Row>

                    {promocion.promocionDetalles.map((detalle, index) => (
                        <Row key={index}>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Articulo {index + 1}</Form.Label>
                                <Form.Control type="insumo" name="insumo" value={detalle.articulo.denominacion}
                                    onChange={e => handleCantidadArticuloChange(e, index)} disabled />
                            </Form.Group>
                            <Form.Group as={Col} xs="auto" className="mb-3">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="number" name="cantidad" style={{ width: '150px' }} value={detalle.cantidad} onChange={e => handleCantidadArticuloChange(e, index)} />
                            </Form.Group>
                            <Col xs="auto">
                                <Button variant="danger" style={{ marginTop: '32px' }} onClick={() => handleRemoveArticulo(index)}>X</Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="secondary" style={{ marginBottom: '10px' }} onClick={agregarArticuloModal}>Agregar Articulo</Button>
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
}