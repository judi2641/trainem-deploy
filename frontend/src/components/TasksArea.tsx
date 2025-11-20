<<<<<<< HEAD
import { useState, type ChangeEvent} from 'react'; 
import {type TaskToCreate} from '../../../shared/types/Task'
import { useAuth0 } from '@auth0/auth0-react';

const WEEKDAY_OPTIONS = [
    { value: "Monday",    label: "Montag" },
    { value: "Tuesday",   label: "Dienstag" },
    { value: "Wednesday", label: "Mittwoch" },
    { value: "Thursday",  label: "Donnerstag" },
    { value: "Friday",    label: "Freitag" },
    { value: "Saturday",  label: "Samstag" },
    { value: "Sunday",    label: "Sonntag" }
];
type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export default function TasksArea(){
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    
    const [user_id, setUserID] = useState("");
    const [day, setDay] = useState<Weekday | "">("");
    const [name, setName] = useState("");
    
    const { getAccessTokenSilently } = useAuth0();
    
=======
import { useEffect, useState } from 'react'
import { format, startOfToday, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { de } from 'date-fns/locale'
import { TaskCalendar } from '@/components/TaskCalendar'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {  ITrainingsplan,ICompletedTask } from "../../../shared/types/Training"

>>>>>>> origin/frontend


<<<<<<< HEAD
        try {
            
            const token = await getAccessTokenSilently();

            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task), 
            });
=======

export default function TasksArea() {
  const [trainingsplan, setTrainingsplan] = useState<ITrainingsplan | null>(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(startOfToday());
>>>>>>> origin/frontend

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  useEffect(() => {
    async function loadTrainingsplan() {
      const res = await fetch("endpoint trainingsplan");
      setTrainingsplan(await res.json());
    }
    async function loadCompletedTasks() {
      const res = await fetch("endpoint completed tasks");
      const data = await res.json()
      const completedTasksThisWeek = data.filter((task: ICompletedTask) => {
        const doneDate = new Date(task.doneAt);
        return doneDate >= weekStart && doneDate <= weekEnd;
});
      setCompletedTasks(completedTasksThisWeek);
    }
    loadTrainingsplan();
    loadCompletedTasks();
  }, [weekEnd, weekStart]);

  const tasks = trainingsplan
    ? trainingsplan.tasks.map(task => ({
        ...task,
        completed: completedTasks.some(ct => ct.taskID.toString() === task._id.toString())
      }))
    : [];
  const completedStat: number = tasks.filter(task => task.completed === true).length;
  const totalStat: number = tasks.length;
  const pending: number = totalStat - completedStat;

  

  
  
  const handlePrevWeek = () => setCurrentDate((prev) => addDays(prev, -7))
  const handleNextWeek = () => setCurrentDate((prev) => addDays(prev, 7))
  const handleToday = () => setCurrentDate(startOfToday())

  return(
    <div className="h-full w-full bg-white shadow-md rounded-xl min-h-0 overflow-y-auto ">
 
        <div className="top-0 grid grid-cols-3 p-6 z-20 rounded-xl pl-5 gap-4 sticky inset-0 bg-white backdrop-blur-3xl">
          
          <Card className="p-5 border border-border bg-card shadow-sm ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalStat}</p>
              </div>
              <Circle className="h-10 w-10 text-primary/70 shrink-0" />
            </div>
          </Card>
          <Card className="p-5 border border-border bg-card shadow-sm ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-foreground mt-2">{completedStat}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-300/70 shrink-0" />
            </div>
          </Card>
          <Card className="p-5 border border-border bg-card shadow-sm ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-foreground mt-2">{pending}</p>
              </div>
              <Circle className="h-10 w-10 text-orange-300/70 shrink-0" />
            </div>
          </Card>
        </div>

        <div className="p-6 pt-0 pb-0 ">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {format(currentDate, "MMMM yyyy", { locale: de })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className='p-6'>
          <TaskCalendar weekStart={weekStart} tasks={tasks}  />
        </div>
        
      </div>
    
    
  );
}