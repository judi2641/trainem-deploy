import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

export default function CharacterColor() {
	const navigate = useNavigate();
	const { updateUserData, submitPlanData, submitUserData, getCurrentGoal } = useOnboarding();

	const currentgoal = getCurrentGoal();
	console.log('Goal detected:', currentgoal);

	// -------------------------------------------------------------
	// 1) Avatar-Pfade definieren (Aufbau vs. Abnahme)
	// -------------------------------------------------------------
	const buildImages = [
		{
			id: 1,
			src: '/assets/avatar/muskelaufbau/blauLevel1Aufbau.png',
			fileName: 'blauLevel1Aufbau.png',
		},
		{
			id: 2,
			src: '/assets/avatar/muskelaufbau/gelbLevel1Aufbau.png',
			fileName: 'gelbLevel1Aufbau.png',
		},
		{
			id: 3,
			src: '/assets/avatar/muskelaufbau/lilaLevel1Aufbau.png',
			fileName: 'lilaLevel1Aufbau.png',
		},
	];

	const cutImages = [
		{
			id: 1,
			src: '/assets/avatar/abnahme/blauLevel1Abnahme.png',
			fileName: 'blauLevel1Abnahme.png',
		},
		{
			id: 2,
			src: '/assets/avatar/abnahme/gelbLevel1Abnahme.png',
			fileName: 'gelbLevel1Abnahme.png',
		},
		{
			id: 3,
			src: '/assets/avatar/abnahme/lilaLevel1Abnahme.png',
			fileName: 'lilaLevel1Abnahme.png',
		},
	];

	// -------------------------------------------------------------
	// 2) Entscheiden, welche Bilder benutzt werden
	// -------------------------------------------------------------
	const characterOptions = useMemo(() => {
		// useMemo Damit characterOptions nur dann neu berechnet werden, wenn sich currentgoal ändert

		if (
			currentgoal === 'Muskelaufbau: Gewicht halten' ||
			currentgoal === 'Muskelaufbau: Gewicht erhöhen'
		) {
			return buildImages; // Aufbau
		}

		if (currentgoal === 'Muskelaufbau: Gewicht senken') {
			return cutImages; // Abnahme
		}

		// Fallback
		return buildImages;
	}, [currentgoal]);

	// -------------------------------------------------------------
	// 3) Auswahlzustand
	// -------------------------------------------------------------
	const [selected, setSelected] = useState<number | null>(null);

	const handleSelect = (id: number) => {
		setSelected(id);
	};

	// -------------------------------------------------------------
	// 4) Abschluss
	// -------------------------------------------------------------
	const handleFinish = async () => {
		const selectedOption = characterOptions.find((c) => c.id === selected);

		if (!selectedOption) {
			console.error('No character selected');
			return;
		}
		const fileName = selectedOption.fileName; // z.B. "blauLevel1Aufbau.png"
		console.log('Selected character fileName:', fileName);
		updateUserData({ img: fileName });
		// Es passiert noch nichts mit der Auswahl des Users im Backend
		await submitUserData();
		await submitPlanData();

		navigate('/dashboard');
	};

	// -------------------------------------------------------------
	// 5) JSX / UI
	// -------------------------------------------------------------
	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">Choose Your Character</h2>
			<p className="text-sm text-gray-600 mb-4">
				Select a character color. Click an image to choose.
			</p>

			{/* 3 Bilder nebeneinander */}
			<div className="grid grid-cols-3 gap-4">
				{characterOptions.map((option) => {
					const isSelected = selected === option.id;

					return (
						<div
							key={option.id}
							onClick={() => handleSelect(option.id)}
							className={`
								cursor-pointer border rounded-lg p-2 transition flex items-center justify-center
								${isSelected ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300 hover:border-gray-400'}
							`}
						>
							<img
								src={option.src}
								alt={`Character ${option.id}`}
								className="w-full h-auto object-contain rounded"
							/>
						</div>
					);
				})}
			</div>

			{/* Navigation */}
			<div className="flex justify-between mt-6">
				<button
					onClick={() => navigate(-1)}
					className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
				>
					Back
				</button>

				<button
					onClick={handleFinish}
					disabled={selected === null}
					className={`
						px-4 py-2 rounded
						${
							selected !== null
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
