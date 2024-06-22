import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { getEmpresaPorID, saveEmpresa } from "../../services/EmpresaApi";
import Empresa from "../../models/Empresa";
import Logo from "./../../assets/images/buensa.jpg"
import { useNavigate } from "react-router-dom";
import { ModalSucursal } from "./ModalSucursal";

const ProfileEmpresa = () => {
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const [empresa, setEmpresa] = useState<Empresa>(new Empresa());
    const navigate = useNavigate()
    const [showModalSucursal, setShowModalSucursal] = useState(false);

    useEffect(() => {
        getEmpresaPorID(1)
            .then(data => {
                setEmpresa(data)

            })
            .catch(e => console.error(e));
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string = "";

        value = e.target.value;

        setTxtValidacion("");

        setEmpresa({ ...empresa, [e.target.name]: value });
    };


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
    };

    const handleShowSucursales = () => {
        navigate('/sucursales')
    };

    const handleOpenCreateSucursal = () => {
        setShowModalSucursal(true);
    };

    const handleCloseSucursal = () => {
        setShowModalSucursal(false);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <h1 style={{
                    color: "whitesmoke",
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px',
                    padding: '15px 15px',
                    display: 'inline-block'
                }}>Perfil Empresa</h1>
            </div>
            <ModalSucursal
                handleCloseSucursal={handleCloseSucursal}
                showModal={showModalSucursal}
                editing={false}
                selectedIdEmpresa={1}
            />

            <Row className="mt-4 mb-3 justify-content-center">
                <img
                    src={Logo}
                    alt="BuenSabor"
                    style={{
                        maxWidth: "210px",
                        maxHeight: "210px",
                        borderRadius: "50%",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        margin: "0 auto",
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: "25px"
                    }}
                />
            </Row>

            <Form style={{
                color: "whitesmoke",
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '20px',
                borderRadius: '10px',
                margin: "auto"
            }}>
                <Row className="justify-content-center">
                    <Col md={5} className="mx-auto">
                        <h3 className="mb-4">Datos de la Empresa</h3>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombre" value={empresa?.nombre || ""} onChange={handleInputChange} />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Razon Social</Form.Label>
                                    <Form.Control type="text" name="razonSocial" value={empresa?.razonSocial || ""} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cuil</Form.Label>
                                    <Form.Control type="text" name="cuil" value={empresa?.cuil || ""} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button type="button" style={{
                        backgroundColor: '#EE7F46',
                        border: '#EE7F46',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }} onClick={handleSubmit}>Guardar Cambios</button>
                </div>

                <div style={{ textAlign: "end" }}>
                    <Button variant="outline-success" style={{ maxHeight: "40px", marginRight: '10px' }} onClick={() => { handleOpenCreateSucursal() }}>Agregar Sucursal</Button>
                    <Button variant="outline-info" style={{ maxHeight: "40px" }} onClick={() => { handleShowSucursales() }}>Ver Sucursales</Button>
                </div>
                <div>
                    <p style={{ color: 'red', lineHeight: 5, padding: 5, fontSize: "20px" }}>{txtValidacion}</p>
                </div>
            </Form>
        </>
    );
};

export default ProfileEmpresa;