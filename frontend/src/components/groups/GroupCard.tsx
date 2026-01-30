import { Users, Zap, Globe, Lock } from 'lucide-react';
import type { Group } from '../../../../shared/sharedTypes';

interface GroupCardProps {
	group: Group;
	onJoin?: (groupId: string) => void;
	onLeave?: (groupId: string) => void;
	currentUserId?: string;
	showJoinButton?: boolean;
	showLeaveButton?: boolean;
}

export default function GroupCard({
	group,
	onJoin,
	onLeave,
	currentUserId,
	showJoinButton,
	showLeaveButton,
}: GroupCardProps) {
	const isOwner = group.members.find((m) => m.userId === currentUserId)?.role === 'owner';
	const memberCount = group.members.length;
	const isFull = memberCount >= group.maxMembers;

	return (
		<div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white/20 p-4 shadow-[3px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all">
			<div className="flex items-start gap-4">
				{/* Color indicator */}
				<div
					className="w-10 h-10 border-2 border-black shrink-0"
					style={{ backgroundColor: group.color }}
				/>

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
