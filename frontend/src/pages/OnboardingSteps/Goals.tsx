import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { GoalType } from '../../../../shared/types/User';

export default function Goals() {
	const navigate = useNavigate();
	const { planData, updatePlanData } = useOnboarding();

	const [selected, setSelected] = useState<GoalType | null>(planData.goal || null);

	// Valid GoalType keys from your shared User.ts
	const options: { key: GoalType; label: string; desc: string }[] = [
		{
			key: 'Muskelaufbau: Gewicht senken',
			label: 'Lose Weight',
			desc: 'Reduce your body weight sustainably.',
		},
		{
			key: 'Muskelaufbau: Gewicht halten',
			label: 'Maintain Weight',
			desc: 'Stay balanced and maintain your progress.',
		},
		{
			key: 'Muskelaufbau: Gewicht erhöhen',
			label: 'Build Muscle',
			desc: 'Increase strength and gain muscle mass.',
		},
	];

	const handleNext = () => {
		if (!selected) return;
		updatePlanData({ goal: selected });
		navigate('/onboarding/schedule');
	};

	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">What is your main goal?</h2>
			<p className="text-sm text-gray-600 mb-4">Select one primary fitness goal.</p>

			{/* Selection Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{options.map((o) => {
					const isSelected = o.key === selected;

					return (
						<button
							key={o.key}
							onClick={() => {
								setSelected(o.key);
								updatePlanData({ goal: o.key });
							}}
							className={`
                p-4 rounded-lg text-left border transition
                ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}
              `}
						>
							<div className="font-medium">{o.label}</div>
							<div className="text-sm text-gray-500">{o.desc}</div>
						</button>
					);
				})}
			</div>

			{/* Navigation */}
			<div className="flex justify-between mt-6">
				{/* Back */}
				<button
					className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
					onClick={() => navigate(-1)}
				>
					Back
				</button>

				{/* Next */}
				<button
					disabled={!selected}
					onClick={handleNext}
					className={`
            px-4 py-2 rounded
            ${
							selected
								? 'bg-indigo-600 text-white hover:bg-indigo-700'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}
          `}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
