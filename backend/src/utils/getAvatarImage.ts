export function getAvatarImage(currentImage: string, score: number) {
	const [color, rest] = currentImage.split('Level');

	const level = Math.min(7, Math.floor(score / 100) + 1);

	return `${color}Level${level}${rest.slice(1)}`;
}
