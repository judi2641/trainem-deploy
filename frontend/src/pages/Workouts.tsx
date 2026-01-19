import Header from '@/components/Header';
import Sidebar from '../components/Sidebar';

import WorkoutsArea from '../components/WorkoutsArea';

export default function Workouts() {
	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<WorkoutsArea />
				</main>
			</div>
		</div>
	);
}
