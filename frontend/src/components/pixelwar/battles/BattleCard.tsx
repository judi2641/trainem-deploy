import { Clock, Trophy } from 'lucide-react';

interface BattleCardProps {
	battle: any;
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
		return `${days}d ${hours % 24}h`;
	}

	return `${hours}h ${minutes}m`;
}

function getStatusStyles(status: string): { bg: string; text: string; border: string } {
	switch (status) {
		case 'active':
			return { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' };
		case 'completed':
			return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' };
		case 'pending':
			return { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600' };
		default:
			return { bg: 'bg-gray-400', text: 'text-white', border: 'border-gray-500' };
	}
}

export default function BattleCard({ battle, onClick }: BattleCardProps) {
	const totalPixels = battle.challenger.pixelsOwned + battle.opponent.pixelsOwned;
	const challengerPercent =
		totalPixels > 0 ? (battle.challenger.pixelsOwned / totalPixels) * 100 : 50;
	const statusStyles = getStatusStyles(battle.status);

	return (
		<div
			onClick={onClick}
			className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-white/20 shadow-[3px_3px_0px_rgba(0,0,0,0.2)] cursor-pointer hover:shadow-[4px_4px_0px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all"
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-medium text-black dark:text-white truncate">
					{battle.name || 'Battle'}
				</h3>
				<span
					className={`px-2 py-0.5 text-xs font-medium border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}
				>
					{battle.status.toUpperCase()}
				</span>
			</div>

			{/* Teams */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<div
						className="w-5 h-5 border-2 border-black"
						style={{ backgroundColor: battle.challenger.color }}
					/>
					<span className="text-sm font-medium text-black dark:text-white truncate max-w-[80px]">
						{battle.challenger.groupName}
					</span>
				</div>
				<div className="px-2 py-0.5 bg-red-500 border border-black text-white text-[10px] font-bold">
					VS
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-black dark:text-white truncate max-w-[80px]">
						{battle.opponent.groupName}
					</span>
					<div
						className="w-5 h-5 border-2 border-black"
						style={{ backgroundColor: battle.opponent.color }}
					/>
				</div>
			</div>

			{/* Progress Bar */}
			{(battle.status === 'active' || battle.status === 'completed') && (
				<>
					<div className="h-3 bg-gray-200 dark:bg-gray-700 overflow-hidden border border-black dark:border-white/20 mb-2">
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
					<div className="flex justify-between items-center text-xs">
						<span className="text-black/60 dark:text-white/60 font-medium">
							{battle.challenger.pixelsOwned} px
						</span>

						{battle.status === 'active' && (
							<span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
								<Clock className="h-3 w-3" />
								{formatTimeRemaining(battle.endDate)}
							</span>
						)}

						{battle.status === 'completed' && battle.winnerId && (
							<span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
								<Trophy className="h-3 w-3" />
								{battle.winnerId === battle.challenger.groupId
									? battle.challenger.groupName
									: battle.opponent.groupName}
							</span>
						)}

						<span className="text-black/60 dark:text-white/60 font-medium">
							{battle.opponent.pixelsOwned} px
						</span>
					</div>
				</>
			)}

			{battle.status === 'pending' && (
				<div className="text-sm text-black/50 dark:text-white/50 text-center py-2 border-t border-black/10 dark:border-white/10">
					Waiting for response...
				</div>
			)}
		</div>
	);
}
