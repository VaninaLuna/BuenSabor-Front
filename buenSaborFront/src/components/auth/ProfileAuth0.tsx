import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { UsuarioCliente } from "../../models/Usuario";
import Cliente from "../../models/Cliente";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import { getLocalidadesPorProvincia } from "../../services/LocalidadApi";
import Pais from "../../models/Pais";
import Provincia from "../../models/Provincia";
import Localidad from "../../models/Localidad";
import Domicilio from "../../models/Domicilio";
import { updateData } from "../../services/UsuarioClienteAPI";
import { getPaises } from "../../services/PaisAPI";
import { getPronviciasPorPais } from "../../services/ProvinciaAPI";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuario: UsuarioCliente = JSON.parse(jsonUsuario) as UsuarioCliente;
    const [cliente, setCliente] = useState(new Cliente());
    const [domicilio, setDomicilio] = useState<Domicilio>(new Domicilio());

    const [fechaNacimiento, setFechaNacimiento] = useState<string>("")
    const { setAuth }: AuthContextType = useContext(AuthContext);
    const navigate = useNavigate();
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    // Estados para los elementos del combo box
    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);

    // Estados para las selecciones del usuario
    const [paisSeleccionado, setPaisSeleccionado] = useState<Pais | null>(null);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | null>(null);
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState<Localidad | null>(null);


    useEffect(() => {
        //Setea el cliente obtenido del usuario del localStorage
        setCliente(usuario.cliente);
        setDomicilio(usuario.cliente.domicilio)

        //Obtener los paises
        getPaises().then((paises) => {
            setPaises(paises);
            const paisUsuario = paises.find(p => p.id === usuario.cliente.domicilio.localidad.provincia.pais.id);
            setPaisSeleccionado(paisUsuario || null);
        });

        // Formatear la fecha para que la reconozca el input YYYY-MM-DD
        const formattedDate = moment(usuario.cliente.fechaNacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD');
        setFechaNacimiento(formattedDate);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Obtener las provincias cuando el usuario selecciona un país
    useEffect(() => {
        if (paisSeleccionado) {
            getPronviciasPorPais(paisSeleccionado.id).then((provincias) => {
                setProvincias(provincias);
                const provinciaUsuario = provincias.find(p => p.id === usuario.cliente.domicilio.localidad.provincia.id);
                setProvinciaSeleccionada(provinciaUsuario || null);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paisSeleccionado]);

    // Obtener las localidades cuando el usuario selecciona una provincia
    useEffect(() => {
        if (provinciaSeleccionada) {
            getLocalidadesPorProvincia(provinciaSeleccionada.id).then((localidades) => {
                setLocalidades(localidades);
                const localidadUsuario = localidades.find(l => l.id === usuario.cliente.domicilio.localidad.id);
                setLocalidadSeleccionada(localidadUsuario || null);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinciaSeleccionada]);


    if (isLoading) {
        return <div>Loading ...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value: string = e.target.value;

        if (e.target.name === 'calle' || e.target.name === 'numero' || e.target.name === 'cp') {
            setDomicilio({ ...domicilio, [e.target.name]: value })

            // Si el campo que cambió es 'fechaNacimiento', actualizar el estado de fechaNacimiento
        } else if (e.target.name === 'fechaNacimiento') {
            setFechaNacimiento(value);
        } else {
            setCliente({ ...cliente, [e.target.name]: value });
        }
    }

    const validarFormulario = () => {
        if (!cliente.apellido) {
            setTxtValidacion("Debe ingresar un apellido");
            return false;
        }
        if (!fechaNacimiento) {
            setTxtValidacion("Debe ingresar una fecha de nacimiento");
            return false;
        }
        if (!cliente.telefono) {
            setTxtValidacion("Debe ingresar un teléfono");
            return false;
        }
        if (!domicilio.calle) {
            setTxtValidacion("Debe ingresar una calle");
            return false;
        }
        if (!domicilio.numero) {
            setTxtValidacion("Debe ingresar un número");
            return false;
        }
        if (!domicilio.cp) {
            setTxtValidacion("Debe ingresar un código postal");
            return false;
        }
        if (!paisSeleccionado) {
            setTxtValidacion("Debe seleccionar un país");
            return false;
        }
        if (!provinciaSeleccionada) {
            setTxtValidacion("Debe seleccionar una provincia");
            return false;
        }
        if (!localidadSeleccionada) {
            setTxtValidacion("Debe seleccionar una localidad");
            return false;
        }
        return true;
    };

    const handleSave = async () => {

        if (!validarFormulario()) return;

        //Obtenemos los objetos actualizados
        const newUsuario = JSON.parse(JSON.stringify(usuario)) as UsuarioCliente;
        const newCliente = JSON.parse(JSON.stringify(cliente)) as Cliente;
        const newDomicilio = JSON.parse(JSON.stringify(domicilio)) as Domicilio;
        const newLocalidad = JSON.parse(JSON.stringify(localidadSeleccionada)) as Localidad;

        //colcar la localidad seleccionada en el domicilio
        newDomicilio.localidad = newLocalidad;

        // Formatear fecha de nacimiento
        newCliente.fechaNacimiento = moment(fechaNacimiento, 'YYYY-MM-DD').format('DD/MM/YYYY');
        newCliente.domicilio = newDomicilio

        console.log(JSON.stringify(newCliente))

        newUsuario.cliente = newCliente

        await updateData(newUsuario);
        //Actualizar el usuario en el localStorage
        setAuth({ usuario: newUsuario });

        navigate("/home");

    };

    return (
        user && isAuthenticated && (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <h1 style={{
                        color: "whitesmoke",
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px',
                        padding: '15px 15px',
                        display: 'inline-block'
                    }}>Perfil del usuario</h1>
                </div>

                <Row className="mt-4 mb-3 justify-content-center">
                    <img
                        src={user.picture}
                        alt={user.name}
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
                            <h3 className="mb-4">Datos del usuarios</h3>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={cliente.email} readOnly />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" value={cliente.nombre} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control type="text" name="apellido" value={cliente?.apellido || ""} onChange={handleInputChange} readOnly={usuario?.cliente.apellido ? true : false} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Nacimiento</Form.Label>
                                <Form.Control type="date" name="fechaNacimiento" value={fechaNacimiento || ""} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text" name="telefono" value={cliente?.telefono || ""} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col md={5} className="mx-auto">
                            <h3 className="mb-4">Domicilio</h3>
                            <Form.Group className="mb-3">
                                <Form.Label>Calle</Form.Label>
                                <Form.Control type="text" name="calle" value={domicilio?.calle} onChange={handleInputChange} />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Numero</Form.Label>
                                        <Form.Control type="number" name="numero" value={domicilio?.numero} onChange={handleInputChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>CP</Form.Label>
                                        <Form.Control type="number" name="cp" value={domicilio?.cp} onChange={handleInputChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Pais</Form.Label>
                                <Form.Control as="select" value={paisSeleccionado?.id || ''} onChange={e => setPaisSeleccionado(paises.find(pais => pais.id === Number(e.target.value)) || null)}>
                                    <option value="">Seleccione un país</option>
                                    {paises.map(pais => (
                                        <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Provincia</Form.Label>
                                        <Form.Control as="select" value={provinciaSeleccionada?.id || ''} onChange={e => setProvinciaSeleccionada(provincias.find(provincia => provincia.id === Number(e.target.value)) || null)}>
                                            <option value="">Seleccione una provincia</option>
                                            {provincias.map(provincia => (
                                                <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Localidad</Form.Label>
                                        <Form.Control as="select" value={localidadSeleccionada?.id || ''} onChange={e => setLocalidadSeleccionada(localidades.find(localidad => localidad.id === Number(e.target.value)) || null)}>
                                            <option value="">Seleccione una localidad</option>
                                            {localidades.map(localidad => (
                                                <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
                                            ))}
                                        </Form.Control>
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
                        }} onClick={handleSave}>Guardar Cambios</button>
                    </div>

                    <div>
                        <p style={{ color: 'red', lineHeight: 5, padding: 5, fontSize: "20px" }}>{txtValidacion}</p>
                    </div>
                </Form>
            </>
        )
    );
};

export default Profile;