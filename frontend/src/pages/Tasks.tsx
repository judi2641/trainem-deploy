
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import TasksArea from '../components/TasksArea';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> 

      <div className="flex-1 flex flex-col">
         <Header /> 
        <main className="flex-1 pt-0 pl-0 p-5">
        <TasksArea /> 
          
        </main>
      </div>
    </div>
  );
}