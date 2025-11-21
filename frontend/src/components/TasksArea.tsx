import { useEffect, useState } from 'react'
import { format, startOfToday, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { de } from 'date-fns/locale'
import { TaskCalendar } from '@/components/TaskCalendar'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ITrainingsPlan } from "../../../shared/types/database/traininsplan/TrainingPlan";
import type { ICompletedTask } from "../../../shared/types/database/CompletedTask";




export default function TasksArea() {
  const [trainingsplan, setTrainingsplan] = useState<ITrainingsPlan[] | null>(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(startOfToday());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  useEffect(() => {
    async function loadTrainingsplan() {
      const res = await fetch("http://localhost:3000/api/trainingsplan/juliusdittrich22@gmail.com");
      const trainingsplan = await res.json();
      setTrainingsplan(trainingsplan);
      console.log(trainingsplan);
      

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
    //loadCompletedTasks();
  }, []);

  /**const tasks = trainingsplan
    ? trainingsplan.tasks.map(task => ({
        ...task,
        completed: true   completedTasks.some(ct => ct.taskID.toString() === task._id?.toString())
      }))
    : [];*/
  //   const tasks = trainingsplan?.tasks;
  // const completedStat: number = tasks.filter(task => task.completed === true).length;
  // const totalStat: number = tasks.length;
  // const pending: number = totalStat - completedStat;

  

  
  
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
                <p className="text-3xl font-bold text-foreground mt-2">{0}</p>
              </div>
              <Circle className="h-10 w-10 text-primary/70 shrink-0" />
            </div>
          </Card>
          <Card className="p-5 border border-border bg-card shadow-sm ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-foreground mt-2">{0}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-300/70 shrink-0" />
            </div>
          </Card>
          <Card className="p-5 border border-border bg-card shadow-sm ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-foreground mt-2">{0}</p>
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
          <TaskCalendar weekStart={weekStart} tasks={trainingsplan?.at(0)?.tasks}  />
        </div>
        
      </div>
    
    
  );
}
