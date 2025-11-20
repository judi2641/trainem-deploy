import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Trainingsplan from "./pages/Trainingsplan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/trainingsplan" element={<Trainingsplan />} />
      </Routes>
    </Router>
  );
}

export default App;
