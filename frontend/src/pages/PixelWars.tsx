import Sidebar, { MobileMenuButton, SidebarProvider } from '../components/Sidebar';
import PixelWarsArea from '../components/pixelwar/PixelWarsArea';
import PixelBackground from '@/components/pixel/PixelBackground';

export default function PixelWars() {
	return (
		<SidebarProvider>
			<div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#FFE8B0] via-[#FFCCC9] to-[#CFEFE3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
				<div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-orange-300/30 dark:bg-orange-500/10 blur-3xl" />
				<div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-red-300/35 dark:bg-red-500/10 blur-3xl" />

				{/* Pixel background */}
				<PixelBackground count={100} seed={42} />

				{/* Sidebar */}
				<Sidebar />

				{/* Main content */}
				<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
					<main className="flex-1 p-4 overflow-hidden">
						<MobileMenuButton />
						<PixelWarsArea />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
