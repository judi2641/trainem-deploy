type LevelInfo = {
	level: number;
	currentXp: number;
	nextLevelXp: number;
};

export function xpForNextLevel(level: number) {
	const safeLevel = Math.max(1, Math.floor(level));
	return 100 + (safeLevel - 1) * 10;
}

export function getLevelFromScore(score: number): LevelInfo {
	let level = 1;
	let remaining = Math.max(score, 0);

	while (remaining >= xpForNextLevel(level)) {
		remaining -= xpForNextLevel(level);
		level += 1;
	}

	return {
		level,
		currentXp: remaining,
		nextLevelXp: xpForNextLevel(level),
	};
}
