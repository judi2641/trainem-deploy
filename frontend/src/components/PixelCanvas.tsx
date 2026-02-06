'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type Pixel = string | null;

export interface PixelData {
	x: number;
	y: number;
	color: string;
}

interface PixelCanvasProps {
	gridSize?: number;
	maxPixels: number;
	initialPixels?: PixelData[];
	onChange?: (dataUrl: string, usedPixels: number, pixels: PixelData[], gridSize: number) => void;
	controlled?: boolean;
	onPixelPlace?: (x: number, y: number, color: string) => void;
}

// Bright, playful colors that match the app's aesthetic
const DEFAULT_COLORS = [
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

function createGrid(size: number): Pixel[][] {
	return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function countColored(grid: Pixel[][]): number {
	return grid.reduce((total, row) => total + row.filter(Boolean).length, 0);
}

function gridToDataUrl(grid: Pixel[][], size: number): string {
	if (typeof document === 'undefined') return '';

	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;

	const ctx = canvas.getContext('2d');
	if (!ctx) return '';

	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, size, size);

	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			const color = grid[y][x];
			if (!color) continue;
			ctx.fillStyle = color;
			ctx.fillRect(x, y, 1, 1);
		}
	}

	return canvas.toDataURL('image/png');
}

function gridToPixels(grid: Pixel[][]): PixelData[] {
	const pixels: PixelData[] = [];
	for (let y = 0; y < grid.length; y += 1) {
		for (let x = 0; x < grid[y].length; x += 1) {
			const color = grid[y][x];
			if (color) {
				pixels.push({ x, y, color });
			}
		}
	}
	return pixels;
}

export default function PixelCanvas({
	gridSize = 16,
	maxPixels,
	initialPixels,
	onChange,
	controlled,
	onPixelPlace,
}: PixelCanvasProps) {
	const [grid, setGrid] = useState<Pixel[][]>(() => createGrid(gridSize));
	const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
	const [zoom, setZoom] = useState(1);
	const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
	const baseCellSize = 5;
	const cellSize = baseCellSize * zoom;
	const onChangeRef = useRef(onChange);
	const hasInitializedRef = useRef(false);

	const usedPixels = useMemo(() => countColored(grid), [grid]);
	const remainingPixels = Math.max(maxPixels - usedPixels, 0);
	const progressPercent = maxPixels > 0 ? (usedPixels / maxPixels) * 100 : 0;

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		setGrid(createGrid(gridSize));
		hasInitializedRef.current = false;
	}, [gridSize]);

	useEffect(() => {
		if (controlled) {
			const next = createGrid(gridSize);
			if (initialPixels) {
				initialPixels.forEach((pixel) => {
					if (pixel.x >= 0 && pixel.y >= 0 && pixel.y < next.length && pixel.x < next.length) {
						next[pixel.y][pixel.x] = pixel.color;
					}
				});
			}
			setGrid(next);
			return;
		}
		if (!initialPixels || initialPixels.length === 0) return;
		if (hasInitializedRef.current) return;
		setGrid(() => {
			const next = createGrid(gridSize);
			initialPixels.forEach((pixel) => {
				if (pixel.x >= 0 && pixel.y >= 0 && pixel.y < next.length && pixel.x < next.length) {
					next[pixel.y][pixel.x] = pixel.color;
				}
			});
			return next;
		});
		hasInitializedRef.current = true;
	}, [gridSize, initialPixels, controlled]);

	useEffect(() => {
		if (!onChangeRef.current) return;
		const dataUrl = gridToDataUrl(grid, gridSize);
		const pixels = gridToPixels(grid);
		onChangeRef.current(dataUrl, usedPixels, pixels, gridSize);
	}, [grid, gridSize, usedPixels]);

	const handlePixelClick = (rowIndex: number, colIndex: number) => {
		if (controlled) {
			if (onPixelPlace) {
				onPixelPlace(colIndex, rowIndex, selectedColor);
			}
			return;
		}
		setGrid((prev) => {
			const currentColor = prev[rowIndex][colIndex];
			const currentUsed = countColored(prev);

			if (!currentColor && currentUsed >= maxPixels) {
				return prev;
			}

			const next = prev.map((row) => row.slice());

			if (currentColor === selectedColor) {
				next[rowIndex][colIndex] = null;
			} else {
				next[rowIndex][colIndex] = selectedColor;
			}

			return next;
		});
	};

	const handleClear = () => {
		setGrid(createGrid(gridSize));
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Pixel Counter */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div
						className="h-3 w-3 border-2 border-black"
						style={{ backgroundColor: selectedColor }}
					/>
					<span className="text-xs font-medium text-black/70">
						<span className="font-bold text-emerald-600">{usedPixels}</span>
						<span className="text-black/40">/{maxPixels} pixels</span>
					</span>
				</div>
				<span
					className={`text-xs font-bold ${remainingPixels > 0 ? 'text-amber-600' : 'text-red-500'}`}
				>
					{remainingPixels} left
				</span>
			</div>

			{/* Progress Bar */}
			<div className="h-2 bg-emerald-100 border-2 border-black overflow-hidden">
				<div
					className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>

			{/* Canvas Area */}
			<div className="relative">
				{/* Canvas frame - light themed */}
				<div className="bg-gradient-to-br from-emerald-100 to-amber-50 border-3 border-black p-2 shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
					{/* Grid container */}
					<div className="bg-white border-2 border-black/30 w-64 h-64 sm:w-72 sm:h-72 overflow-auto">
						<div
							className="inline-grid"
							style={{
								gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
								gridAutoRows: `${cellSize}px`,
							}}
						>
							{grid.map((row, rowIndex) =>
								row.map((pixel, colIndex) => {
									const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
									return (
										<button
											key={`${rowIndex}-${colIndex}`}
											type="button"
											onClick={() => handlePixelClick(rowIndex, colIndex)}
											onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
											onMouseLeave={() => setHoveredCell(null)}
											className="transition-all duration-75"
											style={{
												backgroundColor: pixel ?? '#ffffff',
												boxShadow: isHovered
													? `inset 0 0 0 2px ${selectedColor}`
													: 'inset 0 0 0 0.5px rgba(0,0,0,0.08)',
												transform: isHovered ? 'scale(1.15)' : 'scale(1)',
												zIndex: isHovered ? 10 : 1,
											}}
											aria-label={`Pixel ${rowIndex + 1}, ${colIndex + 1}`}
										/>
									);
								}),
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Zoom Controls */}
			<div className="flex items-center gap-2">
				<span className="text-[10px] font-bold text-black/50 uppercase">Zoom</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
					className="h-6 w-6 p-0 border-2 border-black bg-white hover:bg-emerald-50 font-bold text-xs"
				>
					-
				</Button>
				<div className="flex-1 h-1.5 bg-black/10 border border-black/20 relative">
					<div
						className="absolute top-0 left-0 h-full bg-emerald-400"
						style={{ width: `${((zoom - 0.5) / 1.5) * 100}%` }}
					/>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
					className="h-6 w-6 p-0 border-2 border-black bg-white hover:bg-emerald-50 font-bold text-xs"
				>
					+
				</Button>
				<span className="text-[10px] font-bold text-black/50 w-8">{Math.round(zoom * 100)}%</span>
			</div>

			{/* Color Palette */}
			<div className="space-y-2">
				<div className="text-[10px] font-bold text-black/50 uppercase">Colors</div>
				<div className="flex flex-wrap items-center gap-1.5">
					{DEFAULT_COLORS.map((color) => (
						<button
							key={color}
							type="button"
							onClick={() => setSelectedColor(color)}
							className={`h-6 w-6 border-2 transition-all ${
								selectedColor === color
									? 'border-white scale-110 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]'
									: 'border-white/30 hover:border-white hover:scale-105'
							}`}
							style={{ backgroundColor: color }}
							aria-label={`Select color ${color}`}
						/>
					))}
					<div className="h-5 w-px bg-white/20 mx-0.5" />
					<label className="flex items-center">
						<input
							type="color"
							value={selectedColor}
							onChange={(event) => setSelectedColor(event.target.value)}
							className="h-6 w-6 cursor-pointer border-2 border-white/30 hover:border-white bg-transparent p-0"
							aria-label="Custom color"
						/>
					</label>
				</div>
			</div>

			{/* Clear Button */}
			{!controlled && (
				<Button
					variant="outline"
					onClick={handleClear}
					className="w-full h-7 border-2 border-black bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-400 text-[10px] font-bold uppercase"
				>
					Clear Canvas
				</Button>
			)}
		</div>
	);
}
