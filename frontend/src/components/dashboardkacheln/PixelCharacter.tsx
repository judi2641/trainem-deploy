'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useEffect, useMemo, useState } from 'react';
import { Star, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getLevelFromScore } from '@/util/level';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
type PixelArtPixel = {
	x: number;
	y: number;
	color: string;
};

export default function PixelCharacter() {
	const { myUser, pixelArt } = useMyContext();
	const [pixelAvatarUrl, setPixelAvatarUrl] = useState<string | null>(null);
	function pixelArtToDataUrl(pixels: PixelArtPixel[], gridSize: number) {
		if (typeof document === 'undefined') return null;

		const canvas = document.createElement('canvas');
		canvas.width = gridSize;
		canvas.height = gridSize;

		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, gridSize, gridSize);

		pixels.forEach((pixel) => {
			if (
				typeof pixel.x !== 'number' ||
				typeof pixel.y !== 'number' ||
				typeof pixel.color !== 'string'
			) {
				return;
			}
			if (pixel.x < 0 || pixel.y < 0 || pixel.x >= gridSize || pixel.y >= gridSize) {
				return;
			}
			ctx.fillStyle = pixel.color;
			ctx.fillRect(pixel.x, pixel.y, 1, 1);
		});

		return canvas.toDataURL('image/png');
	}
	useEffect(() => {
		if (!pixelArt) return;
		const gridSize = typeof pixelArt.gridSize === 'number' ? pixelArt.gridSize : 16;
		const pixels = Array.isArray(pixelArt.pixels) ? pixelArt.pixels : [];
		setPixelAvatarUrl(pixelArtToDataUrl(pixels, gridSize));
	}, [pixelArt]);

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

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-amber-400 border-2 border-black" />
					<PixelCardTitle>Your Pixelart</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent className="flex flex-col items-center justify-center gap-3">
				{/* Pixel avatar */}
				<NavLink to="/pixel-art" className="group">
					<Avatar className="h-16 w-16 border-2 border-black rounded-none">
						{pixelAvatarUrl || myUser?.img ? (
							<AvatarImage
								src={pixelAvatarUrl || myUser?.img}
								alt="Avatar"
								className="object-contain pixelated"
							/>
						) : null}
						<AvatarFallback className="bg-amber-400 text-black font-pixel text-xs">
							{myUser?.firstName?.[0] ?? '?'}
						</AvatarFallback>
					</Avatar>
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
