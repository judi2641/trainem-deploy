import { format, startOfToday, isSameDay, endOfWeek, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CheckCircle2, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Progress } from './ui/progress';
import { useMyContext } from '@/context/AppContext';
import { getLevelFromScore } from '@/util/level';
import { useAuth0 } from '@auth0/auth0-react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface EntryCalendarProps {
	weekStart: Date;
	onEntryUpdated: () => void;
}

function isoDateOnly(d: Date) {
	return d.toISOString().slice(0, 10);
}

export function EntryCalendar({ weekStart, onEntryUpdated }: EntryCalendarProps) {
	const { myUser, workouts, entries, setEntries, setMyUser } = useMyContext();
	const { getAccessTokenSilently } = useAuth0();
	const auth0Id = myUser?.auth0Id;

	const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
	const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

	const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
	const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

	const isFutureWeek = weekStart > startOfToday();

	async function onExerciseChecked(entryId: string, exercise: any, weight?: number) {
		try {
			console.log(entryId);
			console.log(exercise);
			const token = await getAccessTokenSilently();
			const res = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/entries/${entryId}/complete-exercise`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({
						exerciseName: exercise.exercise.name,
						weight,
					}),
				},
			);

			if (res.ok) {
				const updatedEntry = await res.json();

				setEntries((prev: any) => prev.map((e: any) => (e._id === entryId ? updatedEntry : e)));
				setMyUser((prev: any) => {
					if (!prev) return prev;
					const nextScore = (prev.points ?? prev.score ?? 0) + 67;
					return { ...prev, points: nextScore, score: nextScore };
				});

				toast.custom(
					() => (
						<div className="bg-white border rounded-lg shadow-lg p-4 flex flex-col gap-2 w-90">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-green-500" />
								<span className="font-medium">Exercise completed!</span>
							</div>
							<div className="flex flex-col gap-1">
								{(() => {
									const totalScore = myUser?.points ?? myUser?.score ?? 0;
									const { level, currentXp, nextLevelXp } = getLevelFromScore(totalScore);

									return (
										<>
											<span className="text-sm text-muted-foreground">Level {level}</span>
											<Progress value={(currentXp / nextLevelXp) * 100} className="h-2" />
										</>
									);
								})()}
							</div>
						</div>
					),
					{ duration: 4000 },
				);

				confetti({
					particleCount: 150,
					spread: 180,
					origin: { y: 1 },
				});

				onEntryUpdated();
			} else {
				toast.error('Exercise could not be completed');
			}
		} catch (error) {
			console.error('Network error:', error);
			toast.error('Network error');
		}
	}

	async function scheduleWorkout() {
		if (!auth0Id || !selectedWorkoutId || !scheduleDate) return;

		try {
			const token = await getAccessTokenSilently();
			const res = await fetch('https://trainem-deploy-production.up.railway.app/api/entries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({
					auth0Id,
					workoutId: selectedWorkoutId,
					date: scheduleDate.toISOString(),
				}),
			});

			if (res.ok) {
				const newEntry = await res.json();
				setEntries([...entries, newEntry]);
				setSelectedWorkoutId('');
				setScheduleDate(null);
				toast.success('Workout scheduled');
				onEntryUpdated();
			} else {
				toast.error('Workout could not be scheduled');
			}
		} catch (error) {
			console.error('Network error:', error);
			toast.error('Network error');
		}
	}

	return (
		<div className="space-y-4">
			<div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{format(weekStart, 'EEE, dd.MM', { locale: de })} –{' '}
				{format(weekEnd, 'EEE, dd.MM', { locale: de })}
			</div>

			<div className="space-y-6">
				{days.map((day) => {
					const dayEntries = entries.filter((entry: any) => isSameDay(new Date(entry.date), day));
					const isToday = isSameDay(day, startOfToday());

					return (
						<div
							key={day.toISOString()}
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
											onClick={() => setScheduleDate(day)}
										>
											<Plus className="h-4 w-4" />
											Schedule Workout
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-96"
										side="bottom"
										align="start"
										sideOffset={8}
										alignOffset={0}
									>
										<div className="grid gap-4">
											<div className="grid gap-3">
												<Label>Workout</Label>
												<Select value={selectedWorkoutId} onValueChange={setSelectedWorkoutId}>
													<SelectTrigger>
														<SelectValue placeholder="Select a workout" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{workouts.map((workout: any) => (
																<SelectItem key={workout._id} value={workout._id}>
																	{workout.name}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											</div>
											<div className="grid gap-3">
												<Label>Date</Label>
												<Input
													type="date"
													value={scheduleDate ? isoDateOnly(scheduleDate) : ''}
													onChange={(e) => setScheduleDate(new Date(e.target.value))}
												/>
											</div>
										</div>
										<div className="flex justify-end gap-2 mt-3">
											<Button onClick={scheduleWorkout} size="sm" disabled={!selectedWorkoutId}>
												Schedule
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							</div>

							{dayEntries.length === 0 ? (
								<p className="text-xs text-muted-foreground italic py-2">No workouts scheduled</p>
							) : (
								<ul className="space-y-3">
									{dayEntries.map((entry: any) => {
										const workout = workouts.find((w: any) => w._id === entry.workoutId);
										const isCompleted = entry.completed;

										return (
											<li
												key={entry._id}
												className={cn(
													'p-3 rounded-lg border transition-all',
													isCompleted && 'bg-green-300/30 border-border shadow-sm',
													!isCompleted && 'bg-white/70 border-border shadow-sm',
												)}
											>
												<div className="font-medium text-sm mb-2">
													{workout?.name || 'Unknown Workout'}
												</div>
												<div className="space-y-2">
													{entry.plannedExercises?.map((ex: any, idx: any) => {
														const isExerciseCompleted = entry.completed_exercises?.some(
															(completed: any) => completed.exercise.name === ex.exercise.name,
														);

														return (
															<div key={idx} className="flex items-center gap-3">
																<Checkbox
																	checked={isExerciseCompleted}
																	onCheckedChange={() => onExerciseChecked(entry._id!, ex)} // ex statt idx
																	disabled={
																		isExerciseCompleted || isFutureWeek || day < startOfToday()
																	}
																/>
																<span
																	className={cn(
																		'text-sm',
																		isExerciseCompleted && 'line-through text-muted-foreground',
																	)}
																>
																	{ex.exercise.name}
																	{ex.sets && ex.reps ? ` - ${ex.sets}x${ex.reps}` : ''}
																	{ex.duration ? ` - ${ex.duration}s` : ''}
																</span>
															</div>
														);
													})}
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
