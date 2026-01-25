import { useState } from 'react';
import type { Group } from '../../../../../shared/sharedTypes';

interface ChallengeModalProps {
	myGroups: Group[];
	targetGroups: Group[];
	onClose: () => void;
	onChallenge: (data: {
		challengerGroupId: string;
		opponentGroupId: string;
		name?: string;
		settings?: {
			duration: number;
			gridSize: number;
			winCondition: 'pixels' | 'xp' | 'hybrid';
		};
	}) => void;
}

const DURATION_OPTIONS = [
	{ value: 60, label: '1 Hour' },
	{ value: 360, label: '6 Hours' },
	{ value: 1440, label: '24 Hours' },
	{ value: 4320, label: '3 Days' },
	{ value: 10080, label: '1 Week' },
];

const GRID_OPTIONS = [
	{ value: 30, label: 'Small (30x30)' },
	{ value: 50, label: 'Medium (50x50)' },
	{ value: 100, label: 'Large (100x100)' },
];

const WIN_CONDITION_OPTIONS = [
	{ value: 'pixels' as const, label: 'Most Pixels', description: 'Team with most pixels wins' },
	{ value: 'xp' as const, label: 'Most XP', description: 'Team with most XP wins' },
	{ value: 'hybrid' as const, label: 'Hybrid', description: '50% pixels + 50% XP' },
];

export default function ChallengeModal({ myGroups, targetGroups, onClose, onChallenge }: ChallengeModalProps) {
	const [challengerGroupId, setChallengerGroupId] = useState(myGroups[0]?._id || '');
	const [opponentGroupId, setOpponentGroupId] = useState('');
	const [duration, setDuration] = useState(1440);
	const [gridSize, setGridSize] = useState(50);
	const [winCondition, setWinCondition] = useState<'pixels' | 'xp' | 'hybrid'>('pixels');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!challengerGroupId || !opponentGroupId) return;

		onChallenge({
			challengerGroupId,
			opponentGroupId,
			settings: {
				duration,
				gridSize,
				winCondition,
			},
		});
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.3)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="p-4 border-b-2 border-black bg-orange-500 text-white">
					<h2 className="text-xl font-bold">Create Challenge</h2>
					<p className="text-sm text-orange-100">Challenge another group to a pixel battle!</p>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					{/* Your Group */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Your Group</label>
						<select
							value={challengerGroupId}
							onChange={(e) => setChallengerGroupId(e.target.value)}
							className="w-full p-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
						>
							{myGroups.map((group) => (
								<option key={group._id} value={group._id}>
									{group.name}
								</option>
							))}
						</select>
					</div>

					{/* Opponent Group */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Challenge Group</label>
						<select
							value={opponentGroupId}
							onChange={(e) => setOpponentGroupId(e.target.value)}
							className="w-full p-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
							required
						>
							<option value="">Select a group...</option>
							{targetGroups.map((group) => (
								<option key={group._id} value={group._id}>
									{group.name} ({group.members.length} members)
								</option>
							))}
						</select>
					</div>

					{/* Duration */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
						<div className="grid grid-cols-3 gap-2">
							{DURATION_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setDuration(opt.value)}
									className={`p-2 text-sm border-2 border-black rounded-lg transition-colors ${
										duration === opt.value
											? 'bg-orange-500 text-white'
											: 'bg-white hover:bg-orange-50'
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Grid Size */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Grid Size</label>
						<div className="grid grid-cols-3 gap-2">
							{GRID_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setGridSize(opt.value)}
									className={`p-2 text-sm border-2 border-black rounded-lg transition-colors ${
										gridSize === opt.value
											? 'bg-orange-500 text-white'
											: 'bg-white hover:bg-orange-50'
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Win Condition */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Win Condition</label>
						<div className="space-y-2">
							{WIN_CONDITION_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setWinCondition(opt.value)}
									className={`w-full p-3 text-left border-2 border-black rounded-lg transition-colors ${
										winCondition === opt.value
											? 'bg-orange-500 text-white'
											: 'bg-white hover:bg-orange-50'
									}`}
								>
									<div className="font-medium">{opt.label}</div>
									<div className={`text-xs ${winCondition === opt.value ? 'text-orange-100' : 'text-gray-500'}`}>
										{opt.description}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 p-3 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!challengerGroupId || !opponentGroupId}
							className="flex-1 p-3 bg-orange-500 text-white border-2 border-black rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Send Challenge
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
