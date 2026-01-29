import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
	const navigate = useNavigate();

	return (
		<div className="text-center space-y-6 py-6">
			<h1 className="text-2xl font-bold">Welcome to TrainEm!</h1>
			<p className="text-muted-foreground">Let's set up your profile in a few quick steps.</p>

			<div className="flex justify-center">
				<Button
					onClick={() => navigate('/onboarding/basic')}
					className="bg-amber-400 hover:bg-amber-500 text-black"
				>
					Start
				</Button>
			</div>
		</div>
	);
}
