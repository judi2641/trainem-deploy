import type { Battle } from '../../../../../shared/sharedTypes';

interface BattleCardProps {
	battle: Battle;
	onClick: () => void;
}

function formatTimeRemaining(endDate: string | undefined): string {
	if (!endDate) return 'Not started';

	const end = new Date(endDate).getTime();
	const now = Date.now();
	const diff = end - now;

	if (diff <= 0) return 'Ended';

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 24) {
		const days = Math.floor(hours / 24);
		return `${days}d ${hours % 24}h left`;
	}

	return `${hours}h ${minutes}m left`;
}

function getStatusColor(status: string): string {
	switch (status) {
		case 'active':
			return 'bg-green-500';
		case 'completed':
			return 'bg-gray-500';
		case 'pending':
			return 'bg-yellow-500';
		default:
			return 'bg-gray-400';
	}
}

export default function BattleCard({ battle, onClick }: BattleCardProps) {
	const totalPixels = battle.challenger.pixelsOwned + battle.opponent.pixelsOwned;
	const challengerPercent = totalPixels > 0 ? (battle.challenger.pixelsOwned / totalPixels) * 100 : 50;

	return (
		<div
			onClick={onClick}
			className="p-4 bg-white/80 backdrop-blur rounded-lg border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] cursor-pointer hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all"
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-semibold text-gray-800 truncate">{battle.name}</h3>
				<span className={`px-2 py-0.5 text-xs text-white rounded ${getStatusColor(battle.status)}`}>
					{battle.status}
				</span>
			</div>

			{/* Teams */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<div
						className="w-4 h-4 border border-black"
						style={{ backgroundColor: battle.challenger.color }}
					/>
					<span className="text-sm font-medium">{battle.challenger.groupName}</span>
				</div>
				<span className="text-gray-400 text-sm">vs</span>
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">{battle.opponent.groupName}</span>
					<div
						className="w-4 h-4 border border-black"
						style={{ backgroundColor: battle.opponent.color }}
					/>
				</div>
			</div>

			{/* Progress Bar */}
			{battle.status === 'active' || battle.status === 'completed' ? (
				<>
					<div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-black mb-2">
						<div className="h-full flex">
							<div
								className="h-full transition-all duration-500"
								style={{
									width: `${challengerPercent}%`,
									backgroundColor: battle.challenger.color,
								}}
							/>
							<div
								className="h-full transition-all duration-500"
								style={{
									width: `${100 - challengerPercent}%`,
									backgroundColor: battle.opponent.color,
								}}
							/>
						</div>
					</div>

					{/* Stats */}
					<div className="flex justify-between text-xs text-gray-600">
						<span>{battle.challenger.pixelsOwned} px</span>
						{battle.status === 'active' && (
							<span className="text-orange-600 font-medium">
								{formatTimeRemaining(battle.endDate)}
							</span>
						)}
						{battle.status === 'completed' && battle.winnerId && (
							<span className="text-emerald-600 font-medium">
								Winner: {battle.winnerId === battle.challenger.groupId
									? battle.challenger.groupName
									: battle.opponent.groupName}
							</span>
						)}
						<span>{battle.opponent.pixelsOwned} px</span>
					</div>
				</>
			) : (
				<div className="text-sm text-gray-500 text-center py-2">
					Waiting for response...
				</div>
			)}
		</div>
	);
}
