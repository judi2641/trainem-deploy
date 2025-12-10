import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { type IUser } from '../../../shared/types/database/user/User';
import Avatar from './dashboardkacheln/Avatar';
import TodaysTask from './dashboardkacheln/TodaysTask';
import CompletedTasksChart from './dashboardkacheln/CompletedTasksChart';
import type { ITask } from '../../../shared/types/database/traininsplan/Task';
import type { ITrainingsplan } from '../../../shared/types/database/traininsplan/TrainingPlan';
import { format, startOfToday, isSameDay } from 'date-fns';
import type { ICompletedTask } from '../../../shared/types/database/CompletedTask';
export default function DashboardArea() {
	const { user } = useAuth0();
	const [trainemUser, setTrainemUser] = useState<IUser>();
	const [taskList, setTaskList] = useState<(ITask & { planName: string })[]>([]);
	const [completedTasks, setCompletedTasks] = useState<ICompletedTask[]>([]);
	async function loadCompletedTasks() {
		if (user?.sub) {
			try {
				const res = await fetch(
					`http://localhost:3000/api/completedTasks/${encodeURIComponent(user.sub)}`,
				);
				if (!res.ok) {
					setCompletedTasks([]);
					return;
				}
				const data = await res.json();
				const completedTasksToday = (data || []).filter((task) => {
					const doneDate = new Date(task.doneAt);
					return isSameDay(doneDate, startOfToday());
				});
				console.log(completedTasksToday);
				setCompletedTasks(completedTasksToday);
			} catch (error) {
				console.log(error);
				setCompletedTasks([]);
			}
		}
	}
	useEffect(() => {
		async function loadUser() {
			try {
				if (user?.sub) {
					const res = await fetch(`http://localhost:3000/api/user/${encodeURIComponent(user.sub)}`);
					console.log(res);
					if (!res.ok) {
						console.log('user nicht gefunden');
						throw new Error('Fehler beim Laden des Users');
					}
					const userResponse = await res.json();
					setTrainemUser(userResponse);
				}
			} catch (error) {
				console.log(error);
			}
		}
		async function loadTrainingsplan() {
			try {
				if (user?.sub) {
					const res = await fetch(
						`http://localhost:3000/api/trainingsplan/${encodeURIComponent(user.sub)}`,
					);
					const trainingsplanResponse = await res.json();
					console.log(trainingsplanResponse);
					setTaskList(
						trainingsplanResponse.flatMap((tp: ITrainingsplan) =>
							tp.tasks.map((task) => ({
								...task,
								planName: tp.name,
							})),
						),
					);
				}
			} catch (error) {
				console.log(error);
			}
		}

		loadUser();
		loadTrainingsplan();
		loadCompletedTasks();
	}, [user?.sub]);
	const currentDay = format(startOfToday(), 'eee');

	const todaysTasks = taskList
		.filter((task) => task.day === currentDay)
		.filter((task) => !completedTasks.some((ct) => ct.taskID?.toString() === task._id?.toString()));
	return (
		<div className="h-full w-full  bg-white shadow-md p-6 rounded-xl overflow-hidden flex flex-col">
			{/* Begrüßung AUSSERHALB des Grids */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Welcome, {trainemUser?.firstName || user?.name}!</h1>
				<p className="text-muted-foreground mt-1">Here's your overview for today</p>
			</div>

			{/* Grid für die Kacheln */}
			<div className="flex-1 grid grid-cols-12 gap-4 grid-rows-[1fr_1fr_1fr] overflow-hidden">
				<div className="col-span-4 row-span-3">
					<Avatar user={trainemUser} />
				</div>
				<div className="col-span-4 row-span-2 min-h-0">
					<TodaysTask
						tasks={todaysTasks}
						onTaskCompleted={loadCompletedTasks}
						trainemUser={trainemUser}
					/>
				</div>
				<div className="col-span-4 row-span-2">
					<CompletedTasksChart />
				</div>
			</div>
		</div>
	);
}
