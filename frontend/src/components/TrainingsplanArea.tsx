import { useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ITask } from "../../../shared/types/database/traininsplan/Task";


import { cn } from "@/lib/utils";

const WEEKDAY_OPTIONS = [
  { value: "Monday", label: "Montag" },
  { value: "Tuesday", label: "Dienstag" },
  { value: "Wednesday", label: "Mittwoch" },
  { value: "Thursday", label: "Donnerstag" },
  { value: "Friday", label: "Freitag" },
  { value: "Saturday", label: "Samstag" },
  { value: "Sunday", label: "Sonntag" },
];

export default function TrainigsplanArea() {
  const {user} = useAuth0();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [activeTab, setActiveTab] = useState("Monday");
  const email = user?.email;
  //trainigsplan aus datenbank holen
  const fetchTrainingsPlan = async () => {
    if (email){
      const res = await fetch(`/api/tasks/${encodeURIComponent(email)}`);
      setTasks( await res.json()); 
    }
    
    
  }
  useEffect(() => {
    fetchTrainingsPlan();
  }, []);
  const visible = tasks.filter(t => t.day === activeTab);  

  return (
    <div className="h-full w-full bg-white shadow-md p-6 rounded-xl  ">
      
        <div className="w-full">
          <div className="">
            <nav className="flex gap-2" aria-label="Weekday navigation">
              {WEEKDAY_OPTIONS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setActiveTab(day.value)}
                  className={cn(
                    "flex-auto m-2 rounded-xl py-2 text-sm font-medium transition-colors border-2 -mb-px",
                    activeTab === day.value
                      ? "border-primary text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary shadow-sm"
                  )}
                  aria-current={activeTab === day.value ? "page" : undefined}>
                  {day.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {WEEKDAY_OPTIONS.map((day) => (
              <div
                key={day.value}
                className={cn(activeTab === day.value ? "block" : "hidden")}>
                <h2 className="text-2xl font-semibold mb-4">{day.label}</h2>
                {visible.map((task) => (
                  <div key={task.day}
                  className="bg-primary/50 w-full h-15 rounded-xl flex items-center justify-between p-6">
                     <span>{task.description}</span>
                  </div>
                  
                )
                )}
                
              </div>
            ))}
          </div>
        </div>
         
      
    </div>
  );
}
