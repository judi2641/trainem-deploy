const STORAGE_KEY = 'trainem-simple-theme';

export function applyInvertTheme(enabled: boolean) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('invert-theme', enabled);
	localStorage.setItem(STORAGE_KEY, enabled ? 'dark' : 'light');
}

export function loadStoredInvertTheme(): boolean {
	if (typeof document === 'undefined') return false;
	const saved = localStorage.getItem(STORAGE_KEY);
	const enabled = saved === 'dark';
	document.documentElement.classList.toggle('invert-theme', enabled);
	return enabled;
}

export function getStorageKey() {
	return STORAGE_KEY;
}
