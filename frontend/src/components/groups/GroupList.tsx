import type { Group } from '../../../../shared/sharedTypes';
import GroupCard from './GroupCard';

interface GroupListProps {
	groups: Group[];
	onJoin?: (groupId: string) => void;
	onLeave?: (groupId: string) => void;
	onClick?: (group: Group) => void;
	currentUserId?: string;
	showJoinButton?: boolean;
	showLeaveButton?: boolean;
}

function PixelUsersIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="3" y="2" width="4" height="4" />
			<rect x="9" y="2" width="4" height="4" />
			<rect x="2" y="7" width="6" height="2" />
			<rect x="8" y="7" width="6" height="2" />
			<rect x="1" y="9" width="2" height="5" />
			<rect x="7" y="9" width="2" height="5" />
			<rect x="13" y="9" width="2" height="5" />
			<rect x="3" y="12" width="4" height="2" />
			<rect x="9" y="12" width="4" height="2" />
		</svg>
	);
}

export default function GroupList({
	groups,
	onJoin,
	onLeave,
	onClick,
	currentUserId,
	showJoinButton = false,
	showLeaveButton = false,
}: GroupListProps) {
	if (groups.length === 0) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-center">
					<PixelUsersIcon className="h-10 w-10 text-black/20 dark:text-white/20 mx-auto mb-2" />
					<p className="text-sm text-black/50 dark:text-white/50">No groups found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto space-y-3">
			{groups.map((group) => (
				<GroupCard
					key={group._id}
					group={group}
					onJoin={onJoin}
					onLeave={onLeave}
					onClick={onClick}
					currentUserId={currentUserId}
					showJoinButton={showJoinButton}
					showLeaveButton={showLeaveButton}
				/>
			))}
		</div>
	);
}
