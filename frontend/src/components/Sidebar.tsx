import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

// Pixel-style icon components
function PixelDashboardIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="1" width="6" height="6" />
			<rect x="9" y="1" width="6" height="6" />
			<rect x="1" y="9" width="6" height="6" />
			<rect x="9" y="9" width="6" height="6" />
		</svg>
	);
}

function PixelDumbbellIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="0" y="5" width="2" height="6" />
			<rect x="2" y="6" width="2" height="4" />
			<rect x="4" y="7" width="8" height="2" />
			<rect x="12" y="6" width="2" height="4" />
			<rect x="14" y="5" width="2" height="6" />
		</svg>
	);
}

function PixelCheckIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="3" y="8" width="2" height="2" />
			<rect x="5" y="10" width="2" height="2" />
			<rect x="7" y="8" width="2" height="2" />
			<rect x="9" y="6" width="2" height="2" />
			<rect x="11" y="4" width="2" height="2" />
		</svg>
	);
}

function PixelSparkleIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="4" />
			<rect x="7" y="12" width="2" height="4" />
			<rect x="0" y="7" width="4" height="2" />
			<rect x="12" y="7" width="4" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="11" y="11" width="2" height="2" />
			<rect x="6" y="6" width="4" height="4" />
		</svg>
	);
}

function PixelChartIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="12" width="3" height="3" />
			<rect x="5" y="8" width="3" height="7" />
			<rect x="9" y="5" width="3" height="10" />
			<rect x="13" y="2" width="3" height="13" />
		</svg>
	);
}

function PixelSettingsIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="2" />
			<rect x="7" y="14" width="2" height="2" />
			<rect x="0" y="7" width="2" height="2" />
			<rect x="14" y="7" width="2" height="2" />
			<rect x="2" y="2" width="2" height="2" />
			<rect x="12" y="2" width="2" height="2" />
			<rect x="2" y="12" width="2" height="2" />
			<rect x="12" y="12" width="2" height="2" />
			<rect x="5" y="5" width="6" height="6" />
			<rect x="6" y="6" width="4" height="4" fill="white" />
		</svg>
	);
}

function PixelHelpIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="5" y="1" width="6" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="11" y="5" width="2" height="2" />
			<rect x="9" y="7" width="2" height="2" />
			<rect x="7" y="9" width="2" height="2" />
			<rect x="7" y="13" width="2" height="2" />
		</svg>
	);
}

function PixelLogoutIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="1" width="2" height="14" />
			<rect x="1" y="1" width="6" height="2" />
			<rect x="1" y="13" width="6" height="2" />
			<rect x="6" y="7" width="8" height="2" />
			<rect x="11" y="5" width="2" height="2" />
			<rect x="11" y="9" width="2" height="2" />
			<rect x="13" y="6" width="2" height="4" />
		</svg>
	);
}

export default function Sidebar() {
	const { user, logout } = useAuth0();
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

	const activeVisuals =
		'flex items-center gap-3 px-3 py-2.5 bg-emerald-500 text-white font-medium border-2 border-black';
	const nonActiveVisuals =
		'flex items-center gap-3 px-3 py-2.5 text-black/70 hover:bg-white/50 hover:text-black border-2 border-transparent transition-colors';

	return (
		<div className="relative w-72 m-4 flex flex-col shrink-0">
			{/* Shadow layer */}
			<div className="absolute left-2 top-2 h-full w-full border-4 border-black bg-black/10" />

			{/* Main sidebar container */}
			<div className="relative h-full bg-white/90 backdrop-blur border-4 border-black p-5 flex flex-col">
				{/* Logo */}
				<div className="flex items-center gap-3 mb-8">
					<div className="h-5 w-5 bg-emerald-500 border-2 border-black" />
					<span className="font-pixel text-black text-xl">TrainEm</span>
				</div>

				{/* User Profile */}
				<div className="flex items-center gap-4 mb-8 p-3 bg-gradient-to-r from-emerald-50 to-amber-50 border-2 border-black">
					<Avatar className="h-12 w-12 border-2 border-black">
						{backendUser?.img ? (
							<AvatarImage
								src={backendUser.img || '/placeholder.svg'}
								alt="Avatar"
								className="object-cover object-top"
							/>
						) : null}
						<AvatarFallback className="bg-amber-400 text-black font-pixel text-xs">
							{backendUser?.firstName?.[0] ?? '?'}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="font-medium text-black truncate">{backendUser?.firstName ?? 'User'}</p>
						<p className="text-xs text-black/60">Level 1</p>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-6">
					{/* Menu Section */}
					<div>
						<h3 className="font-pixel text-[10px] text-black/50 uppercase mb-3 tracking-wider">
							Menu
						</h3>
						<ul className="space-y-1.5">
							<li>
								<NavLink
									to="/dashboard"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelDashboardIcon className="h-5 w-5 shrink-0" />
									<span>Dashboard</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/workouts"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelDumbbellIcon className="h-5 w-5 shrink-0" />
									<span>Workouts</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/habits"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelCheckIcon className="h-5 w-5 shrink-0" />
									<span>Habits</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/pixel-art"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelSparkleIcon className="h-5 w-5 shrink-0" />
									<span>Pixel Art</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/statistics"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelChartIcon className="h-5 w-5 shrink-0" />
									<span>Statistics</span>
								</NavLink>
							</li>
						</ul>
					</div>

					{/* General Section */}
					<div>
						<h3 className="font-pixel text-[10px] text-black/50 uppercase mb-3 tracking-wider">
							General
						</h3>
						<ul className="space-y-1.5">
							<li>
								<NavLink
									to="/settings"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelSettingsIcon className="h-5 w-5 shrink-0" />
									<span>Settings</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/help"
									className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
								>
									<PixelHelpIcon className="h-5 w-5 shrink-0" />
									<span>Help</span>
								</NavLink>
							</li>
						</ul>
					</div>
				</nav>

				{/* Logout Button */}
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-3 py-2.5 mt-4 w-full text-black/70 hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-200 transition-colors"
				>
					<PixelLogoutIcon className="h-5 w-5 shrink-0" />
					<span>Logout</span>
				</button>
			</div>
		</div>
	);
}
