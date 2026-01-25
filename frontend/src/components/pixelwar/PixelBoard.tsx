import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { PixelBoard as IPixelBoard, Season } from '../../../../shared/sharedTypes';

interface PixelBoardProps {
	seasonId?: string;
	groupId?: string;
	onPixelPlaced?: () => void;
}

export default function PixelBoard({ seasonId, groupId, onPixelPlaced }: PixelBoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { user } = useAuth0();
	const [board, setBoard] = useState<IPixelBoard | null>(null);
	const [season, setSeason] = useState<Season | null>(null);
	const [loading, setLoading] = useState(true);
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		fetchBoardData();
	}, [seasonId]);

	useEffect(() => {
		if (board && season) {
			renderCanvas();
		}
	}, [board, season, zoom, pan]);

	const fetchBoardData = async () => {
		try {
			// Fetch active season if no seasonId provided
			let activeSeasonId = seasonId;
			if (!activeSeasonId) {
				const seasonRes = await fetch('http://localhost:3000/api/pixelwar/seasons/active');
				if (seasonRes.ok) {
					const seasonData = await seasonRes.json();
					setSeason(seasonData);
					activeSeasonId = seasonData._id;
				}
			}

			if (activeSeasonId) {
				// Fetch pixel board
				const boardRes = await fetch(`http://localhost:3000/api/pixelwar/seasons/${activeSeasonId}/board`);
				if (boardRes.ok) {
					const boardData = await boardRes.json();
					setBoard(boardData);
				}
			}
		} catch (error) {
			console.error('Failed to fetch board data:', error);
		} finally {
			setLoading(false);
		}
	};

	const renderCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas || !board) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Calculate pixel size based on zoom
		const pixelSize = Math.max(1, Math.floor(4 * zoom));

		// Draw grid
		const gridWidth = board.gridWidth;
		const gridHeight = board.gridHeight;

		// Apply transformations
		ctx.save();
		ctx.translate(pan.x, pan.y);

		// Draw pixels
		board.pixels.forEach((pixel) => {
			ctx.fillStyle = pixel.color;
			ctx.fillRect(
				pixel.x * pixelSize,
				pixel.y * pixelSize,
				pixelSize,
				pixelSize
			);
		});

		// Draw grid lines (only if zoomed in enough)
		if (pixelSize >= 8) {
			ctx.strokeStyle = '#e0e0e0';
			ctx.lineWidth = 0.5;
			for (let x = 0; x <= gridWidth; x++) {
				ctx.beginPath();
				ctx.moveTo(x * pixelSize, 0);
				ctx.lineTo(x * pixelSize, gridHeight * pixelSize);
				ctx.stroke();
			}
			for (let y = 0; y <= gridHeight; y++) {
				ctx.beginPath();
				ctx.moveTo(0, y * pixelSize);
				ctx.lineTo(gridWidth * pixelSize, y * pixelSize);
				ctx.stroke();
			}
		}

		ctx.restore();
	};

	const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!board || !groupId || !season) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = Math.floor((e.clientX - rect.left - pan.x) / (4 * zoom));
		const y = Math.floor((e.clientY - rect.top - pan.y) / (4 * zoom));

		if (x >= 0 && x < board.gridWidth && y >= 0 && y < board.gridHeight) {
			try {
				const res = await fetch(`http://localhost:3000/api/pixelwar/seasons/${season._id}/pixels`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						groupId,
						userId: user?.sub,
						coordinates: [{ x, y }]
					})
				});

				if (res.ok) {
					fetchBoardData();
					onPixelPlaced?.();
				}
			} catch (error) {
				console.error('Failed to place pixel:', error);
			}
		}
	};

	const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setIsDragging(true);
		setLastMousePos({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDragging) return;

		const dx = e.clientX - lastMousePos.x;
		const dy = e.clientY - lastMousePos.y;

		setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
		setLastMousePos({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-gray-600">Loading pixel board...</div>
			</div>
		);
	}

	if (!board || !season) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-gray-600">No active season or pixel board available</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg overflow-hidden">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-white/90 to-transparent z-10">
				<h3 className="text-lg font-semibold text-gray-800">{season.name}</h3>
				<p className="text-sm text-gray-600">
					{board.pixels.length} pixels placed | Zoom: {(zoom * 100).toFixed(0)}%
				</p>
			</div>

			{/* Canvas */}
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				className="w-full h-full cursor-crosshair"
				onClick={handleCanvasClick}
				onWheel={handleWheel}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			/>

			{/* Controls */}
			<div className="absolute bottom-4 right-4 flex gap-2 z-10">
				<button
					onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
					className="px-3 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg transition-colors"
				>
					-
				</button>
				<button
					onClick={() => setZoom(1)}
					className="px-3 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg transition-colors"
				>
					Reset
				</button>
				<button
					onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
					className="px-3 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg transition-colors"
				>
					+
				</button>
			</div>
		</div>
	);
}
