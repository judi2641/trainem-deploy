const STORAGE_KEY = 'trainem-theme-mode';

export type ThemeMode = 'light' | 'dark' | 'invert';

export function applyTheme(mode: ThemeMode) {
	if (typeof document === 'undefined') return;
	
	// Remove all theme classes first
	document.documentElement.classList.remove('dark', 'invert-theme');
	
	// Apply the appropriate class
	if (mode === 'dark') {
		document.documentElement.classList.add('dark');
	} else if (mode === 'invert') {
		document.documentElement.classList.add('invert-theme');
	}
	
	localStorage.setItem(STORAGE_KEY, mode);
}

export function loadStoredTheme(): ThemeMode {
	if (typeof document === 'undefined') return 'light';
	const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
	const mode: ThemeMode = saved === 'dark' || saved === 'invert' ? saved : 'light';
	applyTheme(mode);
	return mode;
}

export function getStorageKey() {
	return STORAGE_KEY;
}

// Legacy support for old theme toggle
export function applyInvertTheme(enabled: boolean) {
	applyTheme(enabled ? 'invert' : 'light');
}

export function loadStoredInvertTheme(): boolean {
	const mode = loadStoredTheme();
	return mode === 'invert';
}
