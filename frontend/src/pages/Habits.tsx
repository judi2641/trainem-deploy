'use client';

import Sidebar from '../components/Sidebar';
import HabitsArea from '../components/HabitsArea';
import PixelBackground from '@/components/pixel/PixelBackground';

export default function Habits() {
	return (
		<div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0]">
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

			{/* Sidebar */}
			<Sidebar />

			{/* Main content */}
			<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
				<main className="flex-1 p-4 pr-6 overflow-hidden">
					<HabitsArea />
				</main>
			</div>
		</div>
	);
}
