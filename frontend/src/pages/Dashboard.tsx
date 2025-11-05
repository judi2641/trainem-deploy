// src/pages/Dashboard.tsx
import Sidebar from '../components/Sidebar';
//import Header from '../components/Header'; // (Wird noch erstellt)
//import DashboardArea from '../components/DashboardArea'; // (Wird noch erstellt)

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> 

      <div className="flex-1 flex flex-col">
        {/* <Header />  */} 
        <main className="flex-1 p-8">
          {/* <DashboardArea /> */}
          
        </main>
      </div>
    </div>
  );
}