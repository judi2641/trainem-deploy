'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { Star, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getLevelFromScore } from '@/util/level';

export default function PixelCharacter() {
	const { myUser } = useMyContext();

	const characterData = useMemo(() => {
		const totalScore = myUser?.points ?? myUser?.score ?? 0;
		const { level, currentXp, nextLevelXp } = getLevelFromScore(totalScore);
		const xpPercent = (currentXp / nextLevelXp) * 100;

		return {
			level,
			xpInCurrentLevel: currentXp,
			xpToNextLevel: nextLevelXp,
			xpPercent,
		};
	}, [myUser?.points, myUser?.score]);

	const characterColor = myUser?.characterColor ?? '#10B981';

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-amber-400 border-2 border-black" />
					<PixelCardTitle>Your Character</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent className="flex flex-col items-center justify-center gap-3">
				{/* Pixel avatar */}
				<NavLink to="/pixel-art" className="group">
					<div className="relative">
						<div
							className="w-16 h-16 border-3 border-black transition-transform group-hover:scale-105"
							style={{ backgroundColor: characterColor }}
						>
							{/* Simple pixel face */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="flex gap-2">
									<div className="w-2 h-2 bg-black" />
									<div className="w-2 h-2 bg-black" />
								</div>
							</div>
							<div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-black" />
						</div>
						{/* Shadow */}
						<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-2 bg-black/20 blur-sm" />
					</div>
				</NavLink>

				{/* Level badge */}
				<div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-black px-3 py-1">
					<Star className="h-4 w-4 text-amber-600" />
					<span className="font-pixel text-xs text-black">LVL {characterData.level}</span>
				</div>

				{/* XP Progress */}
				<div className="w-full">
					<div className="flex items-center justify-between text-xs mb-1">
						<span className="text-black/60 dark:text-white/60 flex items-center gap-1">
							<Zap className="h-3 w-3" />
							XP
						</span>
						<span className="text-black dark:text-white font-medium">
							{characterData.xpInCurrentLevel}/{characterData.xpToNextLevel}
						</span>
					</div>
					<div className="h-2 w-full bg-black/10 border border-black overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
							style={{ width: `${characterData.xpPercent}%` }}
						/>
					</div>
				</div>
			</PixelCardContent>
		</PixelCard>
	);
}
