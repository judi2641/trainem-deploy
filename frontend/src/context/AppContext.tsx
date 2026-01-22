import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>(null);
export function ContextProvider({ children }: { children: React.ReactNode }) {
	const [myUser, setMyUser] = useState<any | null>(null);
	const [workouts, setWorkouts] = useState<any[]>([]);
	const [entries, setEntries] = useState<any[]>([]);
	const [exercises, setExercises] = useState<any[]>([]);
	const [habits, setHabits] = useState<any[]>([]);
	const [pixelArt, setPixelArt] = useState<any>(null);
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
