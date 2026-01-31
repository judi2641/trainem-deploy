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
				Simple color inversion: toggles an inverted color scheme via CSS.
			</p>
			<Button variant={isDark ? 'default' : 'outline'} onClick={handleToggle} aria-pressed={isDark}>
				{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
				<span className="ml-2">{isDark ? 'Dark on' : 'Dark off'}</span>
			</Button>
		</div>
	);
}
