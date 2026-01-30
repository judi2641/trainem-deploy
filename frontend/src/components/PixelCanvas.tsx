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
}

const DEFAULT_COLORS = [
	'#0f172a',
	'#1d4ed8',
	'#16a34a',
	'#eab308',
	'#f97316',
	'#ef4444',
	'#db2777',
	'#9333ea',
	'#f8fafc',
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
}: PixelCanvasProps) {
	const [grid, setGrid] = useState<Pixel[][]>(() => createGrid(gridSize));
	const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
	const [zoom, setZoom] = useState(1);
	const baseCellSize = 5;
	const cellSize = baseCellSize * zoom;
	const onChangeRef = useRef(onChange);
	const hasInitializedRef = useRef(false);

	const usedPixels = useMemo(() => countColored(grid), [grid]);
	const remainingPixels = Math.max(maxPixels - usedPixels, 0);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		setGrid(createGrid(gridSize));
		hasInitializedRef.current = false;
	}, [gridSize]);

	useEffect(() => {
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
	}, [gridSize, initialPixels]);

	useEffect(() => {
		if (!onChangeRef.current) return;
		const dataUrl = gridToDataUrl(grid, gridSize);
		const pixels = gridToPixels(grid);
		onChangeRef.current(dataUrl, usedPixels, pixels, gridSize);
	}, [grid, gridSize, usedPixels]);

	const handlePixelClick = (rowIndex: number, colIndex: number) => {
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
		<div className="space-y-4">
			<div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
				<span>
					Unlocked pixels: {usedPixels}/{maxPixels}
				</span>
				<span>{remainingPixels} remaining</span>
			</div>

			<div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
				<span className="font-medium">Zoom</span>
				<Button variant="outline" onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}>
					-
				</Button>
				<input
					type="range"
					min={0.5}
					max={2}
					step={0.1}
					value={zoom}
					onChange={(event) => setZoom(Number(event.target.value))}
					className="w-40 dark:accent-emerald-500"
					aria-label="Zoom level"
				/>
				<Button variant="outline" onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}>
					+
				</Button>
				<span>{Math.round(zoom * 100)}%</span>
			</div>

			<div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-md w-72 h-72 sm:w-96 sm:h-96 overflow-auto">
				<div
					className="inline-grid gap-[0.5px]"
					style={{
						gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
						gridAutoRows: `${cellSize}px`,
					}}
				>
					{grid.map((row, rowIndex) =>
						row.map((pixel, colIndex) => (
							<button
								key={`${rowIndex}-${colIndex}`}
								type="button"
								onClick={() => handlePixelClick(rowIndex, colIndex)}
								className="w-full h-full border border-slate-100 dark:border-slate-600"
								style={{ backgroundColor: pixel ?? undefined }}
								aria-label={`Pixel ${rowIndex + 1}, ${colIndex + 1}`}
							/>
						)),
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				{DEFAULT_COLORS.map((color) => (
					<button
						key={color}
						type="button"
						onClick={() => setSelectedColor(color)}
						className={`h-8 w-8 rounded border ${
							selectedColor === color
								? 'ring-2 ring-slate-900 dark:ring-white border-slate-900 dark:border-white'
								: 'border-slate-300 dark:border-slate-500'
						}`}
						style={{ backgroundColor: color }}
						aria-label={`Select color ${color}`}
					/>
				))}
				<label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
					<span className="sr-only">Pick a custom color</span>
					<input
						type="color"
						value={selectedColor}
						onChange={(event) => setSelectedColor(event.target.value)}
						className="h-8 w-8 cursor-pointer rounded border border-slate-300 dark:border-slate-500 bg-transparent"
						aria-label="Custom color"
					/>
					<span>Spectrum</span>
				</label>
				<Button variant="outline" onClick={handleClear} className="h-8 px-3">
					Clear
				</Button>
			</div>
		</div>
	);
}
