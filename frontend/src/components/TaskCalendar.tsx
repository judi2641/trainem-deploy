import { format, startOfToday, isSameDay, endOfWeek, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import type { ITask } from '../../../shared/types/database/traininsplan/Task';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
import { useEffect, useState } from 'react';
import type { ITrainingsPlan } from '../../../shared/types/database/traininsplan/TrainingPlan';
import { useAuth0 } from '@auth0/auth0-react';
interface TaskCalendarProps {
	weekStart: Date;
	tasks: (ITask & { completed: boolean })[];
}
export function TaskCalendar({ weekStart, tasks }: TaskCalendarProps) {
	const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
	const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
	const [trainingsplaene, setTrainingsplaene] = useState<ITrainingsPlan[] | null>(null);
	const difficultyColors: Record<TaskDifficulty, string> = {
		easy: 'bg-green-200',
		middle: 'bg-orange-200',
		hard: 'bg-red-200',
	};
	const { user } = useAuth0();
	useEffect(() => {
		//hier werden alle trainingspläne geladen und daraus die tasks gezogen und in eine liste zusammengeführt
		async function loadTrainingsplan() {
			try {
				const res = await fetch(`http://localhost:3000/api/trainingsplan/${user?.email}`);
				const trainingsplanResponse = await res.json();
				setTrainingsplaene(trainingsplanResponse);
			} catch (error) {
				console.log(error);
			}
		}

		loadTrainingsplan();
	}, []);
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
								<Dialog>
									<form>
										<DialogTrigger asChild>
											<Button
												size="sm"
												variant="ghost"
												className="text-primary hover:bg-primary/10"
											>
												<Plus className="h-4 w-4 mr-1" />
												Add
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Add new task</DialogTitle>
											</DialogHeader>
											<div className="grid gap-4">
												<div className="grid gap-3">
													<Label>Task name</Label>
													<Input id="taskName" name="task name" defaultValue="" />
												</div>
												<div className="grid gap-3">
													<Label>Task Description</Label>
													<Input id="taskDescription" name="taskDescription" defaultValue="" />
												</div>
												<div className="grid gap-3">
													<Label>Trainingsplan</Label>
													<Select>
														<SelectTrigger>
															<SelectValue placeholder="Select a trainingsplan" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																{trainingsplaene?.map((trainingsplan) => (
																	<SelectItem
																		className={cn('mb-0.5')}
																		key={trainingsplan.name}
																		value={trainingsplan.name}
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
													<Select>
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
											<DialogFooter>
												<DialogClose asChild>
													<Button variant="outline">Cancel</Button>
												</DialogClose>
												<Button type="submit">Save changes</Button>
											</DialogFooter>
										</DialogContent>
									</form>
								</Dialog>
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
