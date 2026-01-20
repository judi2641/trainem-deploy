import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function PixelIntro() {
	const navigate = useNavigate();

	return (
		<div className="space-y-8">
			<div className="text-center space-y-3">
				<p className="text-sm uppercase tracking-[0.2em] text-emerald-600 font-semibold">
					Your Creative Start
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Paint your own pixel avatar</h2>
				<p className="text-gray-600 max-w-xl mx-auto">
					This is your personal pixel board. The more consistent you are, the more detail you can add.
				</p>
			</div>

			<div className="grid gap-4 text-left">
				<div className="p-5 bg-white shadow-md rounded-xl border border-emerald-100">
					<h3 className="text-lg font-semibold mb-2 text-slate-900">Level 0: Start Small</h3>
					<p className="text-gray-600">
						You begin with 12 unlocked pixels. Use them to sketch your profile image and claim your
						first look.
					</p>
				</div>
				<div className="p-5 bg-white shadow-md rounded-xl border border-emerald-100">
					<h3 className="text-lg font-semibold mb-2 text-slate-900">Complete Tasks</h3>
					<p className="text-gray-600">
						Every completed task gives you points and levels. Each new level unlocks +1 pixel.
					</p>
				</div>
				<div className="p-5 bg-white shadow-md rounded-xl border border-emerald-100">
					<h3 className="text-lg font-semibold mb-2 text-slate-900">Pixel Wars Vibes</h3>
					<p className="text-gray-600">
						Think of it like a personal pixel board. The more consistent you are, the more detailed
						your avatar becomes.
					</p>
				</div>
			</div>

			<div className="flex justify-between mt-10">
				<Button
					onClick={() => navigate('/onboarding/schedule')}
					variant="outline"
					className="h-11 w-11 p-0 flex items-center justify-center"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<Button
					onClick={() => navigate('/onboarding/CharacterColor')}
					className="h-11 w-11 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
				>
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
