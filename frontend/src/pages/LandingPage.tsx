import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
	const hintergrundfarbe = cn(
		'min-h-screen',
		'bg-gradient-to-br',
		'from-[#1FAF66]',
		'via-[#0C7F45]',
		'to-[#054F2D]',
	);

	return (
		<div className={hintergrundfarbe}>
			{/* Navbar */}
			<nav className="p-6 flex justify-between items-center">
				{/* TRAINEM LOGO — größer + schwarze Umrandung */}
				<div
					className="text-white text-5xl font-bold -mt-4"
					style={{
						textShadow: `
              2px 2px 0 #000,
              -2px -2px 0 #000,
              -2px 2px 0 #000,
              2px -2px 0 #000
            `,
					}}
				>
					TrainEm
				</div>
			</nav>
			{/* Hero Section */}
			<div className="max-w-6xl mx-auto px-6 py-10 text-center">
				<h1 className="text-5xl md:text-7xl font-bold text-white mb-15">
					Your personal
					<br />
					<span className="text-yellow-300">Training Plan</span>
				</h1>

				<p className="text-xl md:text-2xl text-white/90 mb-25 max-w-2xl mx-auto">
					Achieve your fitness goals with a personalized training plan designed just for you!
				</p>
				{/* Background Avatars */}
				<div className="pointer-events-none absolute inset-0 flex justify-between px-10 opacity-100">
					{/* Linke Seite – dick → dünn */}
					<div className="flex flex-col justify-start gap-4 mt-20">
						<img src="/assets/avatar/abnahme/blauLevel1Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel2Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel3Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel4Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel5Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel6Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel7Abnahme.png" className="h-20" />
					</div>
					{/* Rechte Seite – dünn → fit */}
					<div className="flex flex-col justify-start gap-4 mt-20">
						<img src="/assets/avatar/abnahme/blauLevel8Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel9Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel10Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel11Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel12Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel13Abnahme.png" className="h-20" />
						<img src="/assets/avatar/abnahme/blauLevel14Abnahme.png" className="h-20" />
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-20 justify-center">
					<Button
						onClick={handleRegister}
						className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-20 py-8 rounded-xl shadow-md text-lg"
					>
						Register 🚀
					</Button>

					<Button
						onClick={handleLogin}
						variant="outline"
						className="bg-green-900/60 border-2 border-yellow-400 text-yellow-300 
             hover:bg-green-800/60 font-semibold px-20 py-8 
             rounded-xl shadow-md text-lg min-w-[260px]
"
					>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}
