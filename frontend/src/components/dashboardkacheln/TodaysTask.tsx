import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import type { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAuth0 } from '@auth0/auth0-react';
import type { IUser } from '../../../../shared/types/database/user/User';
import { CheckCircle2, Plus } from 'lucide-react';
import { Progress } from '../ui/progress';
import confetti from 'canvas-confetti';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, startOfToday } from 'date-fns';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { useState, type FormEvent } from 'react';
import type { TrainingDays } from '../../../../shared/types/other/TrainingDays';
import type { ITrainingsplan } from '../../../../shared/types/database/traininsplan/TrainingPlan';
import { DIFFICULTY } from '../../../../shared/types/other/TaskDifficulty';

interface TodayTaskProps {
	tasks: (ITask & { planName: string })[];
	onTaskCompleted: () => void;
	onUserUpdate: () => Promise<IUser | undefined>;
	trainemUser: IUser | undefined;
	trainingsplaene: ITrainingsplan[];
}

export default function TodaysTask({
	tasks,
	onTaskCompleted,
	onUserUpdate,
	trainingsplaene,
}: TodayTaskProps) {
	const [taskDay, setTaskDay] = useState<TrainingDays>();
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDesc, setTaskDesc] = useState('');
	const [taskDiff, setTaskDiff] = useState('');
	const [taskTrainingsplanID, setTaskTrainingsplanID] = useState('');

	const navigate = useNavigate();
	const { user } = useAuth0();
	async function onChecked(taskId: string) {
		try {
			if (user?.sub) {
				const response = await fetch(
					`http://localhost:3000/api/completedTasks/${encodeURIComponent(user.sub)}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: taskId }),
					},
				);
				if (response.ok) {
					const updatedUser = await onUserUpdate();
					toast.custom(
						() => (
							<div className="bg-white border rounded-lg shadow-lg p-4 flex flex-col gap-2 w-90">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-500" />
									<span className="font-medium">Task completed!</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm text-muted-foreground">
										Level {Math.floor((updatedUser?.score ?? 0) / 100) + 1}
									</span>
									<Progress value={(updatedUser?.score ?? 0) % 100} className="h-3" />
								</div>
							</div>
						),
						{
							duration: 4000,
						},
					);
					confetti({
						particleCount: 150,
						spread: 180,
						origin: { y: 1 },
					});
					onTaskCompleted();
				} else {
					toast.error('Task has not been completed');
				}
			}
		} catch (error) {
			console.error('Netzwerkfehler:', error);
		}
	}
	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const task: Partial<ITask> = {
			title: taskTitle,
			description: taskDesc,
			day: taskDay,
			difficulty: taskDiff,
		};

		if (user?.sub) {
			try {
				const response = await fetch(
					`http://localhost:3000/api/trainingsplan/tasks/${encodeURIComponent(user.sub)}/${encodeURIComponent(taskTrainingsplanID)}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(task),
					},
				);

				if (response.ok) {
					console.log('Task erfolgreich erstellt!');
					setTaskDesc('');
					setTaskTitle('');
					setTaskDiff('');

					setTaskTrainingsplanID('');
					onTaskCompleted();
					toast.success('Task has been created');
				} else {
					toast.error('Task has not been created');
				}
			} catch (error) {
				console.error('Netzwerkfehler:', error);
			}
		}
	};
	return (
		<Card className=" overflow-auto max-h-full">
			<CardHeader className="p-3 sticky top-0 bg-white shadow-md rounded-xl">
				<div className="flex items-center justify-between">
					<CardTitle>Todays tasks</CardTitle>
					<Button
						className="text-primary hover:bg-primary/10"
						variant="ghost"
						size="sm"
						onClick={() => navigate('/tasks')}
					>
						View All Tasks
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{tasks.length === 0 ? (
					<div className="flex flex-col items-center justify-center mt-6 space-y-4">
						<p className="text-muted-foreground text-center">No scheduled tasks today</p>
					</div>
				) : (
					tasks.map((task) => (
						<div
							key={task._id}
							className="flex items-center mt-5 space-x-3 p-3 hover:bg-gray-50 rounded-lg"
						>
							<Checkbox id={task._id} onCheckedChange={() => onChecked(task._id!)} />
							<label htmlFor={task._id} className="flex-1 cursor-pointer">
								<p className="font-medium">{task.title}</p>
								<p className="text-sm text-gray-600">{task.description}</p>
							</label>
						</div>
					))
				)}
				<div className="flex items-center justify-center mt-3">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								className="text-primary hover:bg-primary/10"
								onClick={() => setTaskDay(format(startOfToday(), 'EEE') as TrainingDays)}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add task for today
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-96"
							side="bottom"
							align="start"
							sideOffset={8}
							alignOffset={0}
						>
							<form onSubmit={handleSubmit}>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label>Task name</Label>
										<Input
											id="taskName"
											name="taskName"
											onChange={(e) => setTaskTitle(e.target.value)}
										/>
									</div>
									<div className="grid gap-3">
										<Label>Task Description</Label>
										<Input
											id="taskDescription"
											name="taskDescription"
											onChange={(e) => setTaskDesc(e.target.value)}
										/>
									</div>
									<div className="grid gap-3">
										<Label>Trainingsplan</Label>
										<Select
											name="trainingsplanName"
											value={taskTrainingsplanID}
											onValueChange={setTaskTrainingsplanID}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a trainingsplan" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{trainingsplaene?.map((trainingsplan) => (
														<SelectItem
															className={'mb-0.5'}
															key={trainingsplan._id?.toString()}
															value={trainingsplan._id?.toString() || ''}
														>
															{trainingsplan.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>

									<div className="grid gap-3">
										<Label>Difficulty</Label>
										<Select name="difficulty" value={taskDiff} onValueChange={setTaskDiff}>
											<SelectTrigger>
												<SelectValue placeholder="Select a difficulty" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{Object.values(DIFFICULTY).map((difficulty) => (
														<SelectItem className="mb-0.5" key={difficulty} value={difficulty}>
															{difficulty}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex justify-end gap-2 mt-3">
									<Button type="submit" size="sm">
										Save task
									</Button>
								</div>
							</form>
						</PopoverContent>
					</Popover>
				</div>
			</CardContent>
		</Card>
	);
}
