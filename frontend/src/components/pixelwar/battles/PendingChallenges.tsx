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

export default function PendingChallenges({ challenges, onAccept, onDecline }: PendingChallengesProps) {
	if (challenges.length === 0) return null;

	return (
		<div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
			<h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
				<span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
				Incoming Challenges ({challenges.length})
			</h3>

			<div className="space-y-3">
				{challenges.map((challenge) => (
					<div
						key={challenge._id}
						className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-black"
					>
						<div className="flex items-center gap-4">
							{/* Challenger */}
							<div className="flex items-center gap-2">
								<div
									className="w-4 h-4 border border-black"
									style={{ backgroundColor: challenge.challenger.color }}
								/>
								<span className="font-medium">{challenge.challenger.groupName}</span>
							</div>

							<span className="text-gray-400">challenges</span>

							{/* Opponent (your group) */}
							<div className="flex items-center gap-2">
								<span className="font-medium">{challenge.opponent.groupName}</span>
								<div
									className="w-4 h-4 border border-black"
									style={{ backgroundColor: challenge.opponent.color }}
								/>
							</div>

							{/* Settings */}
							<div className="text-sm text-gray-500">
								<span className="px-2 py-0.5 bg-gray-100 rounded mr-2">
									{formatDuration(challenge.settings.duration)}
								</span>
								<span className="px-2 py-0.5 bg-gray-100 rounded mr-2">
									{challenge.settings.gridSize}x{challenge.settings.gridSize}
								</span>
								<span className="px-2 py-0.5 bg-gray-100 rounded">
									{challenge.settings.winCondition}
								</span>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<button
								onClick={() => onDecline(challenge._id)}
								className="px-3 py-1.5 text-sm border-2 border-black rounded hover:bg-red-50 hover:border-red-500 transition-colors"
							>
								Decline
							</button>
							<button
								onClick={() => onAccept(challenge._id)}
								className="px-3 py-1.5 text-sm bg-emerald-500 text-white border-2 border-black rounded hover:bg-emerald-600 transition-colors"
							>
								Accept
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
