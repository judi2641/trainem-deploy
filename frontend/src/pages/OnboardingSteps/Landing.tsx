import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

export default function Landing() {
	const navigate = useNavigate();
	const { setWantsAiWorkouts } = useOnboarding();

	return (
		<div className="text-center space-y-6 py-6">
			<h1 className="text-2xl font-bold">Welcome to TrainEm!</h1>
			<p className="text-muted-foreground">Would you like us to pre-create workouts for you?</p>

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<button
					className="pixel-btn inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
					onClick={() => {
						setWantsAiWorkouts(true);
						navigate('/onboarding/basic');
					}}
				>
					Yes, create workouts
				</button>
				<button
					className="items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border-2 border-black hover:bg-gray-50 transition-colors"
					onClick={() => {
						setWantsAiWorkouts(false);
						navigate('/onboarding/intro');
					}}
				>
					No, skip
				</button>
			</div>
		</div>
	);
}
