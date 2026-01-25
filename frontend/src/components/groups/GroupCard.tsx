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
	showLeaveButton
}: GroupCardProps) {
	const isOwner = group.members.find(m => m.userId === currentUserId)?.role === 'owner';
	const memberCount = group.members.length;
	const isFull = memberCount >= group.maxMembers;

	return (
		<div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg p-4 hover:shadow-xl transition-shadow">
			<div className="flex items-start gap-4">
				{/* Color indicator */}
				<div
					className="w-12 h-12 rounded-lg shrink-0"
					style={{ backgroundColor: group.color }}
				/>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-gray-800 truncate">
								{group.name}
							</h3>
							{group.description && (
								<p className="text-sm text-gray-600 mt-1 line-clamp-2">
									{group.description}
								</p>
							)}
						</div>

						{/* Action button */}
						<div className="shrink-0">
							{showJoinButton && onJoin && !isFull && (
								<button
									onClick={() => onJoin(group._id)}
									className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
								>
									Join
								</button>
							)}
							{showJoinButton && isFull && (
								<span className="px-3 py-1.5 bg-gray-300 text-gray-600 text-sm rounded-lg cursor-not-allowed">
									Full
								</span>
							)}
							{showLeaveButton && onLeave && !isOwner && (
								<button
									onClick={() => onLeave(group._id)}
									className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
								>
									Leave
								</button>
							)}
						</div>
					</div>

					{/* Stats */}
					<div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
						<div className="flex items-center gap-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<span>{memberCount}/{group.maxMembers}</span>
						</div>
						<div className="flex items-center gap-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
							<span>{group.currentSeasonXP.toLocaleString()} XP</span>
						</div>
						{group.isPublic ? (
							<span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
								Public
							</span>
						) : (
							<span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
								Private
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
