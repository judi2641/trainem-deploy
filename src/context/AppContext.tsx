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
