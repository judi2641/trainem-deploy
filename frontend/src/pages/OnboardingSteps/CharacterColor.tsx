import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PixelCanvas from '@/components/PixelCanvas';

export default function CharacterColor() {
	const navigate = useNavigate();
	const { updateUserData, submitUserData, submitPlanData } = useOnboarding();

	const [pixelImage, setPixelImage] = useState('');
	const [usedPixels, setUsedPixels] = useState(0);

	const level = 0;
	const unlockedPixels = 12 + level;

	const handleFinish = async () => {
		if (!pixelImage || usedPixels === 0) {
			alert('Please place at least one pixel.');
			return;
		}

		updateUserData({ img: pixelImage });
		await submitUserData();
		await submitPlanData();
		navigate('/onboarding/intro');
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold mb-2">Paint Your Pixel Avatar</h2>
				<p className="text-sm text-gray-600">
					Start at level {level} and place your first pixels. Click a pixel to paint, click again to
					erase.
				</p>
			</div>

			<PixelCanvas
				gridSize={64}
				maxPixels={unlockedPixels}
				onChange={(dataUrl, count) => {
					setPixelImage(dataUrl);
					setUsedPixels(count);
				}}
			/>

			<div className="flex items-center gap-4">
				<div className="h-20 w-20 rounded-lg border bg-white flex items-center justify-center">
					{pixelImage ? (
						<img
							src={pixelImage}
							alt="Pixel avatar preview"
							className="w-full h-full object-contain"
						/>
					) : (
						<span className="text-xs text-slate-400">Preview</span>
					)}
				</div>
				<p className="text-sm text-slate-600">
					Leveling up unlocks more pixels. Complete tasks to expand your canvas.
				</p>
			</div>

			<div className="flex justify-between mt-10">
				<Button
					onClick={() => navigate('/onboarding/pixel-intro')}
					variant="outline"
					className="h-11 w-11 p-0 flex items-center justify-center"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<Button
					onClick={handleFinish}
					disabled={usedPixels === 0}
					className={`
            h-11 w-11 p-0 flex items-center justify-center
            ${
							usedPixels > 0
								? 'bg-green-600 hover:bg-green-700 text-white'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}
          `}
				>
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
