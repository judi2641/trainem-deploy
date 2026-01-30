import { Swords, Clock, Grid3X3, Trophy, X, Check } from 'lucide-react';
import type { Battle } from '../../../../../shared/sharedTypes';

interface PendingChallengesProps {
	challenges: Battle[];
	onAccept: (battleId: string) => void;
	onDecline: (battleId: string) => void;
}

function formatDuration(minutes: number): string {
	if (minutes < 60) return `${minutes} min`;
	if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
	return `${Math.floor(minutes / 1440)}d`;
}

function getWinConditionLabel(condition: string): string {
	switch (condition) {
		case 'pixels':
			return 'Most Pixels';
		case 'xp':
			return 'Most XP';
		case 'hybrid':
			return 'Hybrid';
		default:
			return condition;
	}
}

export default function PendingChallenges({ challenges, onAccept, onDecline }: PendingChallengesProps) {
	if (challenges.length === 0) return null;

	return (
		<div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-orange-400 dark:border-orange-600 p-4 shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
			{/* Header */}
			<div className="flex items-center gap-3 mb-4">
				<div className="h-7 w-7 bg-orange-500 border-2 border-black flex items-center justify-center animate-pulse">
					<Swords className="h-4 w-4 text-white" />
				</div>
				<div>
					<h3 className="font-pixel text-base text-black dark:text-white">
						Incoming Challenges!
					</h3>
					<p className="text-xs text-black/60 dark:text-white/60">
						{challenges.length} {challenges.length === 1 ? 'group wants' : 'groups want'} to battle you
					</p>
				</div>
			</div>

			{/* Challenge Cards */}
			<div className="space-y-3">
				{challenges.map((challenge) => (
					<div
						key={challenge._id}
						className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white/20 p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
					>
						{/* Teams */}
						<div className="flex items-center gap-3 mb-4 flex-wrap">
							{/* Challenger */}
							<div className="flex items-center gap-2">
								<div
									className="w-5 h-5 border-2 border-black"
									style={{ backgroundColor: challenge.challenger.color }}
								/>
								<span className="font-medium text-sm text-black dark:text-white">
									{challenge.challenger.groupName}
								</span>
							</div>

							{/* VS */}
							<div className="px-2 py-0.5 bg-red-500 border border-black text-white text-[10px] font-bold">
								VS
							</div>

							{/* Opponent (your group) */}
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm text-black dark:text-white">
									{challenge.opponent.groupName}
								</span>
								<div
									className="w-5 h-5 border-2 border-black"
									style={{ backgroundColor: challenge.opponent.color }}
								/>
							</div>
						</div>

						{/* Settings & Actions Row */}
						<div className="flex items-center justify-between flex-wrap gap-3">
							{/* Battle Settings */}
							<div className="flex items-center gap-2 flex-wrap">
								<div className="flex items-center gap-1 px-2 py-1 bg-sky-100 dark:bg-sky-900/40 border border-black dark:border-white/20 text-xs">
									<Clock className="h-3 w-3 text-sky-600" />
									<span className="text-black dark:text-white font-medium">
										{formatDuration(challenge.settings.duration)}
									</span>
								</div>
								<div className="flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/40 border border-black dark:border-white/20 text-xs">
									<Grid3X3 className="h-3 w-3 text-violet-600" />
									<span className="text-black dark:text-white font-medium">
										{challenge.settings.gridSize}x{challenge.settings.gridSize}
									</span>
								</div>
								<div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 border border-black dark:border-white/20 text-xs">
									<Trophy className="h-3 w-3 text-amber-600" />
									<span className="text-black dark:text-white font-medium">
										{getWinConditionLabel(challenge.settings.winCondition)}
									</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-2">
								<button
									onClick={() => onDecline(challenge._id)}
									className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-700 border-2 border-black dark:border-white/20 text-black dark:text-white text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-500 transition-colors"
								>
									<X className="h-3.5 w-3.5" />
									Decline
								</button>
								<button
									onClick={() => onAccept(challenge._id)}
									className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 border-2 border-black text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
								>
									<Check className="h-3.5 w-3.5" />
									Accept
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
