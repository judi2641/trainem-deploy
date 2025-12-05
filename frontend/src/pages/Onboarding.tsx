import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const steps = [
	'/onboarding',
	'/onboarding/basic',
	'/onboarding/experience',
	'/onboarding/goals',
	'/onboarding/schedule',
	'/onboarding/CharacterColor',
];

export default function Onboarding() {
	const loc = useLocation();
	const idx = steps.indexOf(loc.pathname);
	const current = idx !== -1 ? idx + 1 : 1;

<<<<<<< HEAD
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-green-500 flex items-center justify-center p-4">
			<Card className="w-full max-w-3xl shadow-xl p-5">
				<CardHeader>
					<ProgressBar current={current} total={6} />
				</CardHeader>
=======
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
>>>>>>> e8c518f06a872a6c3d610eaffad796f202608d06

				<CardContent>
					<Outlet />
				</CardContent>
			</Card>
		</div>
	);
}
