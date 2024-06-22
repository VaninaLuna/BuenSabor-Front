import { Card } from "react-bootstrap";
import "../../styles/SucursalTarjeta.css";
import { useNavigate } from "react-router-dom";
import Promocion from "../../models/Promocion";

type PromocionParams = {
    promocion: Promocion;
}

export function PromocionTarjeta(args: PromocionParams) {
    const promocion = args.promocion;
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/articulos');
    };

    return (
        <>
            <Card className="m-4 mx-auto text-center sucursal" style={{ width: '18rem', background: "black" }} onClick={handleButtonClick}>
                <Card.Img variant="top" src={promocion.imagenes[0]?.url} alt={promocion.denominacion} className="card-img" />
                <Card.Body>
                    <Card.Title style={{ color: 'whitesmoke' }}>{promocion.denominacion}</Card.Title>
                    <Card.Text style={{ color: 'whitesmoke' }}>{promocion.descripcionDescuento} </Card.Text>
                    <Card.Text style={{ color: 'whitesmoke' }}>{`${promocion.fechaDesde}`} - {`${promocion.fechaHasta}`} </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}
