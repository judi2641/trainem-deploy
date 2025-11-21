import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { ExperienceType } from '../../../../shared/types/User';

export default function Experience() {
	const navigate = useNavigate();
	const { planData, updatePlanData, submitUserData } = useOnboarding();

	// Vorbefüllung falls Nutzer zurückkehrt
	const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(
		planData.experience ?? null,
	);

	const [weight, setWeight] = useState(planData.weight ?? '');
	const [height, setHeight] = useState(planData.height ?? '');

	// Nur Experience wird geprüft – Größe & Gewicht sind optional
	const handleNext = () => {
		if (!selectedExperience) {
			alert('Bitte wähle ein Erfahrungslevel aus.');
			return;
		}

		updatePlanData({
			experience: selectedExperience,
			weight: weight ? Number(weight) : undefined,
			height: height ? Number(height) : undefined,
		});
		submitUserData();
		navigate('/onboarding/goals');
	};

	const levels = [
		{ key: 'starter', label: 'starter' },
		{ key: 'intermediate', label: 'intermediate' },
		{ key: 'pro', label: 'pro' },
	];
	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Bodytype Info</h2>

			{/* Gewicht */}
			<p className="mb-2 font-medium">Weight (kg)</p>
			<input
				type="number"
				placeholder="Weight"
				value={weight}
				onChange={(e) => setWeight(e.target.value)}
				className="border p-2 rounded w-full mb-4"
			/>

			{/* Größe */}
			<p className="mb-2 font-medium">Height (cm)</p>
			<input
				type="number"
				placeholder="Height"
				value={height}
				onChange={(e) => setHeight(e.target.value)}
				className="border p-2 rounded w-full mb-4"
			/>

			<h2 className="text-xl font-bold mb-4">Your Experience</h2>
			<p className="text-gray-600 mb-6">Wie viel Trainingserfahrung hast du bisher?</p>

			{/* Level Auswahl */}
			<div className="flex gap-4">
				{levels.map((lvl) => (
					<button
						key={lvl.key}
						onClick={() => setSelectedExperience(lvl.key as ExperienceType)}
						className={`px-4 py-2 border rounded transition ${
							selectedExperience === lvl.key
								? 'bg-indigo-600 text-white border-indigo-600'
								: 'hover:bg-gray-50'
						}`}
					>
						{lvl.label}
					</button>
				))}
			</div>

			{/* Navigation */}
			<div className="flex justify-between mt-6">
				<button
					onClick={() => navigate('/onboarding/basic')}
					className="px-4 py-2 border rounded hover:bg-gray-50"
				>
					Back
				</button>

				<button
					onClick={handleNext}
					className={`px-4 py-2 rounded ${
						selectedExperience
							? 'bg-indigo-600 text-white hover:bg-indigo-700'
							: 'bg-gray-300 text-gray-500 cursor-not-allowed'
					}`}
					disabled={!selectedExperience}
				>
					Next
				</button>
			</div>
		</div>
	);
}
