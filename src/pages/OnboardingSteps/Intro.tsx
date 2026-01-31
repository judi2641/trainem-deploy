import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function OnboardingSummary() {
	const navigate = useNavigate();

	return (
		<div className="text-center space-y-6">
			<h1 className="text-3xl font-bold text-gray-800">Welcome to TrainEm!</h1>

			<p className="text-gray-600">Before you start, here is how TrainEm works</p>

			<div className="grid gap-4 text-left">
				{/* Pixel Avatar */}
				<div className="p-4 bg-white shadow rounded-lg">
					<h2 className="text-xl font-semibold mb-2">Pixel Avatar</h2>
					<p className="text-gray-600">
						You build your avatar pixel by pixel. Each level unlocks more pixels so your profile
						can grow with your progress.
					</p>
				</div>

				{/* Points System */}
				<div className="p-4 bg-white shadow rounded-lg">
					<h2 className="text-xl font-semibold">Points and Rewards</h2>

					<p className="text-gray-600">
						You can create your own workout from exercises and train at your own pace.
					</p>

					<p className="text-gray-600 mt-2 font-semibold">Level up by:</p>
					<ul className="list-disc ml-6 text-gray-600 mt-1">
						<li>Finishing a workout</li>
						<li>Completing single exercises during a workout</li>
					</ul>

					<p className="text-gray-600 mt-2">
						Each level up unlocks more pixels for your avatar.
					</p>
				</div>

				{/* Personal Plan */}
				<div className="p-4 bg-white shadow rounded-lg">
					<h2 className="text-xl font-semibold">Personalized Training Plan</h2>
					<p className="text-gray-600">
						Based on your goals and experience, TrainEm generates a training plan designed
						specifically for you.
					</p>
				</div>
			</div>

			<div className="flex gap-4 mt-6 justify-center">
				<Button variant="outline" onClick={() => navigate('/onboarding/schedule')}>
					Back
				</Button>

				<Button onClick={() => navigate('/dashboard')}>Start your journey!</Button>
			</div>
		</div>
	);
}
