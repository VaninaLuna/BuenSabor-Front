import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getEmpresaPorID, saveEmpresa } from '../../services/EmpresaApi';
import Empresa from '../../models/Empresa';

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    editing?: boolean;
    selectedId?: number | null;
    getListadoEmpresas: () => void;
}

export const ModalEmpresa: React.FC<ModalProps> = ({ showModal, handleClose, editing, selectedId, getListadoEmpresas }) => {

    const [empresa, setEmpresa] = useState<Empresa>(new Empresa());
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    const handleCloseAndClear = () => {
        setTxtValidacion("");
        handleClose();
        setEmpresa(new Empresa())
    };

    useEffect(() => {
        if (!selectedId) {
            setEmpresa(new Empresa());
        } else {
            getEmpresaPorID(selectedId)
                .then(data => {
                    setEmpresa(data)

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
        setTxtValidacion("");

        setEmpresa({ ...empresa, [e.target.name]: value });
    };

    // Manejador de envío del formulario
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (empresa?.nombre === undefined || empresa.nombre === "") {
            setTxtValidacion("Debe ingresar un nombre");
            return;
        }
        if (empresa.razonSocial === undefined || empresa.razonSocial === "") {
            setTxtValidacion("Debe ingresar una razon social");
            return;
        }
        if (empresa.cuil === undefined || empresa.cuil === "") {
            setTxtValidacion("Debe ingresar un cuil");
            return;
        }


        // Creas una copia del estado del insumo
        const empresaActualizada = { ...empresa };



        // Luego, asignas el array de nuevas imágenes al estado del insumo
        setEmpresa(empresaActualizada);

        console.log(JSON.stringify(empresaActualizada));
        await saveEmpresa(empresaActualizada);

        handleCloseAndClear()
        getListadoEmpresas()
    };

    return (
        <Modal show={showModal} onHide={handleCloseAndClear} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Editar' : 'Añadir'} Empresa</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="nombre" value={empresa?.nombre} onChange={handleInputChange} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Razon Social</Form.Label>
                                <Form.Control type="text" name="razonSocial" value={empresa?.razonSocial} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Cuil</Form.Label>
                                <Form.Control type="text" name="cuil" value={empresa?.cuil} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
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