/* eslint-disable react-hooks/exhaustive-deps */
import { Accordion, Button, Col, Form, Modal, Row } from "react-bootstrap";
import Sucursal from "../../models/Sucursal";
import { useEffect, useState } from "react";
import { getSucursalPorId, saveSucursal } from "../../services/SucursalApi";
import Pais from "../../models/Pais";
import Provincia from "../../models/Provincia";
import Localidad from "../../models/Localidad";
import Domicilio from "../../models/Domicilio";
import { getLocalidadesPorProvincia } from "../../services/LocalidadApi";
import { saveDomicilio } from "../../services/DomicilioApi";
import { getEmpresaPorID } from "../../services/EmpresaApi";
import { getPronviciasPorPais } from "../../services/ProvinciaAPI";
import { getPaises } from "../../services/PaisAPI";

interface ModalProps {
    showModal: boolean;
    handleCloseSucursal: () => void;
    editing?: boolean;
    selectedIdEmpresa: number;
    selectedId?: number | null;
    getListadoSucursales?: () => void;
}

export const ModalSucursal: React.FC<ModalProps> = ({ showModal, handleCloseSucursal, editing, selectedIdEmpresa, selectedId, getListadoSucursales }) => {

    const [sucursal, setSucursal] = useState<Sucursal>(new Sucursal());
    // const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    const [pais, setPais] = useState<Pais>(new Pais())
    const [provincia, setProvincia] = useState<Provincia>(new Provincia())
    const [localidad, setLocalidad] = useState<Localidad>(new Localidad())
    const [domicilio, setDomicilio] = useState<Domicilio>(new Domicilio())

    // Estados para los elementos del combo box
    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);

    // Estados para las selecciones del usuario
    const [paisSeleccionado, setPaisSeleccionado] = useState<Pais | null>(null);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | null>(null);
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState<Localidad | null>(null);

    const handleCloseAndClear = () => {
        setTxtValidacion("");
        setSucursal(new Sucursal())
        handleCloseSucursal();
    };

    useEffect(() => {
        if (!selectedId) {
            setSucursal(new Sucursal());
        } else {
            getSucursalPorId(selectedId)
                .then(data => {
                    setSucursal(data);
                    setDomicilio(data.domicilio);
                    setLocalidad(data.domicilio.localidad);
                    setProvincia(data.domicilio.localidad.provincia);
                    setPais(data.domicilio.localidad.provincia.pais);
                })
                .catch(e => console.error(e));
        }
        //Obtener los paises
        getPaises().then((paises) => {
            setPaises(paises);
            const paisUsuario = paises.find(p => p.id === sucursal.domicilio.localidad.provincia.pais.id);
            setPaisSeleccionado(paisUsuario || null);
        });
    }, [selectedId])

    // Obtener las provincias cuando el usuario selecciona un país
    useEffect(() => {
        if (paisSeleccionado) {
            getPronviciasPorPais(paisSeleccionado.id).then((provincias) => {
                setProvincias(provincias);
                const provinciaUsuario = provincias.find(p => p.id === sucursal.domicilio.localidad.provincia.id);
                setProvinciaSeleccionada(provinciaUsuario || null);
            });
        }
    }, [paisSeleccionado]);

    // Obtener las localidades cuando el usuario selecciona una provincia
    useEffect(() => {
        if (provinciaSeleccionada) {
            getLocalidadesPorProvincia(provinciaSeleccionada.id).then((localidades) => {
                setLocalidades(localidades);
                const localidadUsuario = localidades.find(l => l.id === sucursal.domicilio.localidad.id);
                setLocalidadSeleccionada(localidadUsuario || null);
            });
        }
    }, [provinciaSeleccionada]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value: string | boolean;

        if (e.target.type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked;
        } else {
            value = e.target.value;
        }

        // Limpiamos el mensaje de validación
        setTxtValidacion("");

        if (e.target.name === 'calle') {

            const calleValue = value.toString();
            setDomicilio({ ...domicilio, [e.target.name]: calleValue })
        } else if (e.target.name === 'numero') {

            const numValue = Number(value);
            setDomicilio({ ...domicilio, [e.target.name]: numValue })
        } else if (e.target.name === 'cp') {

            const cpValue = Number(value);
            setDomicilio({ ...domicilio, [e.target.name]: cpValue })
        } else if (e.target.name === 'localidad') {

            const locValue = value.toString();
            setLocalidad({ ...localidad, nombre: locValue })

        } else if (e.target.name === 'provincia') {

            const provValue = value.toString();
            setProvincia({ ...provincia, nombre: provValue });

        } else if (e.target.name === 'pais') {

            const paisValue = value.toString();
            setPais({ ...pais, nombre: paisValue })

        } else {
            setSucursal({ ...sucursal, [e.target.name]: value });
        }
    };

    // Manejador de envío del formulario
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (sucursal?.nombre === undefined || sucursal.nombre === "") {
            setTxtValidacion("Debe ingresar un nombre");
            return;
        }
        if (sucursal.horarioApertura === undefined || sucursal.horarioApertura === "") {
            setTxtValidacion("Debe ingresar un horario de apertura");
            return;
        }
        if (sucursal.horarioCierre === undefined || sucursal.horarioCierre === "") {
            setTxtValidacion("Debe ingresar una horario de cierre");
            return;
        }
        if (sucursal?.url === undefined || sucursal.url === "") {
            setTxtValidacion("Debe ingresar una imagen");
            return;
        }
        if (domicilio?.calle === undefined || domicilio.calle === "") {
            setTxtValidacion("Debe ingresar una calle");
            return;
        }
        if (domicilio?.numero === undefined || domicilio.numero === 0) {
            setTxtValidacion("Debe ingresar un numero");
            return;
        }
        if (domicilio?.cp === undefined || domicilio.cp === 0) {
            setTxtValidacion("Debe ingresar un cp");
            return;
        }
        if (localidadSeleccionada?.nombre === undefined || localidadSeleccionada.nombre === "") {
            setTxtValidacion("Debe ingresar una localidad");
            return;
        }
        if (paisSeleccionado?.nombre === undefined || paisSeleccionado.nombre === "") {
            setTxtValidacion("Debe ingresar un pais");
            return;
        }
        if (provinciaSeleccionada?.nombre === undefined || provinciaSeleccionada.nombre === "") {
            setTxtValidacion("Debe ingresar una provincia");
            return;
        }

        const empresa = await getEmpresaPorID(selectedIdEmpresa)
        const sucursalActualizado = { ...sucursal };
        sucursalActualizado.empresa = empresa;

        const domicilioActualizado = { ...domicilio };

        const newLocalidad = JSON.parse(JSON.stringify(localidadSeleccionada)) as Localidad;
        domicilioActualizado.localidad = newLocalidad;
        domicilioActualizado.cliente = null

        const domicilioFromDB = await saveDomicilio(domicilioActualizado);

        console.log(JSON.stringify(domicilioActualizado))

        console.log("\n")

        sucursalActualizado.domicilio = domicilioFromDB;

        setSucursal(sucursalActualizado);

        await saveSucursal(sucursalActualizado);

        handleCloseAndClear()
        if (getListadoSucursales) getListadoSucursales()

    };

    return (
        <Modal show={showModal} onHide={handleCloseAndClear} size="xl">

            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Editar' : 'Añadir'} Sucursal</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" name="nombre" value={sucursal?.nombre} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Url de la Imagen</Form.Label>
                                <Form.Control type="text" name="url" value={sucursal?.url} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Horario de Apertura</Form.Label>
                                <Form.Control type="time" name="horarioApertura" value={sucursal?.horarioApertura} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Horario de Cierre</Form.Label>
                                <Form.Control type="time" name="horarioCierre" value={sucursal?.horarioCierre} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                            label="¿Es la casa matriz?"
                            name="casaMatriz"
                            checked={sucursal?.casaMatriz}
                            onChange={handleInputChange}
                        />
                    </Form.Group>


                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Domicilio</Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Calle</Form.Label>
                                            <Form.Control type="text" style={{ width: "44rem" }} name="calle" value={domicilio?.calle} onChange={handleInputChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Numero</Form.Label>
                                            <Form.Control type="number" style={{ width: "9.5rem" }} name="numero" value={domicilio?.numero} onChange={handleInputChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CP</Form.Label>
                                            <Form.Control type="number" style={{ width: "9.5rem" }} name="cp" value={domicilio?.cp} onChange={handleInputChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Pais</Form.Label>
                                            {/* <Form.Control type="text" name="pais" value={pais?.nombre} onChange={handleInputChange} /> */}
                                            <Form.Control as="select" value={paisSeleccionado?.id || ''} onChange={e => setPaisSeleccionado(paises.find(pais => pais.id === Number(e.target.value)) || null)}>
                                                <option value="">Seleccione un país</option>
                                                {paises.map(pais => (
                                                    <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Provincia</Form.Label>
                                            {/* <Form.Control type="text" name="provincia" value={provincia?.nombre} onChange={handleInputChange} /> */}
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
                                            {/* <Form.Control type="text" name="localidad" value={localidad?.nombre} onChange={handleInputChange} /> */}
                                            <Form.Control as="select" value={localidadSeleccionada?.id || ''} onChange={e => setLocalidadSeleccionada(localidades.find(localidad => localidad.id === Number(e.target.value)) || null)}>
                                                <option value="">Seleccione una localidad</option>
                                                {localidades.map(localidad => (
                                                    <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>


                    {/* <Row>
                        <Col>
                            <Form.Group className="mb-3 mt-3">
                                <Form.Label>Empresa</Form.Label>
                                <Form.Select aria-label="Default select example" name="empresa" value={sucursal?.empresa.id} onChange={handleInputChange}>
                                    <option value={0}>Seleccionar Empresa</option>
                                    {empresas.map((empresa: Empresa) =>
                                        <option key={empresa.id} value={empresa.id}> {empresa.nombre} </option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row> */}

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