import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/AppContext';

export default function Callback() {
	const navigate = useNavigate();
	const { user, isLoading } = useAuth0();
	const { setMyUser, setWorkout, setEntries, myUser } = useMyContext();

	useEffect(() => {
		async function getData() {
			if (!isLoading && user) {
				if (user.sub) {
					const res_user = await fetch(
						`http://localhost:3000/api/user/${encodeURIComponent(user.sub)}`,
					);
					let contextUser;
					if (res_user.ok) {
						contextUser = await res_user.json();
						console.log('Backend user');
					}
					if (!res_user.ok) {
						const res_newuser = await fetch(`http://localhost:3000/api/user`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ auth0Id: user.sub, email: user.email }),
						});

						if (!res_newuser.ok) {
							console.log('fehler beim erstellen');
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
				} else {
					console.log('keine user.sub');
					navigate('/');
				}
			}
		}
		getUser();
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
