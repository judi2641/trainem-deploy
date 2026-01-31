import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { Toaster } from 'sonner';
import { loadStoredInvertTheme } from './util/theme';

loadStoredInvertTheme();

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<Auth0Provider
		domain="dev-wmcuuu42i1iqwc5e.us.auth0.com"
		clientId="g8BoaEXH4lB7gRMqRc8F0ruGLvy9OXkD"
		authorizationParams={{
			redirect_uri: 'https://trainem-deploy-mw2b43uub-julius-projects-c59e7d1a.vercel.app/callback',
			audience: 'https://trainem.authentication',
		}}
		cacheLocation="localstorage"
		useRefreshTokens
	>
		<App />
		<Toaster position="top-center" richColors />
	</Auth0Provider>,
);
