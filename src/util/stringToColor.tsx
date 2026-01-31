export function stringToColor(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}

	const colors = [
		'bg-blue-200/10 hover:bg-blue-200/30',
		'bg-purple-200/10 hover:bg-purple-200/30',
		'bg-pink-200/10 hover:bg-pink-200/30',
		'bg-orange-200/10 hover:bg-orange-200/30',
		'bg-cyan-200/10 hover:bg-cyan-200/30',
		'bg-indigo-200/10 hover:bg-indigo-200/30',
		'bg-teal-200/10 hover:bg-teal-200/30',
		'bg-rose-200/10 hover:bg-rose-200/30',
		'bg-amber-200/10 hover:bg-amber-200/30',
		'bgime-200/10 hover:bgime-200/30',
		'bg-emerald-200/10 hover:bg-emerald-200/30',
	];

	// Wähle Farbe basierend auf Hash
	const index = Math.abs(hash) % colors.length;
	return colors[index];
}
export function stringToBorder(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}

	const colors = [
		'border-l-3 border-l-blue-200 hover:border-l-blue-500',
		'border-l-3 border-l-purple-200 hover:border-l-purple-500',
		'border-l-3 border-l-pink-200 hover:border-l-pink-500',
		'border-l-3 border-l-orange-200 hover:border-l-orange-500',
		'border-l-3 border-l-cyan-200 hover:border-l-cyan-500',
		'border-l-3 border-l-indigo-200 hover:border-l-indigo-500',
		'border-l-3 border-l-teal-200 hover:border-l-teal-500',
		'border-l-3 border-l-rose-200 hover:border-l-rose-500',
		'border-l-3 border-l-amber-200 hover:border-l-amber-500',
		'border-l-3 border-l-lime-200 hover:border-l-lime-500',
		'border-l-3 border-l-emerald-200 hover:border-l-emerald-500',
	];

	// Wähle Farbe basierend auf Hash
	const index = Math.abs(hash) % colors.length;
	return colors[index];
}
