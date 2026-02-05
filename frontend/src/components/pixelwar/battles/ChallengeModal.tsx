import { useState } from 'react';
import { Swords, Clock, Grid3X3, Trophy } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ChallengeModalProps {
	myGroups: any[];
	targetGroups: any[];
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
	{ value: 60, label: '1h' },
	{ value: 360, label: '6h' },
	{ value: 1440, label: '24h' },
	{ value: 4320, label: '3d' },
	{ value: 10080, label: '1w' },
];

const GRID_OPTIONS = [
	{ value: 15, label: '15x15' },
	{ value: 30, label: '30x30' },
	{ value: 50, label: '50x50' },
];

const WIN_CONDITION_OPTIONS = [
	{ value: 'pixels' as const, label: 'Most Pixels', description: 'Team with most pixels wins' },
	{ value: 'xp' as const, label: 'Most XP', description: 'Team with most XP wins' },
	{ value: 'hybrid' as const, label: 'Hybrid', description: '50% pixels + 50% XP' },
];

export default function ChallengeModal({
	myGroups,
	targetGroups,
	onClose,
	onChallenge,
}: ChallengeModalProps) {
	const [challengerGroupId, setChallengerGroupId] = useState(myGroups[0]?._id || '');
	const [opponentGroupId, setOpponentGroupId] = useState('');
	const [duration, setDuration] = useState(1440);
	const [gridSize, setGridSize] = useState(30);
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

	const selectedChallenger = myGroups.find((g) => g._id === challengerGroupId);
	const selectedOpponent = targetGroups.find((g) => g._id === opponentGroupId);

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-lg border-4 border-black bg-white text-black">
				<DialogHeader>
					<DialogTitle className="font-pixel text-lg flex items-center gap-2">
						<div className="w-6 h-6 bg-orange-500 border-2 border-black flex items-center justify-center">
							<Swords className="w-3 h-3 text-white" />
						</div>
						Create Challenge
					</DialogTitle>
					<DialogDescription>Challenge another group to a pixel battle!</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 mt-4">
					{/* Your Group */}
					<div className="space-y-2">
						<Label className="font-medium text-sm">Your Group</Label>
						<div className="relative">
							<select
								value={challengerGroupId}
								onChange={(e) => setChallengerGroupId(e.target.value)}
								className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
							>
								{myGroups.map((group) => (
									<option key={group._id} value={group._id}>
										{group.name}
									</option>
								))}
							</select>
							{selectedChallenger && (
								<div
									className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 border border-black"
									style={{ backgroundColor: selectedChallenger.color }}
								/>
							)}
						</div>
					</div>

					{/* Opponent Group */}
					<div className="space-y-2">
						<Label className="font-medium text-sm">Challenge Group</Label>
						<div className="relative">
							<select
								value={opponentGroupId}
								onChange={(e) => setOpponentGroupId(e.target.value)}
								className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
								required
							>
								<option value="">Select a group...</option>
								{targetGroups.map((group) => (
									<option key={group._id} value={group._id}>
										{group.name} ({group.members.length} members)
									</option>
								))}
							</select>
							{selectedOpponent && (
								<div
									className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 border border-black"
									style={{ backgroundColor: selectedOpponent.color }}
								/>
							)}
						</div>
					</div>

					{/* Duration */}
					<div className="space-y-2">
						<Label className="font-medium text-sm flex items-center gap-1.5">
							<Clock className="h-4 w-4 text-sky-600" />
							Duration
						</Label>
						<div className="grid grid-cols-5 gap-2">
							{DURATION_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setDuration(opt.value)}
									className={`p-2 text-sm border-2 border-black transition-colors ${
										duration === opt.value
											? 'bg-orange-500 text-white'
											: 'bg-white hover:bg-orange-50 text-black'
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Grid Size */}
					<div className="space-y-2">
						<Label className="font-medium text-sm flex items-center gap-1.5">
							<Grid3X3 className="h-4 w-4 text-violet-600" />
							Grid Size
						</Label>
						<div className="grid grid-cols-3 gap-2">
							{GRID_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setGridSize(opt.value)}
									className={`p-2 text-sm border-2 border-black transition-colors ${
										gridSize === opt.value
											? 'bg-orange-500 text-white'
											: 'bg-white hover:bg-orange-50 text-black'
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Win Condition */}
					<div className="space-y-2">
						<Label className="font-medium text-sm flex items-center gap-1.5">
							<Trophy className="h-4 w-4 text-amber-600" />
							Win Condition
						</Label>
						<div className="space-y-2">
							{WIN_CONDITION_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setWinCondition(opt.value)}
									className={`w-full p-3 text-left border-2 border-black transition-colors ${
										winCondition === opt.value
											? 'bg-orange-500 text-white'
											: 'bg-white hover:bg-orange-50 text-black'
									}`}
								>
									<div className="font-medium text-sm">{opt.label}</div>
									<div
										className={`text-xs ${winCondition === opt.value ? 'text-orange-100' : 'text-black/50'}`}
									>
										{opt.description}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 p-3 border-2 border-black bg-white text-black hover:bg-gray-50 transition-colors font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!challengerGroupId || !opponentGroupId}
							className="flex-1 p-3 bg-orange-500 text-white border-2 border-black hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
						>
							Send Challenge
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
