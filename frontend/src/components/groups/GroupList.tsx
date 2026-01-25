import type { Group } from '../../../../shared/sharedTypes';
import GroupCard from './GroupCard';

interface GroupListProps {
	groups: Group[];
	onJoin?: (groupId: string) => void;
	onLeave?: (groupId: string) => void;
	currentUserId?: string;
	showJoinButton?: boolean;
	showLeaveButton?: boolean;
}

export default function GroupList({
	groups,
	onJoin,
	onLeave,
	currentUserId,
	showJoinButton = false,
	showLeaveButton = false
}: GroupListProps) {
	if (groups.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
				<p className="text-gray-500">No groups found</p>
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
					currentUserId={currentUserId}
					showJoinButton={showJoinButton}
					showLeaveButton={showLeaveButton}
				/>
			))}
		</div>
	);
}
