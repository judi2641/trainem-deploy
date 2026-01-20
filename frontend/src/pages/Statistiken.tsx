import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Statistiken() {
	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<div className="flex h-full items-center justify-center">
						<div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
							<h1 className="text-2xl font-bold mb-2">Statistics</h1>
							<p className="text-gray-500">
								Missed a workout or crushed it? Your overview will live here soon.
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
