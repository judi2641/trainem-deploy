import Sidebar from '../components/Sidebar';

import TasksArea from '../components/TasksArea';
import FaqPopup from '../components/FaqPopup';

export default function Tasks() {
	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<main className="flex-1  pl-0 p-5 min-h-0 overflow-y-auto">
					{/* <div className="flex justify-end mb-4 pr-1">
						<FaqPopup
							title="Tasks FAQs"
							items={[
								'Hier kannst du Aufgaben für deinen Plan anlegen und abhaken.',
								'Nutze die Tages-Übersicht, um zu sehen, was heute ansteht.',
								'Tasks können später erweitert werden – dies ist die Basisversion.',
							]}
						/>
					</div> */}
					<TasksArea />
				</main>
			</div>
		</div>
	);
}
