import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import DashboardArea from '../components/DashboardArea'; 
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export default function Dashboard() {

  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    console.log(user);

    const createUserInBackend = async () => {
      if(!user || !isAuthenticated) return;
      
      try {
        const token = await getAccessTokenSilently();
        
        await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });
      } catch (err) {
        console.error("Fehler beim Erstellen des Users:", err);
      } 
    }
    createUserInBackend();
  }, [user, isAuthenticated]);
    
    

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> 

      <div className="flex-1 flex flex-col">
         <Header /> 
        <main className="flex-1 pt-0 pl-0 p-5">
        <DashboardArea /> 
        </main>
      </div>
    </div>
  );
}