import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';

export default function Settings() {
	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<div className="bg-white shadow-md rounded-xl p-8 max-w-3xl">
						<h1 className="text-2xl font-bold mb-2">Settings</h1>
						<p className="text-muted-foreground mb-6">
							Enable dark mode with a quick color swap. If something looks off, you can switch back
							anytime.
						</p>
						<ThemeToggle />
					</div>
				</main>
			</div>
		</div>
	);
}
