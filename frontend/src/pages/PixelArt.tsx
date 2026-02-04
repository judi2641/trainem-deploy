'use client';

import { useEffect, useState } from 'react';
import Sidebar, { MobileMenuButton, SidebarProvider } from '../components/Sidebar';
import PixelCanvas, { type PixelData } from '@/components/PixelCanvas';
import PixelBackground from '@/components/pixel/PixelBackground';
import {
	PixelCard,
	PixelCardHeader,
	PixelCardTitle,
	PixelCardContent,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { useAuth0 } from '@auth0/auth0-react';

// Pixel icons
function SaveIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="2" y="1" width="12" height="14" />
			<rect x="4" y="3" width="8" height="4" fill="white" />
			<rect x="4" y="9" width="8" height="4" fill="white" />
			<rect x="9" y="3" width="2" height="3" />
		</svg>
	);
}

export default function PixelArt() {
	const { myUser, setPixelArt, entries } = useMyContext();
	const { getAccessTokenSilently } = useAuth0();
	const [pixels, setPixels] = useState<PixelData[]>([]);
	const [gridSize, setGridSize] = useState(64);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Calculate level based on completed entries
	const completedEntries = entries?.filter((e: any) => e.completed)?.length ?? 0;
	const level = Math.floor(completedEntries / 5);
	const unlockedPixels = 12 + level * 4;

	useEffect(() => {
		let isMounted = true;

		const loadPixelArt = async () => {
			if (!myUser?.auth0Id) {
				setIsLoading(false);
				return;
			}

			try {
				const token = await getAccessTokenSilently();
				const res = await fetch(
					`https://trainem-deploy-production.up.railway.app/api/pixel-art/${myUser.auth0Id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				if (res.status === 404) {
					if (isMounted) setIsLoading(false);
					return;
				}
				if (!res.ok) {
					throw new Error('Failed to load pixel art');
				}

				const data = await res.json();
				if (!isMounted) return;

				setPixelArt(data);
				setGridSize(data.gridSize ?? 64);
				setPixels(Array.isArray(data.pixels) ? data.pixels : []);
			} catch (error) {
				console.error(error);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		loadPixelArt();

		return () => {
			isMounted = false;
		};
	}, [getAccessTokenSilently, myUser?.auth0Id, setPixelArt]);

	const handleSave = async () => {
		if (!myUser?.auth0Id) {
			toast.error('No user found. Please log in again.');
			return;
		}

		setIsSaving(true);

		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/pixel-art/${myUser.auth0Id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						gridSize,
						pixels,
					}),
				},
			);

			if (!res.ok) {
				throw new Error('Failed to save pixel art');
			}

			const savedData = await res.json();
			setPixelArt(savedData);
			toast.success('Pixel art saved!');
		} catch (error) {
			console.error(error);
			toast.error('Saving failed. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<SidebarProvider>
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
				<PixelBackground count={100} seed={88} />

				{/* Sidebar */}
				<Sidebar />

				{/* Main content */}
				<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
					<main className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
						<MobileMenuButton />
						{/* Header */}
						<div className="flex items-center gap-3 pt-2">
							<div className="h-8 w-8 bg-amber-400 border-3 border-black flex items-center justify-center">
								<SaveIcon className="h-5 w-5 text-white" />
							</div>
							<h1 className="font-pixel text-2xl text-black dark:text-white">Pixel Studio</h1>
						</div>

						{/* Main Canvas Card */}
						<div className="flex-1 min-w-0 min-h-0">
							<PixelCard>
								<PixelCardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="h-4 w-4 bg-emerald-500 border-2 border-black" />
											<PixelCardTitle className="text-base">Canvas</PixelCardTitle>
										</div>
										<button
											type="button"
											onClick={handleSave}
											disabled={isSaving}
											className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
										>
											<SaveIcon className="h-4 w-4" />
											{isSaving ? 'Saving...' : 'Save'}
										</button>
									</div>
								</PixelCardHeader>
								<PixelCardContent>
									{isLoading ? (
										<div className="flex items-center justify-center h-full">
											<div className="flex items-center gap-3">
												<div className="h-4 w-4 bg-emerald-500 border border-black dark:border-white/30 animate-pulse" />
												<span className="text-sm text-black/50 dark:text-white/50">
													Loading pixel art...
												</span>
											</div>
										</div>
									) : (
										<div className="h-full flex flex-col">
											{/* Canvas container with enhanced styling */}
											<div className="flex-1 min-h-0 flex items-center justify-center">
												<div className="relative">
													{/* Canvas glow effect */}
													<div className="absolute -inset-3 bg-gradient-to-br from-emerald-200/40 to-amber-200/40 blur-lg" />
													{/* Canvas border frame */}
													<div className="relative bg-gradient-to-br from-slate-100 to-slate-400 p-1.5 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.25)]">
														<div className="bg-white/5 p-0.5">
															<PixelCanvas
																gridSize={gridSize}
																maxPixels={unlockedPixels}
																initialPixels={pixels}
																onChange={(_dataUrl, _count, pixelData, size) => {
																	setPixels(pixelData);
																	setGridSize(size);
																}}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
								</PixelCardContent>
							</PixelCard>
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
