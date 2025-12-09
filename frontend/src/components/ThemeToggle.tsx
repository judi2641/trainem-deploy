import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'trainem-simple-theme';

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	// Apply saved preference on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		const enabled = saved === 'dark';
		setIsDark(enabled);
		document.documentElement.classList.toggle('invert-theme', enabled);
	}, []);

	function handleToggle() {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle('invert-theme', next);
		localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
	}

	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm text-muted-foreground">
				Einfache Farb-Umkehr: aktiviert invertiert alle Farben via CSS.
			</p>
			<Button variant={isDark ? 'default' : 'outline'} onClick={handleToggle} aria-pressed={isDark}>
				{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
				<span className="ml-2">{isDark ? 'Dark aktiv' : 'Dark aus'}</span>
			</Button>
		</div>
	);
}
