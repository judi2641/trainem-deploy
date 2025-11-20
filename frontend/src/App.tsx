import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const  { isAuthenticated, isLoading } = useAuth0();

  if(!isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />        
      </Routes>
    </Router>
  );
}

export default App;
