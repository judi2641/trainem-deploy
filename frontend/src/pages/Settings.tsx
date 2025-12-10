import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';

export default function Settings() {
	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<div className="bg-white shadow-md rounded-xl p-8 max-w-3xl">
						<h1 className="text-2xl font-bold mb-2">Einstellungen</h1>
						<p className="text-muted-foreground mb-6">
							Darkmode per einfacher Farb-Umkehr. Falls etwas noch nicht perfekt aussieht, kannst du jederzeit
							zurückschalten.
						</p>
						<ThemeToggle />
					</div>
				</main>
			</div>
		</div>
	);
}
