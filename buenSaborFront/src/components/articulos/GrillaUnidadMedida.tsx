import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import UnidadMedida from '../../models/UnidadMedida';
import { getUMByEstaEliminado, updateEstadoEliminadoUM } from '../../services/UnidadMedidaApi';
import { ModalUnidadMedida } from './ModalUnidadMedida';
import { Button } from 'react-bootstrap';
import { UsuarioCliente } from '../../models/Usuario';
import { RolName } from '../../models/RolName';
import { ConfirmModal } from './ConfirmModal';  // Asegúrate de importar el componente

export function GrillaUnidadMedida() {
    const [showUMedidaModal, setShowUMedidaModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [uMedidas, setUMedidas] = useState<UnidadMedida[]>([]);
    //estado para alternar entre obtener datos con eliminacion logica o no
    const [eliminados, setEliminados] = useState<boolean>(false);
    //Modal Confirmar eliminacion
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;

    const getListadoUMedidas = async () => {
        const datos: UnidadMedida[] = await getUMByEstaEliminado(eliminados);
        setUMedidas(datos);

    };

    const handleOpen = async () => {
        setEditing(true);
        setShowUMedidaModal(true);
    };

    const handleClose = () => {
        setShowUMedidaModal(false);
        setEditing(false);
        setSelectedId(null);
    };

    const handleConfirmClose = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        handleConfirmClose();
    };

    const confirmUpdateEstadoDelete = (idUMedida: number, actionType: 'eliminar' | 'restaurar') => {
        setConfirmAction(() => () => updateEstadoDelete(idUMedida));
        setConfirmMessage(`¿Está seguro que desea ${actionType} ?`);
        setShowConfirmModal(true);
    };

    const updateEstadoDelete = async (idUMedida: number) => {
        await updateEstadoEliminadoUM(idUMedida);
        getListadoUMedidas();
    };

    useEffect(() => {
        getListadoUMedidas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eliminados]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: '15px 15px' }}> {eliminados ? "Unidades de Medida Eliminadas" : "Unidades de Medida"}</h1>

                {usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName === RolName.ADMIN &&
                    <Button size="lg" style={{ margin: 10, backgroundColor: '#EE7F46', border: '#EE7F46' }} onClick={() => { setSelectedId(null); handleOpen(); }}>
                        Crear Unidad de Medida
                    </Button>
                }
                <ModalUnidadMedida
                    handleClose={handleClose}
                    showModal={showUMedidaModal}
                    editing={editing}
                    selectedId={selectedId}
                    getListadoUMedidas={getListadoUMedidas}
                />

                <br />

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Denominacion</th>
                            {
                                (usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName == RolName.ADMIN) &&
                                <th style={{ minWidth: "220px" }}>Opciones</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {uMedidas.map((uMedida: UnidadMedida, index) =>
                            <tr key={index}>
                                <td>{uMedida.denominacion}</td>
                                {usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName === RolName.ADMIN &&
                                    <td>
                                        <Button variant="outline-warning" style={{ maxHeight: "40px", marginRight: '10px' }}
                                            onClick={() => { setSelectedId(uMedida.id); handleOpen(); }}>Modificar</Button>
                                        {eliminados ?
                                            <Button variant="outline-info" style={{ maxHeight: "40px" }}
                                                onClick={() => confirmUpdateEstadoDelete(uMedida.id, 'restaurar')}>Restaurar</Button>
                                            :
                                            <Button variant="outline-danger" style={{ maxHeight: "40px" }}
                                                onClick={() => confirmUpdateEstadoDelete(uMedida.id, 'eliminar')}>Eliminar</Button>
                                        }
                                    </td>
                                }
                            </tr>
                        )}
                    </tbody>
                </Table>

                <div style={{ width: '100%', display: "flex", justifyContent: 'flex-end' }}>
                    <Button size="lg" style={{ margin: 10, backgroundColor: '#478372', border: '#478372' }} onClick={() => { setEliminados(!eliminados) }}>
                        {eliminados ? "Ver Actuales" : "Ver Eliminados"}
                    </Button>
                </div>
            </div>

            <ConfirmModal
                show={showConfirmModal}
                handleClose={handleConfirmClose}
                handleConfirm={handleConfirm}
                message={confirmMessage}
            />
        </>
    );
}
