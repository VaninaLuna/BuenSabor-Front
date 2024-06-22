import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './components/context/AuthContext.tsx';
import { App } from './App.tsx';


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
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Auth0Provider>

  </React.StrictMode>,
)
