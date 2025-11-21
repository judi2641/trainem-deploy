import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.tsx';

const steps = [
	'/onboarding',
	'/onboarding/basic',
	'/onboarding/experience',
	'/onboarding/goals',
	'/onboarding/schedule',
];

export default function Onboarding() {
	const loc = useLocation();
	const idx =
		steps.findIndex((s) => s === loc.pathname) !== -1
			? steps.findIndex((s) => s === loc.pathname)
			: 0;
	const current = Math.max(1, idx + 1);

	return (
		<div className="min-h-screen bg-gray-50 flex items-start justify-center py-8">
			<div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
				<div className="mb-6">
					<ProgressBar current={current} total={5} />
				</div>

				<div className="mb-4">
					<Outlet />
				</div>

				<div className="text-right text-sm text-gray-500 mt-4"></div>
			</div>
		</div>
	);
}
