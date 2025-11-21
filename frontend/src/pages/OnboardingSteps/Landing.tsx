import { useNavigate } from 'react-router-dom';

export default function Landing() {
	const navigate = useNavigate();

	const handleStart = () => {
		// Wir speichern hier NICHTS — Onboarding beginnt erst bei BasicInfo
		navigate('/onboarding/basic');
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-2">Welcome to Trainem</h1>
			<p className="text-gray-600 mb-6">Let’s start setting up your profile.</p>

			<div className="flex gap-2">
				<button
					onClick={handleStart}
					className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
				>
					Start now!
				</button>
			</div>
		</div>
	);
}
