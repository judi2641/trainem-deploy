import { createContext, useContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { TrainingsGoals } from '../../../shared/types/other/TrainingsGoal';
import type { TrainingsExperience } from '../../../shared/types/other/TrainingsExperience';
import type { TrainingDays } from '../../../shared/types/other/TrainingDays';
import { useMyContext } from '../context/AppContext';

// ------------------------------------------------------
// TYPES
// ------------------------------------------------------

export interface IUserInfo {
	firstname?: string;
	lastname?: string;
	birthDate?: string;
	gender?: string;
	img?: string;
}

export interface IPlanInfo {
	goal: TrainingsGoals | null;
	experience: TrainingsExperience | null;
	trainingDays: TrainingDays[];
	weight?: number | null;
	height?: number | null;
	daysPerWeek?: number | null;
	minutesPerSession?: number | null;
	equipment?: string | null;
	limitations?: string | null;
	preferredSplit?: string | null;
	priorities?: string[];
}

interface OnboardingContextType {
	userData: IUserInfo;
	planData: IPlanInfo;
	wantsAiWorkouts: boolean | null;

	updateUserData: (patch: Partial<IUserInfo>) => void;
	updatePlanData: (patch: Partial<IPlanInfo>) => void;
	setWantsAiWorkouts: (value: boolean) => void;

	submitUserData: () => Promise<void>;
	submitPlanData: () => Promise<void>;
}

// ------------------------------------------------------
// CONTEXT
// ------------------------------------------------------

const OnboardingContext = createContext<OnboardingContextType | null>(null);

// ------------------------------------------------------
// PROVIDER
// ------------------------------------------------------

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth0();
	const { setWorkouts } = useMyContext();

	const [userData, setUserData] = useState<IUserInfo>({
		firstname: '',
		lastname: '',
		birthDate: '',
		gender: '',
		img: '',
	});

	const [planData, setPlanData] = useState<IPlanInfo>({
		goal: null,
		experience: null,
		trainingDays: [],
		weight: null,
		height: null,
		daysPerWeek: null,
		minutesPerSession: null,
		equipment: null,
		limitations: '',
		preferredSplit: null,
		priorities: [],
	});
	const [wantsAiWorkouts, setWantsAiWorkouts] = useState<boolean | null>(null);

	const updateUserData = (patch: Partial<IUserInfo>) => {
		setUserData((prev) => ({ ...prev, ...patch }));
	};

	const updatePlanData = (patch: Partial<IPlanInfo>) => {
		setPlanData((prev) => ({ ...prev, ...patch }));
	};

	const submitUserData = async () => {
		if (isLoading) {
			console.warn('Auth0 still loadingâ€¦ delaying user submit');
			setTimeout(submitUserData, 200);
			return;
		}

		if (!user?.sub) {
			console.error('No Auth0 user ID found');
			return;
		}

		try {
			const res = await fetch(`http://localhost:3000/api/user/${user.sub}/basic`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					firstname: userData.firstname,
					lastname: userData.lastname,
					birthDate: userData.birthDate,
					gender: userData.gender,
					img: userData.img,
				}),
			});

			if (!res.ok) throw new Error('Error saving user basic info');

			console.log('âœ” User basic info saved successfully');

			const res_onboarding_workout = await fetch(`http://localhost:3000/api/workouts/onboarding`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					auth0Id: user.sub,
					name: 'onboarding workout',
					description: 'created in onboarding',
				}),
			});
			if (!res_onboarding_workout.ok) throw new Error('Error creating inital workout');
			const new_workout = await res_onboarding_workout.json();
			setWorkouts((prev: any) => [...prev, new_workout]);
			console.log('inital workout created');
		} catch (err) {
			console.error('API error:', err);
		}
	};

	const submitPlanData = async () => {
		if (!user?.sub) {
			console.error('No Auth0 ID found');
			return;
		}

		if (wantsAiWorkouts === false) {
			return;
		}

		try {
			const res = await fetch(`http://localhost:3000/api/workouts/ai`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					auth0Id: user.sub,
					onboarding: {
						goal: planData.goal,
						experience: planData.experience,
						trainingDays: planData.trainingDays,
						weight: planData.weight,
						height: planData.height,
						daysPerWeek: planData.daysPerWeek,
						minutesPerSession: planData.minutesPerSession,
						equipment: planData.equipment,
						limitations: planData.limitations,
						preferredSplit: planData.preferredSplit,
						priorities: planData.priorities,
					},
				}),
			});

			if (!res.ok) {
				throw new Error('Error creating AI workouts');
			}

			const aiWorkouts = await res.json();
			if (Array.isArray(aiWorkouts)) {
				setWorkouts((prev: any) => [...prev, ...aiWorkouts]);
			}
			console.log('âœ” AI workouts created successfully');
		} catch (err) {
			console.error('API error:', err);
		}
	};

	return (
		<OnboardingContext.Provider
			value={{
				userData,
				planData,
				wantsAiWorkouts,
				updateUserData,
				updatePlanData,
				setWantsAiWorkouts,
				submitUserData,
				submitPlanData,
			}}
		>
			{children}
		</OnboardingContext.Provider>
	);
}

// ------------------------------------------------------
// HOOK
// ------------------------------------------------------

export function useOnboarding() {
	const ctx = useContext(OnboardingContext);

	if (!ctx) {
		throw new Error('useOnboarding must be used inside OnboardingProvider');
	}

	return ctx;
}
