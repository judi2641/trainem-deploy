import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardArea from '../components/DashboardArea';

export default function Dashboard() {
	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />

			<div className="flex-1 flex flex-col max-h-screen">
				<main className="flex-1 pt-0 pl-0 p-5 mt-5">
					<DashboardArea />
				</main>
			</div>
		</div>
	);
}
