import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import UnidadMedida from '../../models/UnidadMedida';
import { getUnidadMedidaPorID, saveUnidadMedida } from '../../services/UnidadMedidaApi';

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    selectedId?: number | null;
    getListadoUMedidas: () => void;
}

export const ModalUnidadMedida: React.FC<ModalProps> = ({ showModal, handleClose, editing, selectedId, getListadoUMedidas }) => {

    const [uMedida, setUnidadMedida] = useState<UnidadMedida>(new UnidadMedida());
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    const handleCloseAndClear = () => {
        handleClose();
        setTxtValidacion("");
        setUnidadMedida(new UnidadMedida());
    };

    useEffect(() => {
        if (!selectedId) {
            setUnidadMedida(new UnidadMedida());
        } else {
            getUnidadMedidaPorID(selectedId).then(data => {
                setUnidadMedida(data)
            })
                .catch(e => console.error(e));
        }
    }, [selectedId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Limpiamos el mensaje de validación
        setTxtValidacion("");

        setUnidadMedida({ ...uMedida, [e.target.name]: e.target.value });
    };

    // Manejador de envío del formulario
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (uMedida?.denominacion === undefined || uMedida.denominacion === "") {
            setTxtValidacion("Debe ingresar una denominacion");
            return;
        }

        // Luego, asignas el array de nuevas imágenes al estado del insumo
        setUnidadMedida(uMedida);

        console.log(JSON.stringify(uMedida));
        await saveUnidadMedida(uMedida);

        getListadoUMedidas();
        handleCloseAndClear();
    };

    return (
        <Modal show={showModal} onHide={handleCloseAndClear}>
            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Editar' : 'Añadir'} UnidadMedida</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" name="denominacion" value={uMedida?.denominacion} onChange={handleInputChange} />
                    </Form.Group>
                    <div>
                        <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                    </div>
                    <Button style={{ backgroundColor: '#83CA6A' }} type="submit">
                        Guardar
                    </Button>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAndClear}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};