import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { applyInvertTheme, loadStoredInvertTheme } from '../util/theme';

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	// Apply saved preference on mount
	useEffect(() => {
		setIsDark(loadStoredInvertTheme());
	}, []);

	function handleToggle() {
		const next = !isDark;
		setIsDark(next);
		applyInvertTheme(next);
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
