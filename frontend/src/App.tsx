import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
//import Tasks from './pages/Tasks';
import React from 'react';
import Landing from './pages/OnboardingSteps/Landing';
import BasicInfo from './pages/OnboardingSteps/BasicInfo';
import Experience from './pages/OnboardingSteps/Experience';
import Goals from './pages/OnboardingSteps/Goals';
import Schedule from './pages/OnboardingSteps/Schedule';
import CharacterColor from './pages/OnboardingSteps/CharacterColor';
import Intro from './pages/OnboardingSteps/Intro';

import { useAuth0 } from '@auth0/auth0-react';
import Tasks from './pages/Calendar';
import Callback from './pages/Callback';
import Trainingsplan from './pages/Trainingsplan';
import { OnboardingProvider } from './context/OnboardingContext';
import Statistiken from './pages/Statistiken';
import Gruppe from './pages/Gruppe';
import Settings from './pages/Settings';
import Help from './pages/Help';
import { ContextProvider } from './context/AppContext';
import Workouts from './pages/Workouts';
import Calendar from './pages/Calendar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, isLoading } = useAuth0();

	// Wenn nicht eingeloggt → zurück zur Landing Page
	if (!isAuthenticated && !isLoading) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

function App() {
	return (
		<Router>
			<ContextProvider>
				<Routes>
					{/* Öffentlich */}
					<Route path="/" element={<LandingPage />} />

					<Route path="/callback" element={<Callback />} />

					{/* Geschützt */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/calendar"
						element={
							<ProtectedRoute>
								<Calendar />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/workouts"
						element={
							<ProtectedRoute>
								<Workouts />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/statistiken"
						element={
							<ProtectedRoute>
								<Statistiken />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/gruppe"
						element={
							<ProtectedRoute>
								<Gruppe />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/help"
						element={
							<ProtectedRoute>
								<Help />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/onboarding"
						element={
							<ProtectedRoute>
								<OnboardingProvider>
									<Onboarding />
								</OnboardingProvider>
							</ProtectedRoute>
						}
					>
						<Route path="intro" element={<Intro />} />
						<Route index element={<Landing />} />
						<Route path="basic" element={<BasicInfo />} />
						<Route path="experience" element={<Experience />} />
						<Route path="goals" element={<Goals />} />
						<Route path="schedule" element={<Schedule />} />
						<Route path="CharacterColor" element={<CharacterColor />} />
					</Route>
				</Routes>
			</ContextProvider>
		</Router>
	);
}

export default App;
