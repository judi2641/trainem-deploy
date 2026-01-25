import { useState, useEffect, useRef, useCallback } from 'react';
import type { Battle, PixelBoard, BattleLiveScore } from '../../../../../shared/sharedTypes';

interface BattleArenaProps {
	battle: Battle;
	userId: string;
	onBack: () => void;
}

export default function BattleArena({ battle, userId, onBack }: BattleArenaProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [board, setBoard] = useState<PixelBoard | null>(null);
	const [liveScore, setLiveScore] = useState<BattleLiveScore | null>(null);
	const [zoom, setZoom] = useState(4);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [userGroupId, setUserGroupId] = useState<string | null>(null);

	// Determine which group the user belongs to
	useEffect(() => {
		const isChallenger = battle.challenger.members.some((m) => m.userId === userId);
		const isOpponent = battle.opponent.members.some((m) => m.userId === userId);

		if (isChallenger) {
			setUserGroupId(battle.challenger.groupId);
		} else if (isOpponent) {
			setUserGroupId(battle.opponent.groupId);
		}
	}, [battle, userId]);

	// Fetch board data
	const fetchBoard = useCallback(async () => {
		try {
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}/board`);
			if (res.ok) {
				const data = await res.json();
				setBoard(data);
			}
		} catch (error) {
			console.error('Failed to fetch board:', error);
		}
	}, [battle._id]);

	// Fetch live score
	const fetchScore = useCallback(async () => {
		try {
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}/score`);
			if (res.ok) {
				const data = await res.json();
				setLiveScore(data);
			}
		} catch (error) {
			console.error('Failed to fetch score:', error);
		}
	}, [battle._id]);

	// Initial fetch and polling
	useEffect(() => {
		fetchBoard();
		fetchScore();

		const interval = setInterval(() => {
			fetchBoard();
			fetchScore();
		}, 5000);

		return () => clearInterval(interval);
	}, [fetchBoard, fetchScore]);

	// Draw canvas
	useEffect(() => {
		if (!canvasRef.current || !board) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const pixelSize = zoom;
		canvas.width = board.gridWidth * pixelSize;
		canvas.height = board.gridHeight * pixelSize;

		// Clear with grid pattern
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw grid
		ctx.strokeStyle = '#e0e0e0';
		ctx.lineWidth = 0.5;
		for (let x = 0; x <= board.gridWidth; x++) {
			ctx.beginPath();
			ctx.moveTo(x * pixelSize, 0);
			ctx.lineTo(x * pixelSize, canvas.height);
			ctx.stroke();
		}
		for (let y = 0; y <= board.gridHeight; y++) {
			ctx.beginPath();
			ctx.moveTo(0, y * pixelSize);
			ctx.lineTo(canvas.width, y * pixelSize);
			ctx.stroke();
		}

		// Draw pixels
		for (const pixel of board.pixels) {
			ctx.fillStyle = pixel.color;
			ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
		}
	}, [board, zoom]);

	// Handle canvas click to place pixel
	const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current || !board || !userGroupId) return;
		if (battle.status !== 'active') return;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = Math.floor((e.clientX - rect.left) / zoom);
		const y = Math.floor((e.clientY - rect.top) / zoom);

		if (x < 0 || x >= board.gridWidth || y < 0 || y >= board.gridHeight) return;

		try {
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}/pixels`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					groupId: userGroupId,
					userId,
					coordinates: [{ x, y }],
				}),
			});

			if (res.ok) {
				fetchBoard();
				fetchScore();
			}
		} catch (error) {
			console.error('Failed to place pixel:', error);
		}
	};

	// Mouse handlers for panning
	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 1 || e.button === 2) {
			setIsDragging(true);
			setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isDragging) {
			setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const formatTime = (seconds: number): string => {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.floor(seconds % 60);
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	const userColor = userGroupId === battle.challenger.groupId
		? battle.challenger.color
		: battle.opponent.color;

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<button
					onClick={onBack}
					className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors"
				>
					Back
				</button>

				<h1 className="text-2xl font-bold text-gray-800">{battle.name}</h1>

				{/* Timer */}
				{liveScore && battle.status === 'active' && (
					<div className="text-xl font-mono bg-black text-white px-4 py-2 rounded-lg">
						{formatTime(liveScore.timeRemaining)}
					</div>
				)}

				{battle.status === 'completed' && (
					<div className="text-lg font-bold text-emerald-600">
						Battle Ended
					</div>
				)}
			</div>

			{/* Score Bar */}
			{liveScore && (
				<div className="mb-4 p-4 bg-white/80 rounded-lg border-2 border-black">
					<div className="flex justify-between mb-2">
						<div className="flex items-center gap-2">
							<div
								className="w-4 h-4 border border-black"
								style={{ backgroundColor: battle.challenger.color }}
							/>
							<span className="font-medium">{battle.challenger.groupName}</span>
							<span className="text-gray-600">({liveScore.challenger.pixels} px)</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-gray-600">({liveScore.opponent.pixels} px)</span>
							<span className="font-medium">{battle.opponent.groupName}</span>
							<div
								className="w-4 h-4 border border-black"
								style={{ backgroundColor: battle.opponent.color }}
							/>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
						<div className="h-full flex">
							<div
								className="h-full transition-all duration-500 flex items-center justify-end pr-2"
								style={{
									width: `${liveScore.challenger.percentage}%`,
									backgroundColor: battle.challenger.color,
								}}
							>
								<span className="text-xs font-bold text-white drop-shadow">
									{liveScore.challenger.percentage.toFixed(1)}%
								</span>
							</div>
							<div
								className="h-full transition-all duration-500 flex items-center justify-start pl-2"
								style={{
									width: `${liveScore.opponent.percentage}%`,
									backgroundColor: battle.opponent.color,
								}}
							>
								<span className="text-xs font-bold text-white drop-shadow">
									{liveScore.opponent.percentage.toFixed(1)}%
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Canvas Area */}
			<div className="flex-1 relative bg-white/50 rounded-lg border-2 border-black overflow-hidden">
				{/* Zoom Controls */}
				<div className="absolute top-4 right-4 z-10 flex gap-2">
					<button
						onClick={() => setZoom((z) => Math.max(1, z - 1))}
						className="w-8 h-8 bg-white border-2 border-black rounded font-bold hover:bg-gray-50"
					>
						-
					</button>
					<span className="px-2 py-1 bg-white border-2 border-black rounded text-sm">
						{zoom}x
					</span>
					<button
						onClick={() => setZoom((z) => Math.min(10, z + 1))}
						className="w-8 h-8 bg-white border-2 border-black rounded font-bold hover:bg-gray-50"
					>
						+
					</button>
				</div>

				{/* User Color Indicator */}
				{userGroupId && (
					<div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white px-3 py-2 border-2 border-black rounded">
						<span className="text-sm">Your color:</span>
						<div
							className="w-6 h-6 border-2 border-black"
							style={{ backgroundColor: userColor }}
						/>
					</div>
				)}

				{/* Canvas Container */}
				<div
					className="absolute inset-0 overflow-auto flex items-center justify-center"
					style={{
						cursor: battle.status === 'active' ? 'crosshair' : 'default',
					}}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
				>
					<div
						style={{
							transform: `translate(${offset.x}px, ${offset.y}px)`,
						}}
					>
						<canvas
							ref={canvasRef}
							onClick={handleCanvasClick}
							className="border-2 border-black shadow-lg"
							style={{
								imageRendering: 'pixelated',
							}}
						/>
					</div>
				</div>

				{/* Status Overlay */}
				{battle.status !== 'active' && (
					<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg border-4 border-black text-center">
							<h2 className="text-2xl font-bold mb-2">
								{battle.status === 'completed' ? 'Battle Ended!' : 'Battle Not Started'}
							</h2>
							{battle.winnerId && (
								<p className="text-lg">
									Winner:{' '}
									<span className="font-bold">
										{battle.winnerId === battle.challenger.groupId
											? battle.challenger.groupName
											: battle.opponent.groupName}
									</span>
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
