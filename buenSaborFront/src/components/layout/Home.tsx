import { CCarousel, CCarouselItem, CImage } from "@coreui/react";
import './../../styles/Home.css'

export function Home() {

    const carruselItems = [];
    for (let i = 1; i < 6; i++) {
        carruselItems.push(
            <CCarouselItem key={`promo${i}`}>
                <CImage className="d-block img-carousel" src={`./promociones/promo${i}.jpg`} alt={`promo${i}`} />
            </CCarouselItem>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <h1 className="title">Nuestras Promociones</h1>
            </div>
            <div className="d-flex flex-column w-100 justify-content-center m-auto">
                <CCarousel controls transition="crossfade" indicators dark className="custom-carousel">
                    {carruselItems}
                </CCarousel>
                <br />
                <div style={{ width: "400px", alignSelf: "center", backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: "15px" }}>
                    <h3 className="text-center text-light">Horario de atención: </h3>
                    <p className="text-center text-light"><strong>Lunes a domingos de 20:00 a 12:00</strong></p>
                    <p className="text-center text-light"><strong>Sábados y domingos de 11:00 a 15:00</strong></p>
                </div>

            </div>
        </>
    );
}
