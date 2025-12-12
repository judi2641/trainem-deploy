import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Gruppe() {
	return (
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<div className="flex h-full items-center justify-center">
						<div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
<<<<<<< HEAD
							<h1 className="text-2xl font-bold mb-2">Groups</h1>
							<p className="text-gray-500">
								You will soon be able to create groups and compete with your friends here.
=======
							<h1 className="text-2xl font-bold mb-2">Gruppe</h1>
							<p className="text-gray-500">
								Hier kannst du bald deine Gruppen erstellen und dich mit deinen Freunden messen.
>>>>>>> 495655ceb86891caf97c7d6a03040cdfd0cb50ef
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
