import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/AppContext';

export default function Callback() {
	const navigate = useNavigate();
	const { user, isLoading } = useAuth0();
	const { setMyUser, setWorkouts, setEntries, setExercises } = useMyContext();

	async function setUserData() {
		if (!isLoading && user) {
			if (user.sub) {
				const res_user = await fetch(
					`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/user/${encodeURIComponent(user.sub)}`,
				);
				let contextUser;
				if (res_user.ok) {
					contextUser = await res_user.json();
					console.log('Backend user');
				}
				if (!res_user.ok) {
					const res_newuser = await fetch(
						`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/user`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ auth0Id: user.sub, email: user.email }),
						},
					);

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

	async function setEntriesData() {
		if (!isLoading && user) {
			if (user.sub) {
				const res_entries = await fetch(
					`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/entries/${user.sub}`,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);

				if (!res_entries.ok) {
					console.log('fehler beim fetch von entries');
					navigate('/');
					return;
				}

				setEntries(await res_entries.json());
			}
		}
	}

	async function setWorkoutsData() {
		if (!isLoading && user) {
			if (user.sub) {
				const res_workouts = await fetch(
					`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/workouts/${user.sub}`,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);

				if (!res_workouts.ok) {
					console.log('fehler beim fetch von workouts');
					navigate('/');
					return;
				}

				setWorkouts(await res_workouts.json());
			}
		}
	}

	async function setExercisesData() {
		if (!isLoading && user) {
			if (user.sub) {
				const res_exercises = await fetch(
					`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/exercises`,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				);

				if (!res_exercises.ok) {
					console.log('fehler beim fetch von Exercises');
					navigate('/');
					return;
				}

				setExercises(await res_exercises.json());
			}
		}
	}

	useEffect(() => {
		setUserData();
		setEntriesData();
		setWorkoutsData();
		setExercisesData();
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
