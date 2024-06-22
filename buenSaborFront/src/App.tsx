import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Route, Routes, useLocation } from 'react-router-dom'
import { GrillaArticuloManufacturado } from './components/articulos/GrillaArticuloManufacturado.tsx'
import { GrillaArticuloInsumo } from './components/articulos/GrillaArticuloInsumo.tsx'
import Sidebar from './components/layout/Sidebar.tsx';
import NavBar from './components/layout/Navbar.tsx';
import { Home } from './components/layout/Home.tsx';
import { GrillaSucursal } from './components/empresa/GrillaSucursal.tsx';
import { Articulos } from './components/articulos/articulos.tsx';
import RolUsuario from './components/controlAcceso/RolUsuario.tsx';
import { RolName } from './models/RolName.ts';
import { GrillaCategoria } from './components/articulos/GrillaCategoria.tsx';
import { GrillaUnidadMedida } from './components/articulos/GrillaUnidadMedida.tsx';
import { GrillaPedido } from './components/articulos/GrillaPedido.tsx';
import { GrillaFactura } from './components/facturacion/GrillaFactura.tsx';
import Profile from './components/auth/ProfileAuth0.tsx';
import { GrillaCliente } from './components/usuarios/GrillaCliente.tsx';
import { GrillaEmpleado } from './components/usuarios/GrillaEmpleado.tsx';
import { GrillaSuperUsuario } from './components/usuarios/GrillaSuperUsuario.tsx';
import ReporteExcel from './components/reportes/ReporteExcel.tsx';
import Estadisticas from './components/empresa/Estadisticas.tsx';
import fondo from './assets/images/fondo3.jpg';
import { Promociones } from './components/articulos/Promociones.tsx';
import ProfileEmpresa from './components/empresa/ProfileEmpresa.tsx';

export const App = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/' && location.pathname !== '/home';

    return (
        <>
            {showSidebar && <Sidebar />}
            <div className="h-100 w-100 flex-grow-1" style={{
                backgroundImage: `url(${fondo})`,
                backgroundSize: 'auto',
                backgroundPosition: 'center',
                backgroundColor: '#e06f72',
            }}>
                <NavBar />
                {/* <div className='content' style={{ marginLeft: 60, marginRight: 60 }}> */}
                <Routes>
                    <Route path='/profile' element={<Profile />} />
                    <Route index element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path="/articulos" element={<Articulos />} />
                    {/* EMPRESA */}
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/profileEmpresa" element={<ProfileEmpresa />} />
                        {/* <Route path="/empresas" element={<GrillaEmpresa />} /> */}
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/sucursales" element={<GrillaSucursal />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO]} />}>
                        <Route path="/promociones" element={<Promociones />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/estadisticas" element={<Estadisticas />} />
                    </Route>
                    {/* ARTICULOS */}
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO, RolName.DELIVERY]} />}>
                        <Route path="/insumos" element={<GrillaArticuloInsumo />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO, RolName.DELIVERY]} />}>
                        <Route path="/manufacturados" element={<GrillaArticuloManufacturado />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO]} />}>
                        <Route path="/categorias" element={<GrillaCategoria />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO]} />}>
                        <Route path="/unidadMedida" element={<GrillaUnidadMedida />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO, RolName.DELIVERY, RolName.CLIENTE]} />}>
                        <Route path="/pedidos" element={<GrillaPedido />} />
                    </Route>
                    {/* FACTURACION */}
                    <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO, RolName.DELIVERY, RolName.CLIENTE]} />}>
                        <Route path="/facturacion" element={<GrillaFactura />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/reportes" element={<ReporteExcel />} />
                    </Route>
                    {/* USUARIOS */}
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/clientes" element={<GrillaCliente />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/empleados" element={<GrillaEmpleado />} />
                    </Route>
                    <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                        <Route path="/modificarRoles" element={<GrillaSuperUsuario />} />
                    </Route>
                </Routes>
                {/* </div> */}
            </div>
        </>
    );
};
