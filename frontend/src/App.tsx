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

import { useAuth0 } from '@auth0/auth0-react';
import Tasks from './pages/Tasks';

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
			<Routes>
				{/* Öffentlich */}
				<Route path="/" element={<LandingPage />} />

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
					path="/tasks"
					element={
						<ProtectedRoute>
							<Tasks />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/onboarding"
					element={
						<ProtectedRoute>
							<Onboarding />
						</ProtectedRoute>
					}
				>
					<Route index element={<Landing />} />
					<Route path="basic" element={<BasicInfo />} />
					<Route path="experience" element={<Experience />} />
					<Route path="goals" element={<Goals />} />
					<Route path="schedule" element={<Schedule />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
