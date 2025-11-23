import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { TrainingDays } from '../../../../shared/types/other/TrainingDays';

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
	const { planData, updatePlanData, submitPlanData } = useOnboarding();

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

		await submitPlanData();
		navigate('/dashboard');
	};

	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">Training Schedule</h2>
			<p className="text-sm text-gray-600 mb-4">Select the days you are available for training.</p>

			<div className="grid grid-cols-4 gap-2">
				{daysOfWeek.map((day) => {
					const isSelected = selected.includes(day.key);

					return (
						<button
							key={day.key}
							onClick={() => toggleDay(day.key)}
							className={`
                py-2 rounded-lg border transition text-center
                ${
									isSelected
										? 'bg-indigo-600 text-white border-indigo-600'
										: 'border-gray-300 hover:bg-gray-50'
								}
              `}
						>
							{day.label}
						</button>
					);
				})}
			</div>

			<div className="flex justify-between mt-6">
				<button
					onClick={() => navigate(-1)}
					className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
				>
					Back
				</button>

				<button
					onClick={handleFinish}
					disabled={selected.length === 0}
					className={`
            px-4 py-2 rounded
            ${
							selected.length > 0
								? 'bg-indigo-600 text-white hover:bg-indigo-700'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}
          `}
				>
					Finish
				</button>
			</div>
		</div>
	);
}
