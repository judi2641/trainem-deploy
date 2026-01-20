import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { TrainingDays } from '../../../../shared/types/other/TrainingDays';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import avatar from '/assets/avatar/onboarding/AvatarScheduleOnboarding.png';
const daysOfWeek: { key: TrainingDays; label: string }[] = [
	{ key: 'Mon', label: 'Mon' },
	{ key: 'Tue', label: 'Tue' },
	{ key: 'Wed', label: 'Wed' },
	{ key: 'Thu', label: 'Thu' },
	{ key: 'Fri', label: 'Fri' },
	{ key: 'Sat', label: 'Sat' },
	{ key: 'Sun', label: 'Sun' },
];

export default function Schedule() {
	const navigate = useNavigate();
	const { planData, updatePlanData } = useOnboarding();

	const [selected, setSelected] = useState<TrainingDays[]>(planData.trainingDays || []);

	const toggleDay = (day: TrainingDays) => {
		let updatedDays: TrainingDays[];

		if (selected.includes(day)) {
			updatedDays = selected.filter((d) => d !== day);
		} else {
			updatedDays = [...selected, day];
		}

		setSelected(updatedDays);

		updatePlanData({ trainingDays: updatedDays });
	};

	const handleFinish = async () => {
		console.log('Final onboarding data:', {
			userData: planData,
			planData,
		});

		navigate('/onboarding/pixel-intro');
	};

	return (
		<div className="relative">
			{/*Avatar oben rechts */}
			<img src={avatar} alt="Avatar" className="absolute -top-5 right-0 w-15 h-auto select-none" />

			<h2 className="text-lg font-semibold mb-2">Training Schedule</h2>
			<p className="text-sm text-gray-600 mb-4">Select the days you are available for training.</p>

			<div className="grid grid-cols-3 md:grid-cols-4 gap-3">
				{daysOfWeek.map((day) => {
					const isSelected = selected.includes(day.key);

					return (
						<Button
							key={day.key}
							variant={isSelected ? 'default' : 'outline'}
							onClick={() => toggleDay(day.key)}
							className={`
              w-full py-3 text-md rounded-lg
              ${isSelected ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600' : ''}
            `}
						>
							{day.label}
						</Button>
					);
				})}
			</div>

			<div className="flex justify-between mt-6">
				<Button
					onClick={() => navigate('/onboarding/goals')}
					variant="outline"
					className="h-11 w-11 p-0 flex items-center justify-center"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<Button
					onClick={handleFinish}
					className="h-11 w-11 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
				>
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
