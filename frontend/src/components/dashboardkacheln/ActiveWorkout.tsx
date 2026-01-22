'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import ExerciseDetailDialog from '@/components/ExcersiseDetailDialog';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Plus, Dumbbell, Timer, X, ChevronRight } from 'lucide-react';
import { useMyContext } from '@/context/AppContext';

// Pixel celebration component
function PixelCelebration({ show, onComplete }: { show: boolean; onComplete: () => void }) {
	if (!show) return null;

	return (
		<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
			<div className="relative">
				{/* Pixel sparkles */}
				{[...Array(8)].map((_, i) => {
					const angle = i * 45 * (Math.PI / 180);
					const distance = 60;
					const x = Math.cos(angle) * distance;
					const y = Math.sin(angle) * distance;
					return (
						<div
							key={i}
							className="absolute h-3 w-3 bg-emerald-500 border border-black pixel-burst"
							style={{
								left: '50%',
								top: '50%',
								transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
								animationDelay: `${i * 50}ms`,
							}}
							onAnimationEnd={i === 7 ? onComplete : undefined}
						/>
					);
				})}
				{/* Inner sparkles */}
				{[...Array(4)].map((_, i) => {
					const angle = (i * 90 + 45) * (Math.PI / 180);
					const distance = 30;
					const x = Math.cos(angle) * distance;
					const y = Math.sin(angle) * distance;
					return (
						<div
							key={`inner-${i}`}
							className="absolute h-2 w-2 bg-amber-400 border border-black pixel-burst"
							style={{
								left: '50%',
								top: '50%',
								transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
								animationDelay: `${100 + i * 50}ms`,
							}}
						/>
					);
				})}
				{/* Center check */}
				<div className="h-8 w-8 bg-emerald-500 border-2 border-black pixel-check-pop flex items-center justify-center">
					<svg viewBox="0 0 16 16" className="h-5 w-5 text-white" fill="currentColor">
						<rect x="3" y="8" width="2" height="2" />
						<rect x="5" y="10" width="2" height="2" />
						<rect x="7" y="8" width="2" height="2" />
						<rect x="9" y="6" width="2" height="2" />
						<rect x="11" y="4" width="2" height="2" />
					</svg>
				</div>
			</div>
		</div>
	);
}

function isCardio(ex: any) {
	return typeof ex?.duration === 'number' && ex.duration > 0;
}

export default function ActiveWorkout() {
	const { myUser, workouts, entries, setEntries } = useMyContext();
	const auth0Id = myUser?.auth0Id;

	const latestUncompletedEntry = useMemo(() => {
		const uncompleted = entries
			.filter((e: any) => !e.completed && !e.aborted)
			.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
		return uncompleted[0] ?? null;
	}, [entries]);

	const workout = useMemo(() => {
		if (!latestUncompletedEntry) return null;
		return workouts.find((w: any) => w._id === latestUncompletedEntry.workoutId) ?? null;
	}, [workouts, latestUncompletedEntry]);

	const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
	const [openForExerciseName, setOpenForExerciseName] = useState<string | null>(null);
	const [weightInput, setWeightInput] = useState<string>('');
	const [durationInput, setDurationInput] = useState<string>('');
	const [pendingExercise, setPendingExercise] = useState<any>(null);
	const [showCelebration, setShowCelebration] = useState(false);

	// Exercise detail dialog state
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<any>(null);

	const completedCount = latestUncompletedEntry?.completed_exercises?.length ?? 0;
	const totalCount = latestUncompletedEntry?.plannedExercises?.length ?? 0;
	const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	async function scheduleWorkout() {
		if (!auth0Id || !selectedWorkoutId) return;

		const res = await fetch('http://localhost:3000/api/entries', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				auth0Id,
				workoutId: selectedWorkoutId,
				date: new Date().toISOString(),
			}),
		});

		if (!res.ok) {
			toast.error('Workout could not be scheduled');
			return;
		}

		const newEntry = await res.json();
		setEntries((prev: any) => [...prev, newEntry]);
		setSelectedWorkoutId('');
		toast.success('Workout scheduled');
	}

	async function completeExercise(entryId: string, ex: any, weight?: number, duration?: number) {
		const res = await fetch(`http://localhost:3000/api/entries/${entryId}/complete-exercise`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				exerciseName: ex.exercise.name,
				weight,
				duration,
			}),
		});

		if (!res.ok) {
			toast.error('Exercise could not be completed');
			return;
		}

		const updatedEntry = await res.json();
		setEntries((prev: any) => prev.map((e: any) => (e._id === entryId ? updatedEntry : e)));
		setShowCelebration(true);
		toast.success('Exercise completed');
	}

	async function abortEntry(entryId: string) {
		const res = await fetch(`http://localhost:3000/api/entries/${entryId}/abort`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!res.ok) {
			toast.error('Workout could not be aborted');
			return;
		}

		const updatedEntry = await res.json();
		setEntries((prev: any) => prev.map((e: any) => (e._id === entryId ? updatedEntry : e)));
		toast.success('Workout aborted');
	}

	function onCheckClick(ex: any) {
		setPendingExercise(ex);
		setWeightInput('');
		setDurationInput('');
		setOpenForExerciseName(ex.exercise.name);
	}

	function openExerciseDetail(ex: any) {
		setSelectedExerciseForDetail(ex);
		setDetailDialogOpen(true);
	}

	async function submitExerciseValue() {
		if (!latestUncompletedEntry || !pendingExercise) return;

		const cardio = isCardio(pendingExercise);
		const weight = cardio ? undefined : Number(weightInput);
		const duration = cardio ? Number(durationInput) : undefined;

		if (!cardio && (Number.isNaN(weight) || weight! <= 0)) {
			toast.error('Please enter a valid weight');
			return;
		}
		if (cardio && (Number.isNaN(duration) || duration! <= 0)) {
			toast.error('Please enter a valid duration');
			return;
		}

		await completeExercise(latestUncompletedEntry._id, pendingExercise, weight, duration);

		setOpenForExerciseName(null);
		setPendingExercise(null);
	}

	if (!latestUncompletedEntry) {
		return (
			<PixelCard>
				<PixelCardHeader>
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 bg-emerald-500 border-2 border-black" />
						<PixelCardTitle>Active Workout</PixelCardTitle>
					</div>
				</PixelCardHeader>

				<PixelCardContent className="flex flex-col justify-center gap-4">
					<div className="text-center py-6">
						<div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-amber-100 border-2 border-black flex items-center justify-center mx-auto mb-4">
							<Plus className="h-6 w-6 text-black/60" />
						</div>
						<p className="text-sm text-black/60 mb-4">No active workout. Start one now!</p>
					</div>

					<div className="flex gap-2">
						<Select value={selectedWorkoutId} onValueChange={setSelectedWorkoutId}>
							<SelectTrigger className="flex-1 border-2 border-black rounded-none">
								<SelectValue placeholder="Select workout" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{workouts.map((w: any) => (
										<SelectItem key={w._id} value={w._id}>
											{w.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Button
							onClick={scheduleWorkout}
							disabled={!selectedWorkoutId}
							className="shrink-0 pixel-btn bg-amber-400 text-black hover:bg-amber-500 border-2 border-black rounded-none"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</PixelCardContent>
			</PixelCard>
		);
	}

	return (
		<>
			<PixelCelebration show={showCelebration} onComplete={() => setShowCelebration(false)} />

			{/* Exercise Detail Dialog */}
			<ExerciseDetailDialog
				exercise={
					selectedExerciseForDetail?.exercise
						? {
								name: selectedExerciseForDetail.exercise.name,
								type: selectedExerciseForDetail.exercise.type,
								primaryMuscleGroups: selectedExerciseForDetail.exercise.primaryMuscleGroups,
								executionInstructions: selectedExerciseForDetail.exercise.executionInstructions,
								videoUrl: selectedExerciseForDetail.exercise.videoUrl,
								imageUrl: selectedExerciseForDetail.exercise.imageUrl,
							}
						: null
				}
				sets={selectedExerciseForDetail?.sets}
				reps={selectedExerciseForDetail?.reps}
				duration={selectedExerciseForDetail?.duration}
				open={detailDialogOpen}
				onOpenChange={setDetailDialogOpen}
			/>

			<PixelCard>
				<PixelCardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 bg-emerald-500 border-2 border-black" />
							<PixelCardTitle>Active Workout</PixelCardTitle>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 text-black/50 hover:text-red-600 hover:bg-red-50"
							onClick={() => abortEntry(latestUncompletedEntry._id)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex items-center justify-between mt-2">
						<span className="text-sm font-medium text-black">{workout?.name ?? 'Workout'}</span>
						<span className="text-xs text-black/60">
							{completedCount}/{totalCount} exercises
						</span>
					</div>
					{/* Progress bar */}
					<div className="h-2 w-full bg-black/10 border border-black overflow-hidden mt-2">
						<div
							className="h-full bg-emerald-500 transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</PixelCardHeader>

				<PixelCardContent className="overflow-auto">
					<div className="space-y-2">
						{(latestUncompletedEntry.plannedExercises ?? []).map((ex: any) => {
							const done = latestUncompletedEntry.completed_exercises?.some(
								(c: any) => c.exercise.name === ex.exercise.name,
							);
							const cardio = isCardio(ex);

							return (
								<div
									key={ex.exercise.name}
									className={`flex items-center gap-3 p-3 border-2 transition-all group ${
										done
											? 'bg-emerald-50 border-emerald-300'
											: 'bg-white border-black/20 hover:border-black/40 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.1)]'
									}`}
								>
									{/* Checkbox */}
									<Checkbox
										checked={done}
										disabled={done}
										onCheckedChange={() => onCheckClick(ex)}
										className="shrink-0 border-2 border-black rounded-none data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
									/>

									{/* Clickable exercise info */}
									<button
										type="button"
										onClick={() => openExerciseDetail(ex)}
										className="flex-1 text-left cursor-pointer"
									>
										<div className="flex items-center gap-2">
											<div
												className={`w-6 h-6 border-2 border-black flex items-center justify-center shrink-0 ${
													cardio ? 'bg-sky-300' : 'bg-amber-300'
												}`}
											>
												{cardio ? (
													<Timer className="w-3 h-3 text-black" />
												) : (
													<Dumbbell className="w-3 h-3 text-black" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div
													className={`text-sm font-medium truncate ${done ? 'line-through text-black/40' : 'text-black'}`}
												>
													{ex.exercise.name}
												</div>
												<div className="flex items-center gap-2 text-xs text-black/50">
													{cardio ? (
														<span>{ex.duration}s</span>
													) : (
														<span>
															{ex.sets}x{ex.reps}
														</span>
													)}
													{ex.exercise.primaryMuscleGroups?.length > 0 && (
														<span className="hidden sm:inline">
															• {ex.exercise.primaryMuscleGroups.slice(0, 2).join(', ')}
														</span>
													)}
												</div>
											</div>
										</div>
									</button>

									{/* Arrow indicator for clickable */}
									<ChevronRight
										className={`w-4 h-4 shrink-0 transition-all ${
											done
												? 'text-emerald-400'
												: 'text-black/30 group-hover:text-black/60 group-hover:translate-x-0.5'
										}`}
									/>

									{/* Weight/Duration input popover */}
									<Popover
										open={openForExerciseName === ex.exercise.name}
										onOpenChange={(open) => setOpenForExerciseName(open ? ex.exercise.name : null)}
									>
										<PopoverTrigger asChild>
											<span />
										</PopoverTrigger>

										<PopoverContent
											className="w-64 border-2 border-black rounded-none"
											side="left"
											align="center"
										>
											<div className="space-y-3">
												<div className="font-medium text-sm text-black">{ex.exercise.name}</div>
												{cardio ? (
													<div className="space-y-2">
														<Label className="text-xs text-black/70">Duration (seconds)</Label>
														<Input
															value={durationInput}
															onChange={(e) => setDurationInput(e.target.value)}
															inputMode="numeric"
															placeholder="e.g. 600"
															className="h-9 border-2 border-black rounded-none"
														/>
													</div>
												) : (
													<div className="space-y-2">
														<Label className="text-xs text-black/70">Weight (kg)</Label>
														<Input
															value={weightInput}
															onChange={(e) => setWeightInput(e.target.value)}
															inputMode="decimal"
															placeholder="e.g. 40"
															className="h-9 border-2 border-black rounded-none"
														/>
													</div>
												)}
												<Button
													onClick={submitExerciseValue}
													size="sm"
													className="w-full pixel-btn bg-emerald-500 text-white hover:bg-emerald-600 border-2 border-black rounded-none"
												>
													Complete
												</Button>
											</div>
										</PopoverContent>
									</Popover>
								</div>
							);
						})}
					</div>
				</PixelCardContent>
			</PixelCard>
		</>
	);
}
