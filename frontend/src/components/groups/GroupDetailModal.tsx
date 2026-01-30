import { useState, useEffect, useMemo } from 'react';
import { Trophy, Users, Zap, Grid3X3 } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Group, GroupPixelArt } from '../../../../shared/sharedTypes';

interface GroupDetailModalProps {
	group: Group;
	currentUserId?: string;
	onClose: () => void;
	onGroupUpdate?: (group: Group) => void;
}

// Farben für den Gruppen-Canvas
const CANVAS_COLORS = [
	'#10b981', // emerald
	'#22c55e', // green
	'#3b82f6', // blue
	'#8b5cf6', // violet
	'#ec4899', // pink
	'#f59e0b', // amber
	'#ef4444', // red
	'#0f172a', // dark
	'#f8fafc', // white
];

export default function GroupDetailModal({
	group,
	currentUserId,
	onClose,
	onGroupUpdate,
}: GroupDetailModalProps) {
	const [pixelArtInfo, setPixelArtInfo] = useState<{
		gridSize: number;
		pixels: GroupPixelArt['pixels'];
		usedPixels: number;
		unlockedPixels: number;
		availablePixels: number;
	} | null>(null);
	const [selectedColor, setSelectedColor] = useState(CANVAS_COLORS[0]);
	const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
	const [isPlacing, setIsPlacing] = useState(false);

	const isMember = group.members.some((m) => m.userId === currentUserId);

	useEffect(() => {
		fetchPixelArt();
	}, [group._id]);

	const fetchPixelArt = async () => {
		try {
			const res = await fetch(`http://localhost:3000/api/groups/${group._id}/pixel-art`);
			if (res.ok) {
				const data = await res.json();
				setPixelArtInfo(data);
			}
		} catch (error) {
			console.error('Failed to fetch pixel art:', error);
		}
	};

	const handlePlacePixel = async (x: number, y: number) => {
		if (!currentUserId || !isMember || isPlacing) return;
		if (!pixelArtInfo || pixelArtInfo.availablePixels <= 0) {
			toast.error('No pixels available! Win battles to unlock more.');
			return;
		}

		setIsPlacing(true);
		try {
			const res = await fetch(`http://localhost:3000/api/groups/${group._id}/pixel-art`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: currentUserId,
					x,
					y,
					color: selectedColor,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				setPixelArtInfo({
					gridSize: data.gridSize,
					pixels: data.pixels,
					usedPixels: data.usedPixels,
					unlockedPixels: data.unlockedPixels,
					availablePixels: data.availablePixels,
				});
				toast.success('Pixel placed!');

				// Update parent
				if (onGroupUpdate) {
					const updatedGroup = {
						...group,
						wins: data.wins,
						losses: data.losses,
						pixelArt: { gridSize: data.gridSize, pixels: data.pixels },
						unlockedPixels: data.unlockedPixels,
					};
					onGroupUpdate(updatedGroup);
				}
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to place pixel');
			}
		} catch (error) {
			console.error('Failed to place pixel:', error);
			toast.error('Network error - please try again');
		} finally {
			setIsPlacing(false);
		}
	};

	// Build grid from pixels
	const grid = useMemo(() => {
		if (!pixelArtInfo) return [];
		const size = pixelArtInfo.gridSize;
		const result: (string | null)[][] = Array.from({ length: size }, () =>
			Array.from({ length: size }, () => null)
		);

		for (const pixel of pixelArtInfo.pixels) {
			if (pixel.x >= 0 && pixel.x < size && pixel.y >= 0 && pixel.y < size) {
				result[pixel.y][pixel.x] = pixel.color;
			}
		}

		return result;
	}, [pixelArtInfo]);

	const cellSize = 12;

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-2xl border-4 border-black bg-white dark:bg-gray-900 text-black dark:text-white">
				<DialogHeader>
					<DialogTitle className="font-pixel text-lg flex items-center gap-3">
						<div
							className="w-6 h-6 border-2 border-black"
							style={{ backgroundColor: group.color }}
						/>
						{group.name}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 mt-2">
					{/* Stats */}
					<div className="flex items-center gap-3 flex-wrap">
						<div className="flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/40 border border-black dark:border-white/20 text-xs">
							<Users className="h-3 w-3 text-violet-600" />
							<span className="font-medium">{group.members.length} Members</span>
						</div>
						<div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 border border-black dark:border-white/20 text-xs">
							<Trophy className="h-3 w-3 text-yellow-600" />
							<span className="font-medium">{group.wins || 0} Wins</span>
						</div>
						<div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 border border-black dark:border-white/20 text-xs">
							<Zap className="h-3 w-3 text-amber-600" />
							<span className="font-medium">{group.currentSeasonXP.toLocaleString()} XP</span>
						</div>
						{pixelArtInfo && (
							<div className="flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-900/40 border border-black dark:border-white/20 text-xs">
								<Grid3X3 className="h-3 w-3 text-pink-600" />
								<span className="font-medium">
									{pixelArtInfo.usedPixels}/{pixelArtInfo.unlockedPixels} Pixels
								</span>
							</div>
						)}
					</div>

					{/* Description */}
					{group.description && (
						<p className="text-sm text-black/70 dark:text-white/70">{group.description}</p>
					)}

					{/* Canvas Section */}
					<div className="border-2 border-black dark:border-white/20 p-4 bg-gray-50 dark:bg-gray-800">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium text-sm flex items-center gap-2">
								<Grid3X3 className="h-4 w-4" />
								Group Canvas
							</h3>
							{pixelArtInfo && (
								<span className="text-xs text-black/50 dark:text-white/50">
									{pixelArtInfo.availablePixels} pixels available
								</span>
							)}
						</div>

						{/* Canvas Grid */}
						{pixelArtInfo && grid.length > 0 ? (
							<div className="flex flex-col items-center gap-3">
								<div
									className="border-2 border-black bg-white dark:bg-gray-700 overflow-hidden"
									style={{ padding: 2 }}
								>
									<div
										className="inline-grid"
										style={{
											gridTemplateColumns: `repeat(${pixelArtInfo.gridSize}, ${cellSize}px)`,
											gridAutoRows: `${cellSize}px`,
										}}
									>
										{grid.map((row, y) =>
											row.map((color, x) => {
												const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
												return (
													<button
														key={`${x}-${y}`}
														type="button"
														disabled={!isMember || pixelArtInfo.availablePixels <= 0}
														onClick={() => handlePlacePixel(x, y)}
														onMouseEnter={() => setHoveredCell({ x, y })}
														onMouseLeave={() => setHoveredCell(null)}
														className="transition-all duration-75"
														style={{
															backgroundColor: color || '#ffffff',
															boxShadow: isHovered
																? `inset 0 0 0 2px ${selectedColor}`
																: 'inset 0 0 0 0.5px rgba(0,0,0,0.08)',
															transform: isHovered ? 'scale(1.15)' : 'scale(1)',
															zIndex: isHovered ? 10 : 1,
															cursor:
																isMember && pixelArtInfo.availablePixels > 0
																	? 'pointer'
																	: 'default',
														}}
													/>
												);
											})
										)}
									</div>
								</div>

								{/* Color Palette */}
								{isMember && pixelArtInfo.availablePixels > 0 && (
									<div className="flex items-center gap-2">
										<span className="text-xs text-black/50 dark:text-white/50">Color:</span>
										{CANVAS_COLORS.map((color) => (
											<button
												key={color}
												type="button"
												onClick={() => setSelectedColor(color)}
												className={`h-5 w-5 border transition-all ${
													selectedColor === color
														? 'border-black dark:border-white scale-110 shadow-md'
														: 'border-black/30 dark:border-white/30 hover:scale-105'
												}`}
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								)}

								{!isMember && (
									<p className="text-xs text-black/50 dark:text-white/50">
										Join this group to place pixels
									</p>
								)}

								{isMember && pixelArtInfo.availablePixels <= 0 && pixelArtInfo.unlockedPixels > 0 && (
									<p className="text-xs text-black/50 dark:text-white/50">
										All pixels placed! Win more battles to unlock more.
									</p>
								)}

								{pixelArtInfo.unlockedPixels === 0 && (
									<p className="text-xs text-orange-600 dark:text-orange-400">
										Win your first battle to unlock pixels for your group canvas!
									</p>
								)}
							</div>
						) : (
							<div className="h-32 flex items-center justify-center text-black/40 dark:text-white/40 text-sm">
								Loading canvas...
							</div>
						)}
					</div>

					{/* Close Button */}
					<button
						onClick={onClose}
						className="w-full p-3 border-2 border-black bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
					>
						Close
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
