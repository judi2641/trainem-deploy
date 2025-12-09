import { useEffect, useState } from 'react';
import { format, startOfToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { TaskCalendar } from '@/components/TaskCalendar';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ITask } from '../../../shared/types/database/traininsplan/Task';
import type { ICompletedTask } from '../../../shared/types/database/CompletedTask';
import type { ITrainingsplan } from '../../../shared/types/database/traininsplan/TrainingPlan';

import { useAuth0 } from '@auth0/auth0-react';

export default function TasksArea() {
	const [reloadTasksFlag, setReloadTasksFlag] = useState(false);
	//taskList sind die gesammten tasks aller trainingspläne eines users
	const [taskList, setTaskList] = useState<(ITask & { planName: string })[]>([]);

	//completedTasks bestehen aus den abgeschlossenen tasks die zu dieser woche passen
	const [completedTasks, setCompletedTasks] = useState<ICompletedTask[]>([]);
	//state um alles neu zu berechnen wenn man die wochenanzeige wechselt
	const [currentDate, setCurrentDate] = useState(startOfToday());
	const { user } = useAuth0();
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
	const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

	useEffect(() => {
		//hier werden alle trainingspläne geladen und daraus die tasks gezogen und in eine liste zusammengeführt
		async function loadTrainingsplan() {
			try {
				if (user?.sub) {
					const res = await fetch(
						`http://localhost:3000/api/trainingsplan/${encodeURIComponent(user.sub)}`,
					);
					if (!res.ok) {
						setTaskList([]);
						return;
					}
					const trainingsplanResponse = await res.json();

					if (!trainingsplanResponse || !Array.isArray(trainingsplanResponse)) {
						setTaskList([]);
						return;
					}

					setTaskList(
						trainingsplanResponse.flatMap((tp: ITrainingsplan) =>
							(tp.tasks || []).map((task) => ({
								...task,
								planName: tp.name,
							})),
						),
					);
				}
			} catch (error) {
				console.log(error);
				setTaskList([]);
			}
		}

		async function loadCompletedTasks() {
			try {
				const res = await fetch('endpoint completed tasks');
				if (!res.ok) {
					setCompletedTasks([]);
					return;
				}
				const data = await res.json();
				const completedTasksThisWeek: ICompletedTask[] = (data || []).filter(
					(task: ICompletedTask) => {
						const doneDate = new Date(task.doneAt);
						return doneDate >= weekStart && doneDate <= weekEnd;
					},
				);
				setCompletedTasks(completedTasksThisWeek);
			} catch (error) {
				console.log(error);
				setCompletedTasks([]);
			}
		}

		loadTrainingsplan();
		loadCompletedTasks();
	}, [reloadTasksFlag, user?.sub]);

	const triggerReload = () => setReloadTasksFlag((f) => !f);

	const tasks: (ITask & { planName: string } & { completed: boolean })[] = taskList.map((task) => ({
		...task,
		completed: !!completedTasks.some((ct) => ct.taskID.toString() === task._id!.toString()),
	}));

	const completedStat: number = tasks.filter((task) => task.completed === true).length;
	const totalStat: number = tasks.length;
	const pending: number = totalStat - completedStat;

	const handlePrevWeek = () => setCurrentDate((prev) => addDays(prev, -7));
	const handleNextWeek = () => setCurrentDate((prev) => addDays(prev, 7));
	const handleToday = () => setCurrentDate(startOfToday());
	return (
		<div className="h-full w-full bg-white shadow-md rounded-xl min-h-0 overflow-y-auto ">
			<div className="top-0 grid grid-cols-3 p-6 z-20 rounded-xl pl-5 gap-4 sticky shadow-md bg-white backdrop-blur-3xl">
				<Card className="p-5 border border-border bg-card shadow-sm ">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Total Tasks
							</p>
							<p className="text-3xl font-bold text-foreground mt-2">{totalStat}</p>
						</div>
						<Circle className="h-10 w-10 text-primary/70 shrink-0" />
					</div>
				</Card>
				<Card className="p-5 border border-border bg-card shadow-sm ">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Completed
							</p>
							<p className="text-3xl font-bold text-foreground mt-2">{completedStat}</p>
						</div>
						<CheckCircle2 className="h-10 w-10 text-green-300/70 shrink-0" />
					</div>
				</Card>
				<Card className="p-5 border border-border bg-card shadow-sm ">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Pending
							</p>
							<p className="text-3xl font-bold text-foreground mt-2">{pending}</p>
						</div>
						<Circle className="h-10 w-10 text-orange-300/70 shrink-0" />
					</div>
				</Card>
			</div>

			<div className="p-6 pt-3 pb-0 ">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{format(currentDate, 'MMMM yyyy', { locale: de })}
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
			<div className="p-6">
				<TaskCalendar weekStart={weekStart} tasks={tasks} onTaskCreated={triggerReload} />
			</div>
		</div>
	);
}
