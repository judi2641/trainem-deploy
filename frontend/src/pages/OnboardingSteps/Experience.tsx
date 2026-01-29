import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { TrainingsExperience } from '../../../../shared/types/other/TrainingsExperience';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Experience() {
	const navigate = useNavigate();
	const { planData, updatePlanData } = useOnboarding();

	const [selectedExperience, setSelectedExperience] = useState<TrainingsExperience | null>(
		planData.experience ?? null,
	);
	const [weight, setWeight] = useState(planData.weight ?? '');
	const [height, setHeight] = useState(planData.height ?? '');
	const [equipment, setEquipment] = useState<string | null>(planData.equipment ?? null);
	const [preferredSplit, setPreferredSplit] = useState<string | null>(
		planData.preferredSplit ?? null,
	);
	const initialLimitations = planData.limitations === 'None' ? '' : (planData.limitations ?? '');
	const [limitations, setLimitations] = useState(initialLimitations);
	const [noLimitations, setNoLimitations] = useState(planData.limitations === 'None');
	const [storedLimitations, setStoredLimitations] = useState(initialLimitations);

	const levels = [
		{ key: 'beginner', label: 'Beginner (<6 months)' },
		{ key: 'intermediate', label: 'Intermediate (6-24 months)' },
		{ key: 'experienced', label: 'Experienced (2+ years)' },
	];

	const equipmentOptions = [
		'Home (no equipment)',
		'Dumbbells',
		'Barbell + Rack',
		'Gym',
		'Calisthenics (bar/rings)',
	];

	const splitOptions = ['Full Body', 'Upper/Lower', 'Push-Pull-Legs', 'No preference'];

	const handleNext = () => {
		if (!selectedExperience) {
			alert('Please choose your experience level.');
			return;
		}

		if (!equipment) {
			alert('Please choose your equipment setup.');
			return;
		}

		if (!preferredSplit) {
			alert('Please choose a training split (or No preference).');
			return;
		}

		if (!noLimitations && !limitations.trim()) {
			alert('Please add limitations or check "No limitations".');
			return;
		}

		updatePlanData({
			experience: selectedExperience,
			weight: weight ? Number(weight) : undefined,
			height: height ? Number(height) : undefined,
			equipment,
			preferredSplit,
			limitations: noLimitations ? 'None' : limitations.trim(),
		});

		navigate('/onboarding/goals');
	};

	return (
		<div className="space-y-8">
			{/* Bodytype Info */}
			<div>
				<h2 className="text-xl font-bold mb-4">Body Info</h2>

				{/* Weight */}
				<div className="mb-4">
					<Label htmlFor="weight">Weight (kg)</Label>
					<Input
						id="weight"
						type="text"
						inputMode="numeric"
						placeholder="e.g. 70"
						value={weight}
						onChange={(e) => setWeight(e.target.value.replace(/[^0-9]/g, ''))}
						className="mt-1"
					/>
				</div>

				{/* Height */}
				<div className="mb-4">
					<Label htmlFor="height">Height (cm)</Label>
					<Input
						id="height"
						type="text"
						inputMode="numeric"
						placeholder="e.g. 175"
						value={height}
						onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, ''))}
						className="mt-1"
					/>
				</div>
			</div>

			{/* Experience */}
			<div>
				<h2 className="text-xl font-bold mb-2">Your Experience</h2>
				<p className="text-gray-600 mb-10">How much training experience do you have?</p>

				<div className="flex flex-wrap gap-4 justify-center mt-4">
					{levels.map((lvl) => (
						<Button
							key={lvl.key}
							variant={selectedExperience === lvl.key ? 'default' : 'outline'}
							onClick={() => setSelectedExperience(lvl.key as TrainingsExperience)}
							className={`px-6 py-3 text-lg rounded-lg transition ${
								selectedExperience === lvl.key
									? 'bg-primary text-white border-primary'
									: 'border-gray-300'
							}`}
						>
							{lvl.label}
						</Button>
					))}
				</div>
			</div>

			{/* Equipment */}
			<div>
				<h2 className="text-xl font-bold mb-2">Equipment</h2>
				<p className="text-gray-600 mb-4">What equipment do you have access to?</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{equipmentOptions.map((option) => {
						const isSelected = equipment === option;

						return (
							<Button
								key={option}
								variant="outline"
								onClick={() => setEquipment(option)}
								className={`justify-start h-auto py-3 px-4 ${
									isSelected ? 'bg-primary text-white border-primary' : 'border-gray-300'
								}`}
							>
								{option}
							</Button>
						);
					})}
				</div>
			</div>

			{/* Preferred Split */}
			<div>
				<h2 className="text-xl font-bold mb-2">Preferred Training Split</h2>
				<p className="text-gray-600 mb-4">Optional but helpful (or No preference).</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{splitOptions.map((option) => {
						const isSelected = preferredSplit === option;

						return (
							<Button
								key={option}
								variant="outline"
								onClick={() => setPreferredSplit(option)}
								className={`justify-start h-auto py-3 px-4 ${
									isSelected ? 'bg-primary text-white border-primary' : 'border-gray-300'
								}`}
							>
								{option}
							</Button>
						);
					})}
				</div>
			</div>

			{/* Limitations */}
			<div>
				<h2 className="text-xl font-bold mb-2">Limitations</h2>
				<p className="text-gray-600 mb-4">Injuries or pain, and what you cannot do.</p>

				<label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
					<input
						type="checkbox"
						checked={noLimitations}
						onChange={(e) => {
							const checked = e.target.checked;
							setNoLimitations(checked);

							if (checked) {
								setStoredLimitations(limitations);
								setLimitations('None');
							} else {
								setLimitations(storedLimitations);
							}
						}}
					/>
					No limitations
				</label>

				<textarea
					value={noLimitations ? '' : limitations}
					onChange={(e) => setLimitations(e.target.value)}
					placeholder='e.g. "no squats", "no overhead pressing"'
					disabled={noLimitations}
					className={`w-full min-h-[96px] rounded-md border p-3 text-sm ${
						noLimitations
							? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'border-gray-300'
					}`}
				/>
			</div>

			{/* Navigation */}
			<div className="flex justify-between mt-10">
				<button
					onClick={() => navigate('/onboarding/basic')}
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
