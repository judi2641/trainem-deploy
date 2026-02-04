import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/AppContext';

export default function Callback() {
	const navigate = useNavigate();
	const { user, isLoading, getAccessTokenSilently } = useAuth0();
	// Wir brauchen nur noch setMyUser, der Rest passiert automatisch im Context
	const { setMyUser } = useMyContext();

	async function handleUserSync() {
		// Warten bis Auth0 fertig geladen hat
		if (isLoading || !user || !user.sub) return;

		try {
			const token = await getAccessTokenSilently();
			// 1. Prüfen: Gibt es den User schon in MEINER Datenbank?
			const res_user = await fetch(
				`http://localhost:3000/api/user/${encodeURIComponent(user.sub)}`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			let contextUser;

			if (res_user.ok) {
				contextUser = await res_user.json();
				console.log('User gefunden, logge ein...');
			} else {
				console.log('User neu, erstelle Account...');
				const res_newuser = await fetch(`http://localhost:3000/api/user`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ auth0Id: user.sub, email: user.email }),
				});

				if (!res_newuser.ok) {
					console.error('Fehler beim Erstellen des Users');
					navigate('/');
					return;
				}
				contextUser = await res_newuser.json();
			}

			setMyUser(contextUser);

			if (contextUser.onboardingCompleted) {
				navigate('/dashboard');
			} else {
				navigate('/onboarding');
			}
		} catch (error) {
			console.error('Critical Error in Callback:', error);
			navigate('/');
		}
	}

	useEffect(() => {
		handleUserSync();
	}, [isLoading, user]);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				width: '100%',
			}}
		>
			Loading…
		</div>
	);
}
