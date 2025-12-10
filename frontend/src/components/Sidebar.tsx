import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
	HiOutlineViewGrid,
	HiOutlineCheckCircle,
	HiOutlineCalendar,
	HiOutlineChartBar,
	HiOutlineUserGroup,
	HiOutlineCog,
	HiOutlineQuestionMarkCircle,
	HiOutlineLogout,
} from 'react-icons/hi';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

export default function Sidebar() {
	const { user } = useAuth0();
	const { logout } = useAuth0();

	const [backendUser, setBackendUser] = useState<any>(null);

	useEffect(() => {
		async function loadUser() {
			if (!user?.sub) return;

			try {
				const res = await fetch(`http://localhost:3000/api/user/${user.sub}`);
				const data = await res.json();
				setBackendUser(data);
			} catch (err) {
				console.error('Fehler beim Laden des Users', err);
			}
		}

		loadUser();
	}, [user]);

	const handleLogout = () => {
		if (window.confirm('Willst du dich ausloggen?')) {
			logout();
		}
	};

	const activeVisuals: string =
		'flex items-center p-2 rounded-lg bg-primary/15 text-primary font-semibold';
	const nonActiveVisuals: string =
		'flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100';
	return (
		// Der Haupt-Container der Sidebar
		// flex flex-col: Stellt die Kinder (Logo, Nav, Download-Box) untereinander
		// h-screen: Macht die Sidebar 100% so hoch wie der Bildschirm
		// w-64: Feste Breite von 64 Einheiten (ca. 256px)
		// bg-white: Weißer Hintergrund
		// p-6: 6 Einheiten Padding (Polsterung) innen
		// shadow-md: Ein mittlerer Schatten
		<div className="w-64 bg-white p-6 shadow-md flex rounded-xl m-5 flex-col">
			{/* Logo  */}
			<div className="flex flex-col items-center mb-8">
				<div className="text-3xl font-extrabold text-gray-900 tracking-wide mb-6">TrainEm</div>

				{/* Avatar */}
				<Avatar className="h-20 w-20 border-2 border-gray-300 shadow-md bg-gray-100">
					<AvatarImage src="" alt="" />
					<AvatarFallback></AvatarFallback>
				</Avatar>

				{/* Nur der Vorname */}
				<p className="mt-3 text-lg font-semibold text-gray-800">{backendUser?.firstName ?? ''}</p>
			</div>

			{/* 2. Navigations-Menü */}
			<nav className="grow">
				{/* MENÜ-Sektion */}
				<h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Menu</h3>
				<ul className="space-y-2">
					{/* Aktiver NavLink (Dashboard) */}
					<li>
						<NavLink
							to="/dashboard"
							className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
						>
							<HiOutlineViewGrid className="w-5 h-5" />
							<span className="ml-3">Dashboard</span>
						</NavLink>
					</li>
					{/* Inaktiver NavLink (Tasks) */}
					<li>
						<NavLink
							to="/tasks"
							className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
						>
							<HiOutlineCheckCircle className="w-5 h-5" />
							<span className="ml-3">Tasks</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/trainingsplan"
							className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
						>
							<HiOutlineCalendar className="w-5 h-5" />
							<span className="ml-3">Trainingsplan</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/statistiken"
							className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
						>
							<HiOutlineChartBar className="w-5 h-5" />
							<span className="ml-3">Statistiken</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/gruppe"
							className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
						>
							<HiOutlineUserGroup className="w-5 h-5" />
							<span className="ml-3">Gruppe</span>
						</NavLink>
					</li>
				</ul>

				{/* GENERAL-Sektion */}
				<h3 className="text-xs font-semibold text-gray-400 uppercase mt-8 mb-2">General</h3>
				<ul className="space-y-2">
					<li>
						<NavLink
							to="/settings"
							className={({ isActive }) =>
								`flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 ${
									isActive ? 'bg-primary/15 text-primary font-semibold' : ''
								}`
							}
						>
							<HiOutlineCog className="w-5 h-5" />
							<span className="ml-3">Settings</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/help"
							className={({ isActive }) =>
								`flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 ${
									isActive ? 'bg-primary/15 text-primary font-semibold' : ''
								}`
							}
						>
							<HiOutlineQuestionMarkCircle className="w-5 h-5" />
							<span className="ml-3">Help</span>
						</NavLink>
					</li>
					<li>
						<button
							onClick={handleLogout}
							className="cursor-pointer flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 pr-29"
						>
							<HiOutlineLogout className="w-5 h-5" />
							<span className="ml-3">Logout</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
