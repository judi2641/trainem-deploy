import BattleCard from './BattleCard';

interface BattleListProps {
	battles: any[];
	onSelect: (battle: any) => void;
	emptyMessage?: string;
}

function PixelSwordsIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="1" width="2" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="5" y="5" width="2" height="2" />
			<rect x="7" y="7" width="2" height="2" />
			<rect x="9" y="5" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="13" y="1" width="2" height="2" />
		</svg>
	);
}

export default function BattleList({
	battles,
	onSelect,
	emptyMessage = 'No battles',
}: BattleListProps) {
	if (battles.length === 0) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-center">
					<PixelSwordsIcon className="h-10 w-10 text-black/20 dark:text-white/20 mx-auto mb-2" />
					<p className="text-sm text-black/50 dark:text-white/50">{emptyMessage}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{battles.map((battle) => (
				<BattleCard key={battle._id} battle={battle} onClick={() => onSelect(battle)} />
			))}
		</div>
	);
}
