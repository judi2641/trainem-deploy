import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// 👉 PNG-Links zentral gespeichert
// Füge hier deine 5 Bilder ein:
const characterImages = {
	char1: '../../../public/assets/avatar/abnahme/blauLevel1Abnahme.png',
	char2: '../../../public/assets/avatar/abnahme/gelbLevel1Abnahme.png',
	char3: '../../../public/assets/avatar/abnahme/lilaLevel1Abnahme.png',
	char4: '../../../public/assets/avatar/abnahme/rotLevel1Abnahme.png', // findet nicht???
	char5: '../../../public/assets/avatar/abnahme/weißLevel1Abnahme.png',
};

export default function CharacterColor() {
	const navigate = useNavigate();
	const { updateUserData, submitUserData, submitPlanData } = useOnboarding();

	// 👉 Optionen werden automatisch aus characterImages erzeugt
	const characterOptions = [
		{ id: 1, src: characterImages.char1 },
		{ id: 2, src: characterImages.char2 },
		{ id: 3, src: characterImages.char3 },
		{ id: 4, src: characterImages.char4 },
		{ id: 5, src: characterImages.char5 },
	];

	const [selected, setSelected] = useState<number | null>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const handleSelect = (id: number, src: string) => {
		setSelected(id);
		setSelectedImage(src);

		updateUserData({ img: src });
	};

	const handleFinish = async () => {
		console.log('Selected character:', selected);
		console.log('Selected IMAGE:', selectedImage);
		await submitUserData();
		await submitPlanData();
		navigate('/onboarding/intro');
	};

	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">Choose Your Character</h2>
			<p className="text-sm text-gray-600 mb-4">
				Select a character color. Click an image to choose.
			</p>

			{/* 5 Bilder → Grid anpassen */}
			<div className="grid grid-cols-5 gap-4">
				{characterOptions.map((option) => {
					const isSelected = selected === option.id;

					return (
						<div
							key={option.id}
							onClick={() => handleSelect(option.id, option.src)}
							className={`
								cursor-pointer border rounded-lg p-2 transition
								flex items-center justify-center
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
