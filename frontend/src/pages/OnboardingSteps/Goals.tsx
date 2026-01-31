import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Goals() {
	const navigate = useNavigate();
	const { planData, updatePlanData } = useOnboarding();

	const [selected, setSelected] = useState<any | null>(planData.goal || null);
	const [priorities, setPriorities] = useState<string[]>(planData.priorities ?? []);

	const options: { key: any; label: string }[] = [
		{ key: 'Muskelaufbau', label: 'Muscle Gain' },
		{ key: 'Kraft', label: 'Strength' },
		{ key: 'Abnehmen', label: 'Weight Loss' },
		{ key: 'Ausdauer', label: 'Endurance' },
		{ key: 'Allround-Fitness', label: 'All-round Fitness' },
	];

	const priorityOptions = ['Legs + Glutes', 'Back', 'Chest', 'Core', 'Conditioning'];

	const togglePriority = (option: string) => {
		if (priorities.includes(option)) {
			const next = priorities.filter((item) => item !== option);
			setPriorities(next);
			updatePlanData({ priorities: next });
			return;
		}

		if (priorities.length >= 2) {
			alert('Please choose at most 2 priorities.');
			return;
		}

		const next = [...priorities, option];
		setPriorities(next);
		updatePlanData({ priorities: next });
	};

	const handleNext = () => {
		if (!selected) {
			alert('Please choose a goal.');
			return;
		}

		if (priorities.length < 1) {
			alert('Please choose 1-2 priorities.');
			return;
		}

		updatePlanData({ goal: selected, priorities });
		navigate('/onboarding/schedule');
	};

	return (
		<div className="space-y-6">
			{/* TITLE */}
			<div>
				<h2 className="text-lg font-semibold mb-2">Your Goal (choose one)</h2>
				<p className="text-sm text-gray-600">Select your primary training goal.</p>
			</div>

			{/* GOAL BUTTONS */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{options.map((o) => {
					const isSelected = o.key === selected;

					return (
						<Button
							key={o.key}
							variant="outline"
							onClick={() => {
								setSelected(o.key);
								updatePlanData({ goal: o.key });
							}}
							className={`p-4  text-left border h-auto ${
								isSelected ? 'border-primary bg-primary/50' : 'border-gray-300 hover:bg-gray-50'
							}`}
						>
							<span className="font-semibold text-gray-900">{o.label}</span>
						</Button>
					);
				})}
			</div>

			{/* PRIORITIES */}
			<div>
				<h3 className="text-md font-semibold mb-2">Priorities (1-2 areas)</h3>
				<p className="text-sm text-gray-600 mb-4">
					Choose 1-2 body areas or skills that matter most to you.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{priorityOptions.map((option) => {
						const isSelected = priorities.includes(option);

						return (
							<Button
								key={option}
								variant="outline"
								onClick={() => togglePriority(option)}
								className={`justify-start h-auto py-3 px-4 ${
									isSelected ? 'bg-primary  text-white border-primary' : 'border-gray-300'
								}`}
							>
								{option}
							</Button>
						);
					})}
				</div>
			</div>

			{/* NAVIGATION */}
			<div className="flex justify-between mt-6">
				<button
					onClick={() => navigate('/onboarding/experience')}
					className="items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border-2 border-black hover:bg-gray-50 transition-colors"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>

				<button
					className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-400 hover:bg-amber-500"
					onClick={handleNext}
				>
					<ArrowRight className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
}
