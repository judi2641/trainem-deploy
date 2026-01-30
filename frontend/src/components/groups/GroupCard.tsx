import { useMemo } from 'react';
import { Users, Zap, Globe, Lock, Trophy, Grid3X3 } from 'lucide-react';
import type { Group } from '../../../../shared/sharedTypes';

interface GroupCardProps {
	group: Group;
	onJoin?: (groupId: string) => void;
	onLeave?: (groupId: string) => void;
	onClick?: (group: Group) => void;
	currentUserId?: string;
	showJoinButton?: boolean;
	showLeaveButton?: boolean;
}

// Mini canvas preview component
function MiniCanvas({ pixels, gridSize }: { pixels: { x: number; y: number; color: string }[]; gridSize: number }) {
	const previewSize = 48; // 48px total

	return (
		<div
			className="bg-white dark:bg-gray-700 border-2 border-black overflow-hidden"
			style={{ width: previewSize, height: previewSize }}
		>
			<svg width={previewSize} height={previewSize} viewBox={`0 0 ${gridSize} ${gridSize}`}>
				{/* Grid background */}
				<rect width={gridSize} height={gridSize} fill="#f8fafc" className="dark:fill-gray-600" />
				{/* Pixels */}
				{pixels.map((pixel, idx) => (
					<rect
						key={idx}
						x={pixel.x}
						y={pixel.y}
						width={1}
						height={1}
						fill={pixel.color}
					/>
				))}
			</svg>
		</div>
	);
}

export default function GroupCard({
	group,
	onJoin,
	onLeave,
	onClick,
	currentUserId,
	showJoinButton,
	showLeaveButton,
}: GroupCardProps) {
	const isOwner = group.members.find((m) => m.userId === currentUserId)?.role === 'owner';
	const memberCount = group.members.length;
	const isFull = memberCount >= group.maxMembers;
	const wins = group.wins || 0;
	const unlockedPixels = group.unlockedPixels || 10; // Default to 10 start pixels
	const usedPixels = group.pixelArt?.pixels?.length || 0;
	const gridSize = group.pixelArt?.gridSize || 16;
	const pixels = useMemo(() => group.pixelArt?.pixels || [], [group.pixelArt?.pixels]);

	return (
		<div
			className={`bg-white dark:bg-gray-800 border-2 border-black dark:border-white/20 p-4 shadow-[3px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all ${onClick ? 'cursor-pointer' : ''}`}
			onClick={() => onClick?.(group)}
		>
			<div className="flex items-start gap-4">
				{/* Mini Canvas Preview - always visible */}
				<div className="relative shrink-0">
					<MiniCanvas pixels={pixels} gridSize={gridSize} />
					<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border border-black flex items-center justify-center">
						<Grid3X3 className="w-2.5 h-2.5 text-white" />
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1">
							<h3 className="text-base font-medium text-black dark:text-white truncate">
								{group.name}
							</h3>
							{group.description && (
								<p className="text-xs text-black/60 dark:text-white/60 mt-1 line-clamp-2">
									{group.description}
								</p>
							)}
						</div>

						{/* Action button */}
						<div className="shrink-0">
							{showJoinButton && onJoin && !isFull && (
								<button
									onClick={() => onJoin(group._id)}
									className="px-3 py-1.5 bg-emerald-500 border-2 border-black text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
								>
									Join
								</button>
							)}
							{showJoinButton && isFull && (
								<span className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 border-2 border-black dark:border-white/20 text-black/50 dark:text-white/50 text-sm font-medium cursor-not-allowed">
									Full
								</span>
							)}
							{showLeaveButton && onLeave && !isOwner && (
								<button
									onClick={() => onLeave(group._id)}
									className="px-3 py-1.5 bg-red-500 border-2 border-black text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
								>
									Leave
								</button>
							)}
						</div>
					</div>

					{/* Stats */}
					<div className="flex items-center gap-3 mt-3 flex-wrap">
						<div className="flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/40 border border-black dark:border-white/20 text-xs">
							<Users className="h-3 w-3 text-violet-600" />
							<span className="text-black dark:text-white font-medium">
								{memberCount}/{group.maxMembers}
							</span>
						</div>
						{wins > 0 && (
							<div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 border border-black dark:border-white/20 text-xs">
								<Trophy className="h-3 w-3 text-yellow-600" />
								<span className="text-black dark:text-white font-medium">
									{wins} {wins === 1 ? 'Win' : 'Wins'}
								</span>
							</div>
						)}
						<div className="flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-900/40 border border-black dark:border-white/20 text-xs">
							<Grid3X3 className="h-3 w-3 text-pink-600" />
							<span className="text-black dark:text-white font-medium">
								{usedPixels}/{unlockedPixels} px
							</span>
						</div>
						<div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 border border-black dark:border-white/20 text-xs">
							<Zap className="h-3 w-3 text-amber-600" />
							<span className="text-black dark:text-white font-medium">
								{group.currentSeasonXP.toLocaleString()} XP
							</span>
						</div>
						{group.isPublic ? (
							<div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 border border-black dark:border-white/20 text-xs">
								<Globe className="h-3 w-3 text-emerald-600" />
								<span className="text-black dark:text-white font-medium">Public</span>
							</div>
						) : (
							<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-black dark:border-white/20 text-xs">
								<Lock className="h-3 w-3 text-gray-600 dark:text-gray-400" />
								<span className="text-black dark:text-white font-medium">Private</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
