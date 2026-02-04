import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AppContext = createContext<any>(null);
export function ContextProvider({ children }: { children: React.ReactNode }) {
	const { user, isLoading, getAccessTokenSilently } = useAuth0();
	const [myUser, setMyUser] = useState<any | null>(null);
	const [workouts, setWorkouts] = useState<any[]>([]);
	const [entries, setEntries] = useState<any[]>([]);
	const [exercises, setExercises] = useState<any[]>([]);
	const [habits, setHabits] = useState<any[]>([]);
	const [pixelArt, setPixelArt] = useState<any>(null);

	// Lade Exercises einmalig (unabhängig vom User)
	useEffect(() => {
		async function loadExercises() {
			try {
				if (isLoading || !user?.sub) return;
				const token = await getAccessTokenSilently();
				const res = await fetch('https://trainem-deploy-production.up.railway.app/api/exercises', {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.ok) {
					const data = await res.json();
					setExercises(data);
				}
			} catch (error) {
				console.error('Fehler beim Laden der Exercises', error);
			}
		}
		loadExercises();
	}, [getAccessTokenSilently, isLoading, user?.sub]);

	// Lade User-Daten wenn eingeloggt
	useEffect(() => {
		let isMounted = true;

		async function loadUserData() {
			if (isLoading || !user?.sub) return;
			try {
				const token = await getAccessTokenSilently();
				// User laden
				const userRes = await fetch(
					`https://trainem-deploy-production.up.railway.app/api/user/${encodeURIComponent(user.sub)}`,
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (userRes.ok) {
					const userData = await userRes.json();
					if (isMounted) setMyUser(userData);
				}

				// Habits laden
				const habitsRes = await fetch(
					`https://trainem-deploy-production.up.railway.app/api/habits/${encodeURIComponent(user.sub)}`,
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (habitsRes.ok) {
					const habitsData = await habitsRes.json();
					if (isMounted) setHabits(habitsData);
				}

				// Workouts laden
				const workoutsRes = await fetch(
					`https://trainem-deploy-production.up.railway.app/api/workouts/${encodeURIComponent(user.sub)}`,
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (workoutsRes.ok) {
					const workoutsData = await workoutsRes.json();
					if (isMounted) setWorkouts(workoutsData);
				}

				// Entries laden
				const entriesRes = await fetch(
					`https://trainem-deploy-production.up.railway.app/api/entries/${encodeURIComponent(user.sub)}`,
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (entriesRes.ok) {
					const entriesData = await entriesRes.json();
					if (isMounted) setEntries(entriesData);
				}
			} catch (error) {
				console.error('Fehler beim Laden der User-Daten', error);
			}
		}

		loadUserData();

		return () => {
			isMounted = false;
		};
	}, [getAccessTokenSilently, isLoading, user?.sub]);
	useEffect(() => {
		if (isLoading || !user?.sub) return;

		async function loadAppData() {
			try {
				const token = await getAccessTokenSilently();
				const authHeaders = { Authorization: `Bearer ${token}` };
				// Parallel fetchen ist schneller als nacheinander
				const [workoutsRes, entriesRes, habitsRes, exercisesRes, pixelArtRes] = await Promise.all([
					fetch(`https://trainem-deploy-production.up.railway.app/api/workouts/${user!.sub}`, {
						headers: authHeaders,
					}),
					fetch(`https://trainem-deploy-production.up.railway.app/api/entries/${user!.sub}`, {
						headers: authHeaders,
					}),
					fetch(`https://trainem-deploy-production.up.railway.app/api/habits/${user!.sub}`, {
						headers: authHeaders,
					}),
					fetch(`https://trainem-deploy-production.up.railway.app/api/exercises`, {
						headers: authHeaders,
					}),
					fetch(`https://trainem-deploy-production.up.railway.app/api/pixel-art/${user!.sub}`, {
						headers: authHeaders,
					}),
				]);

				if (workoutsRes.ok) setWorkouts(await workoutsRes.json());
				if (entriesRes.ok) setEntries(await entriesRes.json());
				if (habitsRes.ok) setHabits(await habitsRes.json());
				if (exercisesRes.ok) setExercises(await exercisesRes.json());
				if (pixelArtRes.ok) setPixelArt(await pixelArtRes.json());
			} catch (error) {
				console.error('Fehler beim Laden der App-Daten:', error);
			}
		}

		loadAppData();
	}, [isLoading, user?.sub]);
	return (
		<AppContext.Provider
			value={{
				myUser,
				setMyUser,
				workouts,
				setWorkouts,
				entries,
				setEntries,
				exercises,
				setExercises,
				habits,
				setHabits,
				pixelArt,
				setPixelArt,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useMyContext() {
	return useContext(AppContext);
}
