import { Card } from "react-bootstrap";
import "../../styles/SucursalTarjeta.css";
import Sucursal from "../../models/Sucursal";
import { useNavigate } from "react-router-dom";

type SucursalParams = {
    sucursal: Sucursal;
}

export function SucursalTarjeta(args: SucursalParams) {
    const sucursal = args.sucursal;
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/articulos');
    };

    return (
        <>
            <Card className="m-4 mx-auto text-center sucursal" style={{ width: '18rem' }} onClick={handleButtonClick}>
                <Card.Img variant="top" src={sucursal.url} alt={sucursal.nombre} className="card-img" />
                <Card.Body>
                    <Card.Title style={{ color: 'black' }}>{sucursal.nombre}</Card.Title>
                    <Card.Text style={{ color: 'black' }}>{`${sucursal.domicilio.localidad.nombre}`} - {`${sucursal.domicilio.localidad.provincia.nombre}`} </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}
