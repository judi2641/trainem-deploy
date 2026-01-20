import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PixelCanvas, { type PixelData } from '@/components/PixelCanvas';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PixelArt() {
	const { user } = useAuth0();
	const [pixelImage, setPixelImage] = useState<string | null>(null);
	const [pixels, setPixels] = useState<PixelData[]>([]);
	const [gridSize, setGridSize] = useState(64);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const level = 0;
	const unlockedPixels = 12 + level;

	useEffect(() => {
		let isMounted = true;

		const loadPixelArt = async () => {
			if (!user?.sub) return;

			try {
				const res = await fetch(`http://localhost:3000/api/pixel-art/${user.sub}`);
				if (res.status === 404) {
					return;
				}
				if (!res.ok) {
					throw new Error('Failed to load pixel art');
				}

				const data = await res.json();
				if (!isMounted) return;

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
	}, [user?.sub]);

	const handleSave = async () => {
		if (!user?.sub) {
			alert('No user found. Please log in again.');
			return;
		}

		setIsSaving(true);

		try {
			const res = await fetch(`http://localhost:3000/api/pixel-art/${user.sub}`, {
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

			alert('Pixel art saved!');
		} catch (error) {
			console.error(error);
			alert('Saving failed. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<Card className="w-full max-w-4xl shadow-md">
						<CardHeader>
							<div>
								<h1 className="text-2xl font-semibold">Pixel Studio</h1>
								<p className="text-sm text-gray-600">
									Level {level} unlocks {unlockedPixels} pixels. Complete tasks to unlock more.
								</p>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{isLoading ? (
								<div className="text-sm text-gray-500">Loading pixel art...</div>
							) : null}
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

							<div className="flex items-center gap-4">
								<div className="h-24 w-24 rounded-lg border bg-white flex items-center justify-center">
									{pixelImage ? (
										<img
											src={pixelImage}
											alt="Pixel avatar preview"
											className="w-full h-full object-contain"
										/>
									) : (
										<span className="text-xs text-slate-400">Preview</span>
									)}
								</div>
							<p className="text-sm text-slate-600">
								This is a preview of your current pixel avatar.
							</p>
							</div>

							<Button
								type="button"
								onClick={handleSave}
								disabled={isSaving}
								className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
							>
								{isSaving ? 'Saving...' : 'Save changes'}
							</Button>
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	);
}
