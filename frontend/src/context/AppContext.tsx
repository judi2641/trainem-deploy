import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AppContext = createContext<any>(null);
export function ContextProvider({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth0();
	const [myUser, setMyUser] = useState<any | null>(null);
	const [workouts, setWorkouts] = useState<any[]>([]);
	const [entries, setEntries] = useState<any[]>([]);
	const [exercises, setExercises] = useState<any[]>([]);
	const [habits, setHabits] = useState<any[]>([]);
	const [pixelArt, setPixelArt] = useState<any>(null);

	useEffect(() => {
		let isMounted = true;

		async function loadUser() {
			if (isLoading || !user?.sub) return;
			try {
				const res = await fetch(`http://localhost:3000/api/user/${encodeURIComponent(user.sub)}`);
				if (!res.ok) return;
				const data = await res.json();
				if (isMounted) {
					setMyUser(data);
				}
			} catch (error) {
				console.error('Fehler beim Laden des Users', error);
			}
		}

		loadUser();

		return () => {
			isMounted = false;
		};
	}, [isLoading, user?.sub]);
	useEffect(() => {
		if (isLoading || !user?.sub) return;

		async function loadAppData() {
			try {
				// Parallel fetchen ist schneller als nacheinander
				const [workoutsRes, entriesRes, habitsRes, exercisesRes] = await Promise.all([
					fetch(`http://localhost:3000/api/workouts/${user!.sub}`),
					fetch(`http://localhost:3000/api/entries/${user!.sub}`),
					fetch(`http://localhost:3000/api/habits/${user!.sub}`),
					fetch(`http://localhost:3000/api/exercises`),
				]);

				if (workoutsRes.ok) setWorkouts(await workoutsRes.json());
				if (entriesRes.ok) setEntries(await entriesRes.json());
				if (habitsRes.ok) setHabits(await habitsRes.json());
				if (exercisesRes.ok) setExercises(await exercisesRes.json());
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
