import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import PixelBackground from '@/components/pixel/PixelBackground';

const steps = [
	'/onboarding',
	'/onboarding/basic',
	'/onboarding/experience',
	'/onboarding/goals',
	'/onboarding/schedule',
	'/onboarding/intro',
];

export default function Onboarding() {
	const loc = useLocation();
	const idx = steps.indexOf(loc.pathname);
	const current = idx !== -1 ? idx + 1 : 1;

	return (
		<div
			className="relative flex min-h-screen overflow-hidden items-center justify-center p-4 bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0]"
		>
			{/* Subtle grid */}
			<div
				className="absolute inset-0 pointer-events-none opacity-20"
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
					backgroundSize: '24px 24px',
				}}
			/>

			{/* Glow effects */}
			<div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-300/30 blur-3xl" />
			<div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-amber-300/35 blur-3xl" />

			{/* Pixel background */}
			<PixelBackground count={120} seed={42} />

			{/* Card stays on top */}
			<Card className="relative z-10 w-full max-w-3xl shadow-xl p-5 bg-white/95">
				<CardHeader>
					<ProgressBar current={current} total={6} />
				</CardHeader>

				<CardContent>
					<Outlet />
				</CardContent>
			</Card>
		</div>
	);
}
