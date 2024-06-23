import { useEffect, useState } from "react";
import { Button, Image, Table } from "react-bootstrap";
import { ModalPromociones } from "./ModalPromociones";
import Promocion from "../../models/Promocion";
import { deletePromocionPorID, getPromociones } from "../../services/PromocionApi";
import { RolName } from "../../models/RolName";
import { UsuarioCliente } from "../../models/Usuario";
export function Promociones() {

    const [promociones, setPromociones] = useState<Promocion[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    const handleOpenCreate = () => {
        setShowModal(true);
        setEditing(false);
        setSelectedId(null);
    };

    const handleOpenEdit = () => {
        setShowModal(true);
        setEditing(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditing(false);
        setSelectedId(null);
    };


    const getListadoPromociones = async () => {
        const datos: Promocion[] = await getPromociones();
        setPromociones(datos);

    };

    const deletePromocion = async (id: number) => {
        await deletePromocionPorID(id);
        getListadoPromociones();
    };

    useEffect(() => {
        getListadoPromociones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h1 style={{ marginTop: '20px', color: "whitesmoke" }}>Promociones</h1>
                <ModalPromociones
                    handleClose={handleClose}
                    showModal={showModal}
                    editing={editing}
                    selectedId={selectedId}
                    getListadoPromociones={getListadoPromociones}
                />
                <Button size="lg" style={{ margin: 20, backgroundColor: '#EE7F46', border: '#EE7F46' }} onClick={handleOpenCreate}>
                    Crear Promocion
                </Button>

                <br />
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Denominacion</th>
                            <th>Fecha Desde</th>
                            <th>Fecha Hasta</th>
                            <th>Hora Desde</th>
                            <th>Hora Hasta</th>
                            <th>Descripcion de descuento</th>
                            <th>Precio Promocional</th>
                            {/* <th>Tipo de Promocion</th> */}
                            {usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName === RolName.ADMIN &&
                                <th>Opciones</th>
                            }
                        </tr>
                    </thead>
                    <tbody style={{ background: "whitesmoke" }}>
                        {promociones.map((promocion: Promocion, index) =>
                            <tr key={index}>
                                <td>{promocion.imagenes && promocion.imagenes[0] ?
                                    <Image src={promocion.imagenes[0].url}
                                        alt={promocion.denominacion} style={{ height: "50px", width: "50px", objectFit: 'cover' }} rounded />
                                    : 'No image'
                                }</td>
                                <td>{promocion.denominacion}</td>
                                <td>{promocion.fechaDesde}</td>
                                <td>{promocion.fechaHasta}</td>
                                <td>{promocion.horaDesde}</td>
                                <td>{promocion.horaHasta}</td>
                                <td>{promocion.descripcionDescuento}</td>
                                <td>{promocion.precioPromocional}</td>
                                {/* <td>{promocion.tipoPromocion}</td> */}
                                {usuarioLogueado && usuarioLogueado.rol && usuarioLogueado.rol.rolName === RolName.ADMIN &&
                                    <td>
                                        <Button variant="outline-warning" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => { setSelectedId(promocion.id); handleOpenEdit(); }}>Modificar</Button>
                                        <Button variant="outline-danger" style={{ maxHeight: "40px" }} onClick={() => deletePromocion(promocion.id)}>Eliminar</Button>
                                    </td>
                                }
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    )
}