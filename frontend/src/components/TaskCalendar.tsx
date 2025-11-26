import { format, startOfToday, isSameDay, endOfWeek, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import type { ITask } from '../../../shared/types/database/traininsplan/Task';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DIFFICULTY, type TaskDifficulty } from '../../../shared/types/other/TaskDifficulty';
import { useEffect, useState, type FormEvent } from 'react';
import type { ITrainingsPlan } from '../../../shared/types/database/traininsplan/TrainingPlan';
import { useAuth0 } from '@auth0/auth0-react';
import type { TrainingDays } from '../../../shared/types/other/TrainingDays';
import { toast } from 'sonner';
interface TaskCalendarProps {
	weekStart: Date;
	tasks: (ITask & { completed: boolean })[];
	onTaskCreated: () => void;
}
export function TaskCalendar({ weekStart, tasks, onTaskCreated }: TaskCalendarProps) {
	const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
	const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
	const [taskDay, setTaskDay] = useState<TrainingDays>();
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDesc, setTaskDesc] = useState('');
	const [taskDiff, setTaskDiff] = useState('');
	const [taskTrainingsplanID, setTaskTrainingsplanID] = useState('');
	const [trainingsplaene, setTrainingsplaene] = useState<ITrainingsPlan[] | null>(null);

	const difficultyColors: Record<TaskDifficulty, string> = {
		easy: 'bg-green-200',
		middle: 'bg-orange-200',
		hard: 'bg-red-200',
	};
	const { user } = useAuth0();
	useEffect(() => {
		async function loadTrainingsplan() {
			try {
				if (user?.sub) {
					const res = await fetch(
						`http://localhost:3000/api/trainingsplan/${encodeURIComponent(user.sub)}`,
					);
					const trainingsplanResponse = await res.json();
					setTrainingsplaene(trainingsplanResponse);
				}
			} catch (error) {
				console.log(error);
			}
		}

		loadTrainingsplan();
	}, []);
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
					if (typeof onTaskCreated === 'function') onTaskCreated();
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
		<div className="space-y-4">
			<div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{format(weekStart, 'EEE, dd.MM', { locale: de })} –{' '}
				{format(weekEnd, 'EEE, dd.MM', { locale: de })}
			</div>

			<div className="space-y-6">
				{days.map((day) => {
					const dayTasks = tasks.filter((task) => {
						const dayShort = format(day, 'eee');

						return task.day === dayShort;
					});
					const isToday = isSameDay(day, startOfToday());

					return (
						<div
							className={cn('border-l-4 pl-4', isToday ? 'border-l-primary' : 'border-l-border')}
						>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<h3
										className={cn(
											'text-sm font-semibold',
											isToday ? 'text-primary' : 'text-foreground',
										)}
									>
										{format(day, 'EEEE', { locale: de })}
									</h3>
									<span className="text-xs text-muted-foreground">
										{format(day, 'dd MMM', { locale: de })}
									</span>
									{isToday && <Badge className="bg-primary text-primary-foreground">Today</Badge>}
								</div>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											size="sm"
											variant="ghost"
											className="text-primary hover:bg-primary/10"
											onClick={() => setTaskDay(format(new Date(day), 'EEE') as TrainingDays)}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
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
																		className={cn('mb-0.5')}
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
																	<SelectItem
																		className={cn('mb-0.5', difficultyColors[difficulty])}
																		key={difficulty}
																		value={difficulty}
																	>
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

							{dayTasks.length === 0 ? (
								<p className="text-xs text-muted-foreground italic py-2">No tasks</p>
							) : (
								<ul className="space-y-2">
									{dayTasks.map((task) => (
										<li
											key={task._id?.toString()}
											className={cn(
												'flex items-start gap-3 p-3 rounded-lg border transition-all',
												task.completed
													? 'bg-green-300/30 border-border shadow-sm'
													: 'bg-primary/30 border-border shadow-sm',
											)}
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<Checkbox
													checked={task.completed}
													onCheckedChange={() => (task.completed = true)}
												/>
												<div className={cn('h-2 w-2 rounded-full shrink-0 mt-1.5', 'bg-primary')} />
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 flex-wrap">
														<span
															className={cn(
																'text-sm font-medium',
																task.completed && 'line-through text-muted-foreground',
															)}
														>
															{task.title}
														</span>
													</div>
													{task.description && (
														<p className="text-xs text-muted-foreground mt-1">{task.description}</p>
													)}
												</div>

												<div>
													<Select name="difficulty">
														<SelectTrigger>
															<SelectValue
																defaultValue={task.difficulty}
																placeholder={task.difficulty}
															/>
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																{Object.values(DIFFICULTY).map((difficulty) => (
																	<SelectItem
																		className={cn('mb-0.5', difficultyColors[difficulty])}
																		key={difficulty}
																		value={difficulty}
																	>
																		{difficulty}
																	</SelectItem>
																))}
															</SelectGroup>
														</SelectContent>
													</Select>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
