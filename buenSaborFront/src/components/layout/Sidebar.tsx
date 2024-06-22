
import { NavLink } from 'react-router-dom';
import { cilBarChart, cilCreditCard, cilFastfood, cilPeople, cilBasket, cilBuilding } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CImage, CNavGroup, CNavItem, CSidebar, CSidebarNav } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';
import title from "../../assets/images/title.png";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UsuarioCliente } from '../../models/Usuario';
import { RolName } from '../../models/RolName';


export default function Sidebar() {

    const { auth } = useContext(AuthContext); // Obtiene el estado de autenticación del contexto
    const usuarioLogueado: UsuarioCliente | null = auth.usuario

    return (
        <div className="d-flex " >
            <CSidebar colorScheme="dark" className="bg-dark collapse border-end d-md-block d-block" id="sidebarCollapse" style={{ position: 'relative', height: '100%', backgroundColor: '#E0E0E0' }} unfoldable>
                <CSidebarNav>
                    <CNavItem>
                        <NavLink to="/" className="nav-link">
                            <CImage rounded src={title} width={40} height={40} />
                            Buen Sabor
                        </NavLink>
                    </CNavItem>

                    {
                        (!usuarioLogueado || !usuarioLogueado.rol) ?
                            <CNavItem>
                                <NavLink to="/articulos" className="nav-link" >
                                    <CIcon customClassName="nav-icon" icon={cilFastfood} />
                                    Articulos
                                </NavLink>
                            </CNavItem>
                            : <>
                                {usuarioLogueado && usuarioLogueado.rol.rolName == RolName.CLIENTE
                                    ? <SidebarCliente />
                                    : <SidebarAdmin rolName={usuarioLogueado.rol.rolName} />
                                }
                            </>
                    }



                </CSidebarNav>
            </CSidebar>
        </div>
    );
}

export function SidebarAdmin({ rolName }: { rolName: RolName }) {

    return (
        <>
            {
                rolName == RolName.ADMIN &&
                <CNavGroup
                    toggler={
                        <>
                            <CIcon customClassName="nav-icon" icon={cilBuilding} />
                            Mi Empresa
                        </>}
                >
                    <CNavItem>
                        <NavLink to="/profileEmpresa" className="nav-link">
                            <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                            Empresa
                        </NavLink>
                    </CNavItem>
                    <CNavItem>
                        <NavLink to="/sucursales" className="nav-link">
                            <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                            Sucursales
                        </NavLink>
                    </CNavItem>
                </CNavGroup>
            }

            <CNavGroup
                toggler={
                    <>
                        <CIcon customClassName="nav-icon" icon={cilFastfood} />
                        Articulos
                    </>
                }
            >
                {(rolName == RolName.ADMIN || rolName == RolName.CAJERO) &&

                    <CNavItem>
                        <NavLink to="/articulos" className="nav-link" >
                            <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                            Articulos
                        </NavLink>
                    </CNavItem>
                }
                <CNavItem>
                    <NavLink to="/insumos" className="nav-link" >
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Insumos
                    </NavLink>
                </CNavItem>
                <CNavItem>
                    <NavLink to="/manufacturados" className="nav-link" >
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Manufacturados
                    </NavLink>
                </CNavItem>
                {
                    (rolName === RolName.CAJERO || rolName === RolName.ADMIN) &&
                    <>
                        <CNavItem>
                            <NavLink to="/categorias" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Categorías
                            </NavLink>
                        </CNavItem>
                        <CNavItem>
                            <NavLink to="/unidadmedida" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Unidades de Medida
                            </NavLink>
                        </CNavItem>
                    </>
                }
                <CNavItem>
                    <NavLink to="/promociones" className="nav-link">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Promociones
                    </NavLink>
                </CNavItem>
            </CNavGroup>

            {
                rolName === RolName.ADMIN ?
                    <>
                        <CNavGroup
                            toggler={
                                <>
                                    <CIcon customClassName="nav-icon" icon={cilCreditCard} />
                                    Facturacion
                                </>
                            }
                        >
                            <CNavItem>
                                <NavLink to="/facturacion" className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Facturas
                                </NavLink>
                            </CNavItem>
                            <CNavItem>
                                <NavLink to="/pedidos" className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Pedidos
                                </NavLink>
                            </CNavItem>
                            <CNavItem>
                                <NavLink to="/reportes" className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Reportes
                                </NavLink>
                            </CNavItem>
                        </CNavGroup>
                        <CNavItem>
                            <NavLink to="/estadisticas" className="nav-link">
                                <CIcon customClassName="nav-icon" icon={cilBarChart} />
                                Estadisticas
                            </NavLink>
                        </CNavItem>
                        <CNavGroup
                            toggler={
                                <>
                                    <CIcon customClassName="nav-icon" icon={cilPeople} />
                                    Usuarios
                                </>
                            }
                        >
                            <CNavItem>
                                <NavLink to="/clientes" className="nav-link" >
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Clientes
                                </NavLink>
                            </CNavItem>
                            <CNavItem>
                                <NavLink to="/empleados" className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Empleados
                                </NavLink>
                            </CNavItem>
                            <CNavItem>
                                <NavLink to="/modificarRoles" className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Modificar Roles
                                </NavLink>
                            </CNavItem>
                        </CNavGroup>
                    </>
                    :
                    <>
                        {
                            (rolName === RolName.COCINERO || rolName === RolName.DELIVERY) ?
                                <CNavItem>
                                    <NavLink to="/pedidos" className="nav-link">
                                        <CIcon customClassName="nav-icon" icon={cilBasket} />
                                        Pedidos
                                    </NavLink>
                                </CNavItem>
                                :
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon" icon={cilCreditCard} />
                                            Facturacion
                                        </>
                                    }
                                >
                                    <CNavItem>
                                        <NavLink to="/facturacion" className="nav-link">
                                            <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                            Facturas
                                        </NavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <NavLink to="/pedidos" className="nav-link">
                                            <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                            Pedidos
                                        </NavLink>
                                    </CNavItem>
                                </CNavGroup>

                        }

                    </>
            }
        </>
    );

}

export function SidebarCliente() {

    return (
        <>
            <CNavGroup
                toggler={
                    <>
                        <CIcon customClassName="nav-icon" icon={cilFastfood} />
                        Articulos
                    </>
                }
            >
                <CNavItem>
                    <NavLink to="/articulos" className="nav-link" >
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Articulos
                    </NavLink>
                </CNavItem>
                {/* <CNavItem>
                    <NavLink to="/promociones" className="nav-link">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Promociones
                    </NavLink>
                </CNavItem> */}
            </CNavGroup>
            <CNavGroup
                toggler={
                    <>
                        <CIcon customClassName="nav-icon" icon={cilCreditCard} />
                        Facturacion
                    </>
                }
            >
                <CNavItem>
                    <NavLink to="/facturacion" className="nav-link">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Facturas
                    </NavLink>
                </CNavItem>
                <CNavItem>
                    <NavLink to="/pedidos" className="nav-link">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Pedidos
                    </NavLink>
                </CNavItem>
            </CNavGroup>
        </>
    );

}