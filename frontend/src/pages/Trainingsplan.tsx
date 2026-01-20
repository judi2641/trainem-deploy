import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TrainingsplanArea from '../components/TrainingsplanArea';

export default function Trainingsplan() {
	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<TrainingsplanArea />
				</main>
			</div>
		</div>
	);
}
