import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { type IUser } from '../../../shared/types/database/user/User';
import Avatar from './dashboardkacheln/Avatar';
import TodaysTask from './dashboardkacheln/TodaysTask';
import CompletedTasksChart from './dashboardkacheln/CompletedTasksChart';
import type { ITask } from '../../../shared/types/database/traininsplan/Task';
import type { ITrainingsplan } from '../../../shared/types/database/traininsplan/TrainingPlan';
import { format, startOfToday } from 'date-fns';
export default function DashboardArea() {
	const { user } = useAuth0();
	const [trainemUser, setTrainemUser] = useState<IUser>();
	const [taskList, setTaskList] = useState<(ITask & { planName: string })[] | null>(null);
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
	}, [user?.sub]);
	const currentDay = format(startOfToday(), 'eee');

	const todaysTasks = taskList ? taskList.filter((task) => task.day === currentDay) : [];
	return (
		<div className="w-full h-full bg-white shadow-md p-6 rounded-xl grid grid-cols-12 gap-4">
			<div className="col-span-4 row-span-3 max-h-screen">
				<Avatar user={trainemUser}></Avatar>
			</div>
			<div className="col-span-4 max-h-2/3">
				<TodaysTask tasks={todaysTasks}></TodaysTask>
			</div>
			<div className="col-span-4 h-2/3 ">
				<CompletedTasksChart></CompletedTasksChart>
			</div>
		</div>
	);
}
