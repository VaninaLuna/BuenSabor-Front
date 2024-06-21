import { Button, Modal } from "react-bootstrap";
import Pedido from "../../models/Pedido";

interface ModalProps {
    showModal: boolean;
    handleClose: () => void;
    pedido: Pedido | null;
    message: string | null;
}

export const ModalMensaje: React.FC<ModalProps> = ({ showModal, handleClose, pedido, message }) => {
    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Pedido</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {pedido && pedido.id ? (
                        <>
                            <p>El pedido <b>n°{pedido.id}</b> se creo correctamente</p>
                            <p>Hora estimada de entrega: <b>{pedido.horaEstimadaFinalizacion}</b></p>
                            <p>El total del pedido es de <b>${pedido.total}</b></p>
                        </>
                    )
                        : <p>{message}</p>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}