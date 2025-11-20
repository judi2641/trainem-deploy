import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';



const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
<Auth0Provider
    domain="dev-wmcuuu42i1iqwc5e.us.auth0.com"
    clientId="g8BoaEXH4lB7gRMqRc8F0ruGLvy9OXkD"
    authorizationParams={{
      redirect_uri: window.location.origin + '/dashboard',
      audience: 'https://trainem.authentication'
    }}
  >
    <App />
</Auth0Provider>,);