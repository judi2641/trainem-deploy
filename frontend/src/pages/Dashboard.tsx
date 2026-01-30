import Sidebar from '../components/Sidebar';
import DashboardArea from '../components/DashboardArea';
import PixelBackground from '@/components/pixel/PixelBackground';

export default function Dashboard() {
	return (
		<div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Subtle grid */}
			<div
				className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
					backgroundSize: '24px 24px',
				}}
			/>

			{/* Glow effects */}
			<div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-300/30 dark:bg-emerald-500/10 blur-3xl" />
			<div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-amber-300/35 dark:bg-amber-500/10 blur-3xl" />

			{/* Pixel background */}
			<PixelBackground count={120} seed={42} />

			{/* Sidebar */}
			<Sidebar />

			{/* Main content */}
			<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
				<main className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
					{/* Header */}
					<div className="flex items-center gap-3 pt-2">
						<div className="h-8 w-8 bg-emerald-500 border-3 border-black flex items-center justify-center">
							<svg viewBox="0 0 16 16" className="h-5 w-5 text-white" fill="currentColor">
								<rect x="1" y="1" width="6" height="6" />
								<rect x="9" y="1" width="6" height="6" />
								<rect x="1" y="9" width="6" height="6" />
								<rect x="9" y="9" width="6" height="6" />
							</svg>
						</div>
						<h1 className="font-pixel text-2xl text-black dark:text-white">Dashboard</h1>
					</div>
					<div className="flex-1 min-h-0">
						<DashboardArea />
					</div>
				</main>
			</div>
		</div>
	);
}
