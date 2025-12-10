import Sidebar from '../components/Sidebar';
import DashboardArea from '../components/DashboardArea';
import Header from '@/components/Header';

export default function Dashboard() {
	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />

			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<Header></Header>
				<main className="flex-1 p-5 pl-0 pt-0 overflow-hidden">
					<DashboardArea />
				</main>
			</div>
		</div>
	);
}
