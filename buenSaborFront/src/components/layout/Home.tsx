import { CCarousel, CCarouselItem, CImage } from "@coreui/react";
import './../../styles/Home.css'
import { useEffect, useState } from "react";
import Sucursal from "../../models/Sucursal";
import { SucursalTarjeta } from "../empresa/SucursalTarjeta";
import { getSucursales } from "../../services/SucursalApi";
import Promocion from "../../models/Promocion";
import { PromocionTarjeta } from "../empresa/PromocionTarjeta";
import { getPromociones } from "../../services/PromocionApi";
import { Col, Row } from "react-bootstrap";

export function Home() {

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [mostrarSucursales, setMostrarSucursales] = useState<boolean>(false);

    const getListadoSucursales = async () => {
        const datos: Sucursal[] = await getSucursales();
        setSucursales(datos);
    };

    const getListadoPromociones = async () => {
        const datos: Promocion[] = await getPromociones();
        setPromociones(datos);
    };

    const carruselItems = [];
    for (let i = 1; i < 8; i++) {
        carruselItems.push(
            <CCarouselItem key={`promo${i}`} className="img-container">
                <CImage className="d-block img-carousel" src={`./homeCarrusel/background${i}.webp`} alt={`background${i}`} />
            </CCarouselItem>
        );
    }

    const handleMostrarSucursales = () => {
        setMostrarSucursales(true)
    };

    useEffect(() => {
        getListadoSucursales();
        getListadoPromociones();
    }, []);

    return (
        <>
            <div className="home-container">
                <div className="welcome-container">
                    <h1 className="welcome-title">Bienvenido</h1>
                    <div className="spacer"></div>
                    <button className="welcome-button" onClick={handleMostrarSucursales}>Hace tu pedido</button>

                </div>
                <CCarousel controls transition="crossfade" indicators dark className="custom-carousel">
                    {carruselItems}
                </CCarousel>
                <>
                    {
                        mostrarSucursales &&
                        <div className="main container" >
                            <div className="sucursal-container">
                                <h3 className="sucursal-title" >Selecciona tu Sucursal</h3>
                            </div>
                            <div className="row justify-content-center">
                                {
                                    sucursales.map((s: Sucursal) => {
                                        return (
                                            <SucursalTarjeta key={s.id} sucursal={s} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </>
                <div className="d-flex flex-column w-100 justify-content-center m-auto">
                    <br />
                    <div style={{ width: "400px", alignSelf: "center", backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '15px', padding: "15px" }}>
                        <h3 className="text-center text-light">Horario de atención: </h3>
                        <p className="text-center text-light"><strong>Lunes a domingos de 20:00 a 12:00</strong></p>
                        <p className="text-center text-light"><strong>Sábados y domingos de 11:00 a 15:00</strong></p>
                    </div>
                    <br />
                    <div className="main container" >
                        <div className="sucursal-container">
                            <h3 className="sucursal-title" >Nuestras Promociones</h3>
                        </div>
                        <div className="row justify-content-center">
                            {
                                promociones.map((p: Promocion) => {
                                    return (
                                        <PromocionTarjeta key={p.id} promocion={p} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="spacer"></div>
                <footer className="footer-container">
                    <h1 style={{ color: "black", marginTop: "30px" }}>Nuestro Equipo</h1>
                    <Row className="mt-4 mb-3 justify-content-center">
                        <Col>
                            <img
                                className="img-profile" src={`./conocenos/pablo.jfif`} alt={`pablo`}
                            />
                            <h4>Pablo Sepulveda</h4>
                        </Col>
                        <Col>
                            <img
                                className="img-profile" src={`./conocenos/enzo.jpg`} alt={`enzo`}
                            />
                            <h4>Enzo Pennisi</h4>
                        </Col>
                        <Col>
                            <img
                                className="img-profile" src={`./conocenos/vanina.jpg`} alt={`vanina`}
                            />
                            <h4>Vanina Luna</h4>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <hr />
                    <strong>Copyright &copy; 2024 BuenSabor</strong>. Todos los derechos reservados
                </footer>
            </div>
        </>

    );
}
