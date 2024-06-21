import { Modal } from "react-bootstrap";
import { Button, Form, Row, Col } from 'react-bootstrap';

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    selectedId?: number | null;
}

export const ModalPromociones: React.FC<ModalProps> = ({ showModal, handleClose }) => {
    const handleCloseAndClear = () => {
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleCloseAndClear} size="xl">
            <Modal.Header closeButton>
                <Modal.Title> Promocion</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" name="denominacion" />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Desde</Form.Label>
                                <Form.Control type="time" name="Fechadesde" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Hasta</Form.Label>
                                <Form.Control type="time" name="Fechahasta" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Hora Desde</Form.Label>
                                <Form.Control type="time" name="horaDesde" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Hora Hasta</Form.Label>
                                <Form.Control type="time" name="horaHasta" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion del Descuento</Form.Label>
                        <Form.Control type="text" name="denominacionDescuento" />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control type="number" name="precio" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Promocion</Form.Label>
                                <Form.Select aria-label="Default select example" name="tipoPromocion">
                                    <option value={0}>Seleccionar tipo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleCloseAndClear}>Cancelar</Button>
                <Button style={{ backgroundColor: '#83CA6A' }}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
}