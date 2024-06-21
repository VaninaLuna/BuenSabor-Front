import { useEffect, useState } from 'react';
import { Table, FormControl, Modal } from 'react-bootstrap';
import Sucursal from '../../models/Sucursal';
import { getSucursalesPorEmpresa } from '../../services/SucursalApi';

interface ModalProps {
    empresaId: number;
    showModalSucursales: boolean;
    handleCloseSucursales: () => void;
}

export const ModalSucursales: React.FC<ModalProps> = ({ empresaId, showModalSucursales, handleCloseSucursales }) => {

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        if (empresaId > 0) {
            getSucursalesPorEmpresa(empresaId)
                .then(data => setSucursales(data));
        }
    }, [empresaId]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const handleCloseAndClear = () => {
        handleCloseSucursales();
    };

    const filteredSucursales = sucursales.filter(s =>
        s.id.toString().includes(filtro) ||
        s.nombre.toLowerCase().includes(filtro.toLowerCase())
    );


    return (
        <Modal show={showModalSucursales} onHide={handleCloseAndClear}
            size="xl" style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header style={{ backgroundColor: 'gainsboro' }} closeButton>
                <Modal.Title>Sucursales</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: 'gainsboro' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <FormControl
                        placeholder="Filtrar por ID o Denominacion"
                        value={filtro}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '20px', width: '300px' }}
                    />
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th style={{ maxWidth: "80px" }}>ID</th>
                            <th>Casa Matriz</th>
                            <th>Horario Apertura</th>
                            <th>Horario Cierre</th>
                            <th>Nombre</th>
                            <th>Domicilio</th>
                            <th>Localidad</th>
                            <th>Provincia</th>
                            <th>Pais</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSucursales.map((s: Sucursal, index) =>
                            <tr key={index}>
                                <td>{s.id}</td>
                                <td>{s.casaMatriz ? 'Si' : 'No'}</td>
                                <td>{s.horarioApertura}</td>
                                <td>{s.horarioCierre}</td>
                                <td>{s.nombre}</td>
                                <td>{s.domicilio.calle} {s.domicilio.numero}</td>
                                <td>{s.domicilio.localidad.nombre}</td>
                                <td>{s.domicilio.localidad.provincia.nombre}</td>
                                <td>{s.domicilio.localidad.provincia.pais.nombre}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}
