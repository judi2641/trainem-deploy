import { useAuth0 } from '@auth0/auth0-react';

export default function LandingPage() {
	const { loginWithRedirect, logout, isLoading } = useAuth0();

	// LOGIN → go to Dashboard
	const handleLogin = () => {
		loginWithRedirect({
			appState: { returnTo: '/dashboard' },
		});
	};

	// REGISTER → go to Onboarding
	const handleRegister = () => {
		logout({ logoutParams: { returnTo: window.location.origin } });

		setTimeout(() => {
			loginWithRedirect({
				authorizationParams: {
					screen_hint: 'signup',
				},
				appState: { returnTo: '/onboarding' },
			});
		}, 200);
	};

	// Prevent rendering until Auth0 is ready
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
			{/* Navbar */}
			<nav className="p-6 flex justify-between items-center">
				<div className="text-white text-2xl font-bold">💪 Trainem</div>
				<div className="flex gap-4">
					<button
						onClick={handleLogin}
						className="px-6 py-2 text-white border-2 border-white rounded-lg 
						hover:bg-white hover:text-indigo-600 transition"
					>
						Login
					</button>

					<button
						onClick={handleRegister}
						className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold 
						hover:bg-gray-100 transition"
					>
						Register
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="max-w-6xl mx-auto px-6 py-20 text-center">
				<h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
					Your personal
					<br />
					<span className="text-yellow-300">Training Plan</span>
				</h1>

				<p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
					Achieve your fitness goals with a personalized training plan designed just for you.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={handleRegister}
						className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-lg text-lg font-bold 
						hover:bg-yellow-300 transition transform hover:scale-105 shadow-xl"
					>
						Start now — it’s free! 🚀
					</button>

					<button
						onClick={handleLogin}
						className="px-8 py-4 bg-white/20 text-white border-2 border-white rounded-lg 
						text-lg font-semibold hover:bg-white/30 transition backdrop-blur-sm"
					>
						Already a member? Login
					</button>
				</div>
			</div>
		</div>
	);
}
