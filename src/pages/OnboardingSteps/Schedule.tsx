import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { TrainingDays } from '../../../../shared/types/other/TrainingDays';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const daysOfWeek: { key: TrainingDays; label: string }[] = [
	{ key: 'Mon', label: 'Mon' },
	{ key: 'Tue', label: 'Tue' },
	{ key: 'Wed', label: 'Wed' },
	{ key: 'Thu', label: 'Thu' },
	{ key: 'Fri', label: 'Fri' },
	{ key: 'Sat', label: 'Sat' },
	{ key: 'Sun', label: 'Sun' },
];

const daysPerWeekOptions = [2, 3, 4, 5, 6];
const minutesOptions = [30, 45, 60, 75];

export default function Schedule() {
	const navigate = useNavigate();
	const { planData, updatePlanData } = useOnboarding();

	const [selected, setSelected] = useState<TrainingDays[]>(planData.trainingDays || []);
	const [daysPerWeek, setDaysPerWeek] = useState<number | null>(planData.daysPerWeek ?? null);
	const [minutesPerSession, setMinutesPerSession] = useState<number | null>(
		planData.minutesPerSession ?? null,
	);

	const toggleDay = (day: TrainingDays) => {
		if (!daysPerWeek) {
			alert('Please choose the number of days per week first.');
			return;
		}

		let updatedDays: TrainingDays[];

		if (selected.includes(day)) {
			updatedDays = selected.filter((d) => d !== day);
		} else {
			if (selected.length >= daysPerWeek) {
				alert(`You already selected ${daysPerWeek} days.`);
				return;
			}
			updatedDays = [...selected, day];
		}

		setSelected(updatedDays);
		updatePlanData({ trainingDays: updatedDays });
	};

	const handleFinish = async () => {
		if (!daysPerWeek) {
			alert('Please choose how many days per week you train.');
			return;
		}

		if (!minutesPerSession) {
			alert('Please choose the duration per session.');
			return;
		}

		if (selected.length !== daysPerWeek) {
			alert(`Please select exactly ${daysPerWeek} training days.`);
			return;
		}

		updatePlanData({
			daysPerWeek,
			minutesPerSession,
			trainingDays: selected,
		});

		console.log('Final onboarding data:', {
			userData: planData,
			planData,
		});

		navigate('/onboarding/intro');
	};

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-lg font-semibold mb-2">Training Frequency and Time</h2>
				<p className="text-sm text-gray-600 mb-4">How often and how long do you train?</p>

				<div className="mb-6">
					<p className="mb-2 font-medium">Days per week</p>
					<div className="flex flex-wrap gap-3">
						{daysPerWeekOptions.map((days) => (
							<Button
								key={days}
								variant={daysPerWeek === days ? 'default' : 'outline'}
								onClick={() => {
									setDaysPerWeek(days);
									updatePlanData({ daysPerWeek: days });

									if (selected.length > days) {
										setSelected([]);
										updatePlanData({ trainingDays: [] });
									}
								}}
								className={`px-5 py-2 ${
									daysPerWeek === days
										? 'bg-indigo-600 text-white border-indigo-600'
										: 'border-gray-300'
								}`}
							>
								{days}
							</Button>
						))}
					</div>
				</div>

				<div className="mb-6">
					<p className="mb-2 font-medium">Minutes per session</p>
					<div className="flex flex-wrap gap-3">
						{minutesOptions.map((minutes) => (
							<Button
								key={minutes}
								variant={minutesPerSession === minutes ? 'default' : 'outline'}
								onClick={() => {
									setMinutesPerSession(minutes);
									updatePlanData({ minutesPerSession: minutes });
								}}
								className={`px-5 py-2 ${
									minutesPerSession === minutes
										? 'bg-indigo-600 text-white border-indigo-600'
										: 'border-gray-300'
								}`}
							>
								{minutes} min
							</Button>
						))}
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-2">Select Training Days</h3>
				<p className="text-sm text-gray-600 mb-4">Choose your specific days.</p>

				<div className="grid grid-cols-3 md:grid-cols-4 gap-3">
					{daysOfWeek.map((day) => {
						const isSelected = selected.includes(day.key);

						return (
							<Button
								key={day.key}
								variant={isSelected ? 'default' : 'outline'}
								onClick={() => toggleDay(day.key)}
								className={`w-full py-3 text-md rounded-lg ${
									isSelected ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600' : ''
								}`}
							>
								{day.label}
							</Button>
						);
					})}
				</div>
			</div>

			<div className="flex justify-between mt-6">
				<Button
					onClick={() => navigate('/onboarding/goals')}
					variant="outline"
					className="h-11 w-11 p-0 flex items-center justify-center"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<Button onClick={handleFinish} className="bg-amber-400 hover:bg-amber-500 text-black">
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
