import { ReactNode, createContext, useEffect, useState } from "react";
import ArticuloDTO from "../../models/ArticuloDTO";
import PedidoDetalle from "../../models/PedidoDetalle";
import { getArticuloInsumoPorID } from "../../services/ArticuloInsumoApi";
import { getArticuloManufacturadoPorID } from "../../services/ArticuloManufacturadoApi";
import ArticuloInsumo from "../../models/ArticuloInsumo";

interface CartContextType {
    cart: PedidoDetalle[];
    addCarrito: (product: ArticuloDTO) => void;
    removeCarrito: (product: ArticuloDTO) => void;
    removeItemCarrito: (product: ArticuloDTO) => void;
    limpiarCarrito: () => void;
    limpiarCarritoDespuesPago: () => void;
    totalPedido: number;
    totalCosto: number;
}

export const CartContext = createContext<CartContextType>({
    cart: [],
    addCarrito: () => { },
    removeCarrito: () => { },
    removeItemCarrito: () => { },
    limpiarCarrito: () => { },
    limpiarCarritoDespuesPago: () => { },
    totalPedido: 0,
    totalCosto: 0
})

export function CarritoContextProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<PedidoDetalle[]>([]);
    const [totalPedido, setTotalPedido] = useState<number>(0);
    const [totalCosto, setTotalCosto] = useState<number>(0);

    useEffect(() => {
        calcularTotalCarrito();
        calcularTotalCosto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart]);

    const checkStock = async (articulo: ArticuloDTO) => {
        const productInCart = cart.find((detalle) => detalle.articulo.id === articulo.id);
        if (productInCart) {
            if (productInCart.articulo.type === "articuloInsumo") {
                console.log("productInCart?.articulo.id: " + productInCart?.articulo.id);
                const insumo: ArticuloInsumo = await getArticuloInsumoPorID(productInCart?.articulo.id);
                if (insumo.stockActual <= 0 || (productInCart && insumo.stockActual <= productInCart.cantidad)) {
                    alert("No hay suficiente stock para este artículo.");
                    removeItemCarrito(articulo)
                    return false;
                }
            } else if (productInCart.articulo.type === "articuloManufacturado") {
                const manufacturado = articulo;
                if (manufacturado.articuloManufacturadoDetalles) {
                    for (const detalle of manufacturado.articuloManufacturadoDetalles) {
                        const insumo: ArticuloInsumo = await getArticuloInsumoPorID(detalle.articuloInsumo.id);
                        if (insumo.stockActual < detalle.cantidad ||
                            (productInCart && insumo.stockActual <= (detalle.cantidad * productInCart.cantidad))) {
                            alert("No hay suficiente stock para uno o más componentes de este artículo manufacturado..");
                            removeItemCarrito(articulo)
                            return false;
                        }
                    }
                }
            }
        } else {
            if (articulo.type === "articuloInsumo") {
                console.log("productInCart?.articulo.id: " + articulo.id);
                const insumo: ArticuloInsumo = await getArticuloInsumoPorID(articulo.id);
                if (insumo.stockActual <= 0) {
                    alert("No hay suficiente stock para este artículo.");
                    removeItemCarrito(articulo)
                    return false;
                }
            } else if (articulo.type === "articuloManufacturado") {
                const manufacturado = articulo;
                if (manufacturado.articuloManufacturadoDetalles) {
                    for (const detalle of manufacturado.articuloManufacturadoDetalles) {
                        const insumo: ArticuloInsumo = await getArticuloInsumoPorID(detalle.articuloInsumo.id);
                        if (insumo.stockActual < detalle.cantidad) {
                            alert("No hay suficiente stock para uno o más componentes de este artículo manufacturado..");
                            removeItemCarrito(articulo)
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    const addCarrito = async (articulo: ArticuloDTO) => {
        const articuloStock = await checkStock(articulo)

        if (articuloStock) {
            setCart(prevCart => {
                const productInCart = cart.find((detalle) => detalle.articulo.id === articulo.id);

                if (productInCart) {
                    const updatedCart = prevCart.map(detalle =>
                        detalle.articulo.id === articulo.id
                            ? {
                                ...detalle, cantidad: detalle.cantidad + 1,
                                subTotal: detalle.articulo.precioVenta * (detalle.cantidad + 1)
                            }
                            : detalle
                    );
                    return updatedCart;
                } else {
                    const newDetalle = new PedidoDetalle();
                    newDetalle.cantidad = 1;
                    newDetalle.articulo = articulo;
                    newDetalle.subTotal = newDetalle.articulo.precioVenta * newDetalle.cantidad;
                    return [...prevCart, newDetalle];
                }
            });
        }
    }

    const removeCarrito = (articulo: ArticuloDTO) => {
        setCart(prevCart =>
            prevCart.filter(detalle => detalle.articulo.id !== articulo.id)
        );
    }

    const removeItemCarrito = (articulo: ArticuloDTO) => {
        setCart(prevCart => {
            const productInCart = cart.find(detalle => detalle.articulo.id === articulo.id);

            if (productInCart && productInCart.cantidad > 1) {
                const updatedCart = cart.map(detalle =>
                    detalle.articulo.id === articulo.id
                        ? { ...detalle, cantidad: detalle.cantidad - 1 }
                        : detalle
                );
                return updatedCart;
            } else {
                return prevCart.filter(detalle => detalle.articulo.id !== articulo.id);
            }
        });
    }

    const limpiarCarrito = () => {
        setCart([]);
    }

    const limpiarCarritoDespuesPago = () => {
        setCart([]);
    }

    const calcularTotalCarrito = () => {
        let total: number = 0;
        cart.forEach(detalle =>
            total += detalle.cantidad * detalle.articulo.precioVenta
        );
        setTotalPedido(total);
    }

    const calcularTotalCosto = async () => {
        let totalCosto: number = 0;
        for (const detalle of cart) {
            if (detalle.articulo.type === 'articuloInsumo') {
                const articuloInsumo = await getArticuloInsumoPorID(detalle.articulo.id);

                totalCosto += articuloInsumo.precioCompra * detalle.cantidad;
            } else if (detalle.articulo.type === 'articuloManufacturado') {
                const articuloManufacturado = await getArticuloManufacturadoPorID(detalle.articulo.id);

                articuloManufacturado.articuloManufacturadoDetalles.forEach(detalleManufacturado => {
                    totalCosto += detalleManufacturado.articuloInsumo.precioCompra * detalleManufacturado.cantidad;
                });
            }
        }
        setTotalCosto(totalCosto);
    }


    return (
        <CartContext.Provider value={{ cart, addCarrito, limpiarCarrito, limpiarCarritoDespuesPago, removeCarrito, removeItemCarrito, totalPedido, totalCosto }}>
            {children}
        </CartContext.Provider>
    );
}
