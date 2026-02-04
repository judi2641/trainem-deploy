import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Clock, Trophy, Crosshair, Palette } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

// Farben für den Canvas (gleich wie GroupDetailModal)
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

interface BattleArenaProps {
	battle: any;
	userId: string;
	onBack: () => void;
}

export default function BattleArena({ battle: initialBattle, userId, onBack }: BattleArenaProps) {
	const { getAccessTokenSilently } = useAuth0();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [battle, setBattle] = useState(initialBattle);
	const [board, setBoard] = useState<any | null>(null);
	const [liveScore, setLiveScore] = useState<any | null>(null);
	const [zoom, setZoom] = useState(4);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [userGroupId, setUserGroupId] = useState<string | null>(null);
	const [userMember, setUserMember] = useState<any | null>(null);
	const [selectedColor, setSelectedColor] = useState(CANVAS_COLORS[0]);

	// Determine which group the user belongs to and get member data
	useEffect(() => {
		const challengerMember = battle.challenger.members.find((m: any) => m.userId === userId);
		const opponentMember = battle.opponent.members.find((m: any) => m.userId === userId);

		if (challengerMember) {
			setUserGroupId(battle.challenger.groupId);
			setUserMember(challengerMember);
		} else if (opponentMember) {
			setUserGroupId(battle.opponent.groupId);
			setUserMember(opponentMember);
		}
	}, [battle, userId]);

	// Fetch updated battle data
	const fetchBattle = useCallback(async () => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				const data = await res.json();
				setBattle(data);
			}
		} catch (error) {
			console.error('Failed to fetch battle:', error);
		}
	}, [battle._id, getAccessTokenSilently]);

	// Fetch board data
	const fetchBoard = useCallback(async () => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}/board`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				const data = await res.json();
				setBoard(data);
			}
		} catch (error) {
			console.error('Failed to fetch board:', error);
		}
	}, [battle._id, getAccessTokenSilently]);

	// Fetch live score
	const fetchScore = useCallback(async () => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}/score`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				const data = await res.json();
				setLiveScore(data);
			}
		} catch (error) {
			console.error('Failed to fetch score:', error);
		}
	}, [battle._id, getAccessTokenSilently]);

	// Initial fetch and polling
	useEffect(() => {
		fetchBoard();
		fetchScore();
		fetchBattle();

		const interval = setInterval(() => {
			fetchBoard();
			fetchScore();
			fetchBattle();
		}, 5000);

		return () => clearInterval(interval);
	}, [fetchBoard, fetchScore, fetchBattle]);

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

		// Check if user has available pixels
		if (!userMember || userMember.pixelsAvailable < 1) {
			toast.error('No pixels available! Complete exercises to earn more.');
			return;
		}

		const rect = canvasRef.current.getBoundingClientRect();
		const x = Math.floor((e.clientX - rect.left) / zoom);
		const y = Math.floor((e.clientY - rect.top) / zoom);

		if (x < 0 || x >= board.gridWidth || y < 0 || y >= board.gridHeight) return;

		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battle._id}/pixels`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({
					groupId: userGroupId,
					userId,
					coordinates: [{ x, y }],
					color: selectedColor,
				}),
			});

			if (res.ok) {
				toast.success('Pixel placed!');
				fetchBoard();
				fetchScore();
				fetchBattle();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to place pixel');
			}
		} catch (error) {
			console.error('Failed to place pixel:', error);
			toast.error('Network error - please try again');
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

	return (
		<div className="h-full flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</button>

				<h1 className="font-pixel text-xl text-black dark:text-white">
					{battle.name || 'Pixel Battle'}
				</h1>

				{/* Timer */}
				{liveScore && battle.status === 'active' && (
					<div className="flex items-center gap-2 px-4 py-2 bg-black border-2 border-black text-white font-mono text-lg">
						<Clock className="h-4 w-4" />
						{formatTime(liveScore.timeRemaining)}
					</div>
				)}

				{battle.status === 'completed' && (
					<div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 border-2 border-black text-white font-medium">
						<Trophy className="h-4 w-4" />
						Battle Ended
					</div>
				)}
			</div>

			{/* Score Bar */}
			{liveScore && (
				<div className="p-4 bg-white dark:bg-gray-800 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
					<div className="flex justify-between mb-3">
						<div className="flex items-center gap-2">
							<div
								className="w-5 h-5 border-2 border-black"
								style={{ backgroundColor: battle.challenger.color }}
							/>
							<span className="font-medium text-black dark:text-white">
								{battle.challenger.groupName}
							</span>
							<span className="text-black/60 dark:text-white/60 text-sm">
								({liveScore.challenger.pixels} px)
							</span>
						</div>
						<div className="px-2 py-0.5 bg-red-500 border border-black text-white text-[10px] font-bold">
							VS
						</div>
						<div className="flex items-center gap-2">
							<span className="text-black/60 dark:text-white/60 text-sm">
								({liveScore.opponent.pixels} px)
							</span>
							<span className="font-medium text-black dark:text-white">
								{battle.opponent.groupName}
							</span>
							<div
								className="w-5 h-5 border-2 border-black"
								style={{ backgroundColor: battle.opponent.color }}
							/>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="h-6 bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-black">
						<div className="h-full flex">
							<div
								className="h-full transition-all duration-500 flex items-center justify-end pr-2"
								style={{
									width: `${liveScore.challenger.percentage}%`,
									backgroundColor: battle.challenger.color,
								}}
							>
								<span className="text-xs font-bold text-white drop-shadow-sm">
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
								<span className="text-xs font-bold text-white drop-shadow-sm">
									{liveScore.opponent.percentage.toFixed(1)}%
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Canvas Area */}
			<div className="flex-1 relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 border-2 border-black overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
				{/* Zoom Controls - matching PixelCanvas style */}
				<div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
					<span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase">
						Zoom
					</span>
					<button
						onClick={() => setZoom((z) => Math.max(1, z - 1))}
						className="h-6 w-6 p-0 border-2 border-black bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold text-xs text-black dark:text-white"
					>
						-
					</button>
					<div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 border border-black/20 relative">
						<div
							className="absolute top-0 left-0 h-full bg-emerald-400"
							style={{ width: `${((zoom - 1) / 9) * 100}%` }}
						/>
					</div>
					<button
						onClick={() => setZoom((z) => Math.min(10, z + 1))}
						className="h-6 w-6 p-0 border-2 border-black bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold text-xs text-black dark:text-white"
					>
						+
					</button>
					<span className="text-[10px] font-bold text-black/50 dark:text-white/50 w-6">
						{zoom}x
					</span>
				</div>

				{/* User Info Panel with Color Palette */}
				{userGroupId && (
					<div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-3 border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
						<div className="flex items-center gap-2 mb-2">
							<Crosshair className="h-4 w-4 text-black/60 dark:text-white/60" />
							<span className="text-sm text-black dark:text-white font-medium">Your Team</span>
						</div>
						<div className="flex items-center gap-3 mb-3">
							<div
								className="w-8 h-8 border-2 border-black"
								style={{ backgroundColor: selectedColor }}
							/>
							<div>
								<div className="text-2xl font-bold text-black dark:text-white">
									{userMember?.pixelsAvailable ?? 0}
								</div>
								<div className="text-xs text-black/50 dark:text-white/50">pixels available</div>
							</div>
						</div>

						{/* Color Palette */}
						{battle.status === 'active' && userMember && userMember.pixelsAvailable > 0 && (
							<div className="border-t border-black/10 dark:border-white/10 pt-3">
								<div className="flex items-center gap-2 mb-2">
									<Palette className="h-3 w-3 text-black/50 dark:text-white/50" />
									<span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase">
										Colors
									</span>
								</div>
								<div className="grid grid-cols-5 gap-1.5">
									{CANVAS_COLORS.map((color) => (
										<button
											key={color}
											type="button"
											onClick={() => setSelectedColor(color)}
											className={`h-6 w-6 border-2 transition-all ${
												selectedColor === color
													? 'border-black dark:border-white scale-110 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]'
													: 'border-black/30 dark:border-white/30 hover:border-black hover:scale-105'
											}`}
											style={{ backgroundColor: color }}
										/>
									))}
								</div>
							</div>
						)}

						{(!userMember || userMember.pixelsAvailable === 0) && (
							<div className="text-xs text-orange-600 dark:text-orange-400 border-t border-black/10 dark:border-white/10 pt-2">
								Complete exercises to earn pixels!
							</div>
						)}
					</div>
				)}

				{/* Canvas Container */}
				<div
					className="absolute inset-0 overflow-auto flex items-center justify-center p-8"
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
						{/* Canvas frame - matching PixelCanvas style */}
						<div className="relative">
							{/* Canvas glow effect */}
							<div className="absolute -inset-3 bg-gradient-to-br from-emerald-200/40 to-amber-200/40 dark:from-emerald-500/20 dark:to-amber-500/20 blur-lg" />
							{/* Canvas border frame */}
							<div className="relative bg-gradient-to-br from-emerald-100 to-amber-50 dark:from-emerald-900/40 dark:to-amber-900/40 p-1.5 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.25)]">
								<div className="bg-white/5 p-0.5">
									<canvas
										ref={canvasRef}
										onClick={handleCanvasClick}
										className="border-2 border-black/30"
										style={{
											imageRendering: 'pixelated',
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Status Overlay */}
				{battle.status !== 'active' && (
					<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
						<div className="bg-white dark:bg-gray-800 p-8 border-4 border-black text-center shadow-[6px_6px_0px_rgba(0,0,0,0.3)]">
							<h2 className="font-pixel text-2xl text-black dark:text-white mb-4">
								{battle.status === 'completed' ? 'Battle Ended!' : 'Battle Not Started'}
							</h2>
							{battle.winnerId && (
								<div className="flex items-center justify-center gap-3">
									<Trophy className="h-6 w-6 text-amber-500" />
									<span className="text-lg text-black dark:text-white">
										Winner:{' '}
										<span className="font-bold">
											{battle.winnerId === battle.challenger.groupId
												? battle.challenger.groupName
												: battle.opponent.groupName}
										</span>
									</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
