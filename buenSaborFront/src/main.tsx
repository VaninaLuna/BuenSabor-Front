import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';



import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GrillaArticuloManufacturado } from './components/articulos/GrillaArticuloManufacturado.tsx'
import { GrillaArticuloInsumo } from './components/articulos/GrillaArticuloInsumo.tsx'
import Sidebar from './components/layout/Sidebar.tsx';
import NavBar from './components/layout/Navbar.tsx';
import { Home } from './components/layout/Home.tsx';
import { GrillaEmpresa } from './components/empresa/GrillaEmpresa.tsx';
import { GrillaSucursal } from './components/empresa/GrillaSucursal.tsx';
import { Articulos } from './components/articulos/articulos.tsx';
import RolUsuario from './components/controlAcceso/RolUsuario.tsx';
import { RolName } from './models/RolName.ts';
// import { RutaPrivada } from './components/controlAcceso/RutaPrivada.tsx';
import { GrillaCategoria } from './components/articulos/GrillaCategoria.tsx';
import { GrillaUnidadMedida } from './components/articulos/GrillaUnidadMedida.tsx';
import { GrillaPedido } from './components/articulos/GrillaPedido.tsx';
import { GrillaFactura } from './components/facturacion/GrillaFactura.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import Profile from './components/auth/ProfileAuth0.tsx';
import { AuthProvider } from './components/context/AuthContext.tsx';
import { GrillaCliente } from './components/usuarios/GrillaCliente.tsx';
import { GrillaEmpleado } from './components/usuarios/GrillaEmpleado.tsx';
import { GrillaSuperUsuario } from './components/usuarios/GrillaSuperUsuario.tsx';
import ReporteExcel from './components/reportes/ReporteExcel.tsx';
import Estadisticas from './components/empresa/Estadisticas.tsx';
import fondo from './assets/images/fondo3.jpg';
import { Promociones } from './components/articulos/Promociones.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-nravpn621dek13sw.us.auth0.com"
      clientId="7XfwxWEDvewkHOlXX4AdMUJ29t2m4QFB"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Sidebar />
          <div className="h-100 w-100 flex-grow-1" style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: 'auto',
            backgroundPosition: 'center',
            backgroundColor: '#e06f72',
            // Este color será visible si la imagen no carga
          }}>
            <NavBar />
            <div className='content' style={{ marginLeft: 60, marginRight: 60 }}>
              <Routes>
                {/* <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} /> */}
                <Route path='/profile' element={<Profile />} />
                <Route index element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path="/articulos" element={<Articulos />} />
                {/* EMPRESA */}
                <Route element={<RolUsuario roles={[RolName.ADMIN]} />}>
                  <Route path="/empresas" element={<GrillaEmpresa />} />
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
                <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO]} />}>
                  <Route path="/insumos" element={<GrillaArticuloInsumo />} />
                </Route>

                <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO]} />}>
                  <Route path="/manufacturados" element={<GrillaArticuloManufacturado />} />
                </Route>

                <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO]} />}>
                  <Route path="/categorias" element={<GrillaCategoria />} />
                </Route>

                <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO]} />}>
                  <Route path="/unidadMedida" element={<GrillaUnidadMedida />} />
                </Route>

                <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO, RolName.CLIENTE]} />}>
                  <Route path="/pedidos" element={<GrillaPedido />} />
                </Route>

                {/* FACTURACION */}
                <Route element={<RolUsuario roles={[RolName.ADMIN, RolName.CAJERO, RolName.COCINERO, RolName.CLIENTE]} />}>
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
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </Auth0Provider>

  </React.StrictMode>,
)
