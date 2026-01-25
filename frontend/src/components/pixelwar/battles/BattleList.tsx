import type { Battle } from '../../../../../shared/sharedTypes';
import BattleCard from './BattleCard';

interface BattleListProps {
	battles: Battle[];
	onSelect: (battle: Battle) => void;
	emptyMessage?: string;
}

export default function BattleList({ battles, onSelect, emptyMessage = 'No battles' }: BattleListProps) {
	if (battles.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center p-8 bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
				<p className="text-gray-500">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto space-y-3 pr-2">
			{battles.map((battle) => (
				<BattleCard key={battle._id} battle={battle} onClick={() => onSelect(battle)} />
			))}
		</div>
	);
}
