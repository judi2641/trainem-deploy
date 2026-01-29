'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PixelCanvas, { type PixelData } from '@/components/PixelCanvas';
import PixelBackground from '@/components/pixel/PixelBackground';
import {
	PixelCard,
	PixelCardHeader,
	PixelCardTitle,
	PixelCardContent,
} from '@/components/ui/pixel-card';
import { Button } from '@/components/ui/button';
import { useMyContext } from '@/context/AppContext';
import { toast } from 'sonner';

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

function SparkleIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="4" />
			<rect x="7" y="12" width="2" height="4" />
			<rect x="0" y="7" width="4" height="2" />
			<rect x="12" y="7" width="4" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="11" y="11" width="2" height="2" />
			<rect x="6" y="6" width="4" height="4" />
		</svg>
	);
}

function PaletteIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="2" y="2" width="12" height="12" />
			<rect x="4" y="4" width="3" height="3" fill="#ef4444" />
			<rect x="9" y="4" width="3" height="3" fill="#3b82f6" />
			<rect x="4" y="9" width="3" height="3" fill="#22c55e" />
			<rect x="9" y="9" width="3" height="3" fill="#eab308" />
		</svg>
	);
}

export default function PixelArt() {
	const { myUser, setPixelArt, entries } = useMyContext();
	const [pixelImage, setPixelImage] = useState<string | null>(null);
	const [pixels, setPixels] = useState<PixelData[]>([]);
	const [gridSize, setGridSize] = useState(64);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Calculate level based on completed entries
	const completedEntries = entries?.filter((e: any) => e.completed)?.length ?? 0;
	const level = Math.floor(completedEntries / 5);
	const unlockedPixels = 12 + level * 4;
	const progressToNext = ((completedEntries % 5) / 5) * 100;

	useEffect(() => {
		let isMounted = true;

		const loadPixelArt = async () => {
			if (!myUser?.auth0Id) {
				setIsLoading(false);
				return;
			}

			try {
				const res = await fetch(`http://localhost:3000/api/pixel-art/${myUser.auth0Id}`);
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
	}, [myUser?.auth0Id, setPixelArt]);

	const handleSave = async () => {
		if (!myUser?.auth0Id) {
			toast.error('No user found. Please log in again.');
			return;
		}

		setIsSaving(true);

		try {
			const res = await fetch(`http://localhost:3000/api/pixel-art/${myUser.auth0Id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					gridSize,
					pixels,
				}),
			});

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
			<PixelBackground count={100} seed={88} />

			{/* Sidebar */}
			<Sidebar />

			{/* Main content - flex layout, no scrolling */}
			<div className="flex-1 z-10 flex h-full overflow-hidden p-4 gap-4">
				{/* Main Canvas Card */}
				<div className="flex-1 min-w-0">
					<PixelCard>
						<PixelCardHeader>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-amber-400 border-2 border-black" />
									<PixelCardTitle className="text-base">Pixel Studio</PixelCardTitle>
								</div>
								<Button
									type="button"
									onClick={handleSave}
									disabled={isSaving}
									className="pixel-btn bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-black rounded-none px-4 py-2 font-pixel text-xs h-auto"
								>
									<SaveIcon className="h-3 w-3 mr-1.5" />
									{isSaving ? 'SAVING...' : 'SAVE'}
								</Button>
							</div>
						</PixelCardHeader>
						<PixelCardContent>
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<div className="flex items-center gap-3">
										<div className="h-4 w-4 bg-emerald-500 border border-black animate-pulse" />
										<span className="text-sm text-black/50">Loading pixel art...</span>
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
														onChange={(dataUrl, _count, pixelData, size) => {
															setPixelImage(dataUrl || null);
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
			</div>
		</div>
	);
}
