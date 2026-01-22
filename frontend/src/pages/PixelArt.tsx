'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PixelCanvas, { type PixelData } from '@/components/PixelCanvas';
import PixelBackground from '@/components/pixel/PixelBackground';
import { Button } from '@/components/ui/button';
import { useMyContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { getLevelFromScore } from '@/util/level';

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

export default function PixelArt() {
	const { myUser, setPixelArt } = useMyContext();
	const [pixelImage, setPixelImage] = useState<string | null>(null);
	const [pixels, setPixels] = useState<PixelData[]>([]);
	const [gridSize, setGridSize] = useState(64);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const totalScore = myUser?.points ?? myUser?.score ?? 0;

	const { level, currentXp, nextLevelXp } = getLevelFromScore(totalScore);
	const unlockedPixels = 12 + (level - 1) * 3;

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

			{/* Main content */}
			<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden p-4 pr-6">
				<main className="flex-1 overflow-y-auto">
					{/* Card with shadow */}
					<div className="relative max-w-4xl">
						{/* Shadow layer */}
						<div className="absolute left-2 top-2 h-full w-full border-4 border-black bg-black/10" />

						{/* Main card */}
						<div className="relative bg-white/90 backdrop-blur border-4 border-black p-6">
							{/* Header */}
							<div className="flex items-center gap-3 mb-6">
								<div className="h-5 w-5 bg-amber-400 border-2 border-black" />
								<h1 className="font-pixel text-xl text-black">Pixel Studio</h1>
							</div>

							{/* Level info */}
							<div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 border-2 border-black">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-black">Level {level}</span>
									<span className="text-xs text-black/60">{unlockedPixels} pixels unlocked</span>
								</div>
								<div className="h-2 w-full bg-black/10 border border-black overflow-hidden">
									<div
										className="h-full bg-emerald-500 transition-all duration-300"
										style={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
									/>
								</div>
								<p className="text-xs text-black/50 mt-2">
									{nextLevelXp - currentXp} XP to reach level {level + 1}.
								</p>
							</div>

							{isLoading ? (
								<div className="flex items-center justify-center py-12">
									<div className="flex items-center gap-3">
										<div className="h-4 w-4 bg-emerald-500 border border-black animate-pulse" />
										<span className="text-sm text-black/50">Loading pixel art...</span>
									</div>
								</div>
							) : (
								<div className="space-y-6">
									{/* Canvas area */}
									<div className="bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-black p-4">
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

									{/* Preview and save section */}
									<div className="flex items-center gap-6">
										<div className="flex items-center gap-4">
											<div className="h-20 w-20 bg-white border-3 border-black flex items-center justify-center">
												{pixelImage ? (
													<img
														src={pixelImage || '/placeholder.svg'}
														alt="Pixel avatar preview"
														className="w-full h-full object-contain pixelated"
													/>
												) : (
													<SparkleIcon className="h-8 w-8 text-black/20" />
												)}
											</div>
											<div>
												<p className="text-sm font-medium text-black">Preview</p>
												<p className="text-xs text-black/50">Your current pixel avatar</p>
											</div>
										</div>

										<div className="flex-1" />

										<Button
											type="button"
											onClick={handleSave}
											disabled={isSaving}
											className="pixel-btn bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-black rounded-none px-6 py-5 font-pixel text-xs"
										>
											<SaveIcon className="h-4 w-4 mr-2" />
											{isSaving ? 'SAVING...' : 'SAVE'}
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
