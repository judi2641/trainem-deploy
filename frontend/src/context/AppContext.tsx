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

	// Lade Exercises einmalig (unabhängig vom User)
	useEffect(() => {
		async function loadExercises() {
			try {
				const res = await fetch('http://localhost:3000/api/exercises');
				if (res.ok) {
					const data = await res.json();
					setExercises(data);
				}
			} catch (error) {
				console.error('Fehler beim Laden der Exercises', error);
			}
		}
		loadExercises();
	}, []);

	// Lade User-Daten wenn eingeloggt
	useEffect(() => {
		let isMounted = true;

		async function loadUserData() {
			if (isLoading || !user?.sub) return;
			try {
				// User laden
				const userRes = await fetch(
					`http://localhost:3000/api/user/${encodeURIComponent(user.sub)}`,
				);
				if (userRes.ok) {
					const userData = await userRes.json();
					if (isMounted) setMyUser(userData);
				}

				// Habits laden
				const habitsRes = await fetch(
					`http://localhost:3000/api/habits/${encodeURIComponent(user.sub)}`,
				);
				if (habitsRes.ok) {
					const habitsData = await habitsRes.json();
					if (isMounted) setHabits(habitsData);
				}

				// Workouts laden
				const workoutsRes = await fetch(
					`http://localhost:3000/api/workouts/${encodeURIComponent(user.sub)}`,
				);
				if (workoutsRes.ok) {
					const workoutsData = await workoutsRes.json();
					if (isMounted) setWorkouts(workoutsData);
				}

				// Entries laden
				const entriesRes = await fetch(
					`http://localhost:3000/api/entries/${encodeURIComponent(user.sub)}`,
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
	}, [isLoading, user?.sub]);
	useEffect(() => {
		if (isLoading || !user?.sub) return;

		async function loadAppData() {
			try {
				// Parallel fetchen ist schneller als nacheinander
				const [workoutsRes, entriesRes, habitsRes, exercisesRes, pixelArtRes] = await Promise.all([
					fetch(`http://localhost:3000/api/workouts/${user!.sub}`),
					fetch(`http://localhost:3000/api/entries/${user!.sub}`),
					fetch(`http://localhost:3000/api/habits/${user!.sub}`),
					fetch(`http://localhost:3000/api/exercises`),
					fetch(`http://localhost:3000/api/pixel-art/${user!.sub}`),
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
