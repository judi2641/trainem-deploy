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
import ExerciseDetailDialog from '@/components/ExerciseDetailDialog';
import { toast } from 'sonner';
import { useMemo, useState, useEffect } from 'react';
import {
	Plus,
	Dumbbell,
	Timer,
	X,
	ChevronRight,
	ChevronDown,
	ChevronUp,
	Trophy,
	Clock,
} from 'lucide-react';
import { useMyContext } from '@/context/AppContext';

// Workout duration timer hook
function useWorkoutTimer(startDate: Date | null) {
	const [elapsed, setElapsed] = useState<string>('00:00');

	useEffect(() => {
		if (!startDate) {
			setElapsed('00:00');
			return;
		}

		function calculate() {
			const now = new Date();
			const start = new Date(startDate!);
			const diffMs = now.getTime() - start.getTime();

			if (diffMs < 0) {
				setElapsed('00:00');
				return;
			}

			const totalSeconds = Math.floor(diffMs / 1000);
			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;

			if (hours > 0) {
				setElapsed(
					`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
				);
			} else {
				setElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
			}
		}

		calculate();
		const interval = setInterval(calculate, 1000);
		return () => clearInterval(interval);
	}, [startDate]);

	return elapsed;
}

// Enhanced workout completion celebration with inline animations
function WorkoutCompleteCelebration({
	onFinish,
	isExiting,
}: {
	onFinish: () => void;
	isExiting: boolean;
}) {
	const [visible, setVisible] = useState(false);

	// Trigger entrance animation
	useEffect(() => {
		const timer = setTimeout(() => setVisible(true), 50);
		return () => clearTimeout(timer);
	}, []);

	// Auto-trigger finish after display time
	useEffect(() => {
		if (!isExiting) {
			const timer = setTimeout(onFinish, 3000);
			return () => clearTimeout(timer);
		}
	}, [onFinish, isExiting]);

	// Generate confetti with burst directions
	const confetti = useMemo(() => {
		return [...Array(20)].map((_, i) => {
			const angle = (i / 20) * 360;
			const distance = 60 + Math.random() * 40;
			return {
				color: ['#10b981', '#f59e0b', '#ec4899', '#0ea5e9', '#8b5cf6'][i % 5],
				angle,
				distance,
				delay: Math.random() * 300,
				size: Math.random() > 0.5 ? 12 : 8,
			};
		});
	}, []);

	return (
		<div
			className="absolute inset-0 flex items-center justify-center z-50"
			style={{
				background:
					'linear-gradient(135deg, rgba(236,253,245,0.98) 0%, rgba(254,249,195,0.98) 100%)',
				opacity: isExiting ? 0 : visible ? 1 : 0,
				transform: isExiting ? 'scale(0.9)' : visible ? 'scale(1)' : 'scale(0.8)',
				transition: 'all 0.3s ease-out',
			}}
		>
			{/* Confetti particles */}
			{confetti.map((c, i) => {
				const x = Math.cos((c.angle * Math.PI) / 180) * c.distance;
				const y = Math.sin((c.angle * Math.PI) / 180) * c.distance;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							width: c.size,
							height: c.size,
							backgroundColor: c.color,
							border: '1px solid black',
							opacity: visible ? 0 : 1,
							transform: visible
								? `translate(${x}px, ${y}px) scale(0)`
								: 'translate(0, 0) scale(1)',
							transition: `all 0.8s ease-out ${c.delay}ms`,
						}}
					/>
				);
			})}

			{/* Trophy center */}
			<div
				className="relative"
				style={{
					transform: visible ? 'scale(1)' : 'scale(0)',
					transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Glow effect */}
				<div
					className="absolute inset-0 bg-amber-300 blur-xl"
					style={{
						opacity: visible ? 0.5 : 0,
						transform: 'scale(1.5)',
						transition: 'opacity 0.5s ease-out',
					}}
				/>

				{/* Trophy box */}
				<div
					className="relative bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-4 border-black p-8"
					style={{
						boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
					}}
				>
					<Trophy className="h-16 w-16 text-black mx-auto" />
				</div>

				{/* Label */}
				<div
					className="absolute -bottom-10 left-1/2 whitespace-nowrap"
					style={{
						transform: `translateX(-50%) ${visible ? 'translateY(0)' : 'translateY(-10px)'}`,
						opacity: visible ? 1 : 0,
						transition: 'all 0.3s ease-out 0.2s',
					}}
				>
					<p
						className="font-pixel text-sm text-black bg-white px-4 py-2 border-2 border-black"
						style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}
					>
						WORKOUT COMPLETE!
					</p>
				</div>
			</div>
		</div>
	);
}

// Pixel celebration for exercise completion
function PixelCelebration({ show, onComplete }: { show: boolean; onComplete: () => void }) {
	if (!show) return null;

	return (
		<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
			<div className="relative">
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
	const { myUser, workouts, entries, setEntries, setMyUser } = useMyContext();
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
	const [showWorkoutComplete, setShowWorkoutComplete] = useState(false);
	const [celebrationExiting, setCelebrationExiting] = useState(false);
	const [showCompleted, setShowCompleted] = useState(true);

	// Track the entry ID that triggered completion to prevent re-triggering
	const [completedEntryId, setCompletedEntryId] = useState<string | null>(null);

	// Exercise detail dialog state
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<any>(null);

	// Use completed_exercises length + plannedExercises length for total (since backend moves exercises)
	const completedCount = latestUncompletedEntry?.completed_exercises?.length ?? 0;
	const totalCount = completedCount + (latestUncompletedEntry?.plannedExercises?.length ?? 0);
	const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	// Active workout timer
	const workoutStartDate = latestUncompletedEntry?.date
		? new Date(latestUncompletedEntry.date)
		: null;
	const elapsedTime = useWorkoutTimer(workoutStartDate);

	// Get remaining and completed exercises
	const remainingExercises = useMemo(() => {
		if (!latestUncompletedEntry) return [];
		const completed = latestUncompletedEntry.completed_exercises || [];
		return (latestUncompletedEntry.plannedExercises || []).filter(
			(ex: any) => !completed.some((c: any) => c.exercise.name === ex.exercise.name),
		);
	}, [latestUncompletedEntry]);
	const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
	const completedExercises = useMemo(() => {
		if (!latestUncompletedEntry) return [];
		return latestUncompletedEntry.completed_exercises || [];
	}, [latestUncompletedEntry]);

	async function scheduleWorkout() {
		if (!auth0Id || !selectedWorkoutId) return;

		const res = await fetch(
			'https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/entries',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					auth0Id,
					workoutId: selectedWorkoutId,
					date: new Date().toISOString(),
				}),
			},
		);

		if (!res.ok) {
			toast.error('Workout could not be scheduled');
			return;
		}

		const newEntry = await res.json();
		setEntries((prev: any) => [...prev, newEntry]);
		setSelectedWorkoutId('');
		// Reset celebration states when scheduling new workout
		setShowWorkoutComplete(false);
		setCelebrationExiting(false);
		setCompletedEntryId(null);
		toast.success('Workout scheduled');
	}

	async function completeExercise(entryId: string, ex: any, weight?: number, duration?: number) {
		if (latestUncompletedEntry.plannedExercises.length === 1) {
			toast.success('Workout completed');

			setCompletedEntryId(entryId);
			setShowWorkoutComplete(true);
			setCelebrationExiting(false);
			await sleep(3000);
		}
		const res = await fetch(
			`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/entries/${entryId}/complete-exercise`,
			{
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					exerciseName: ex.exercise.name,
					weight,
					duration,
				}),
			},
		);

		if (!res.ok) {
			toast.error('Exercise could not be completed');
			return;
		}

		const updatedEntry = await res.json();

		// Update entries state first
		setEntries((prev: any) => prev.map((e: any) => (e._id === entryId ? updatedEntry : e)));
		setMyUser((prev: any) => {
			if (!prev) return prev;
			const nextScore = (prev.points ?? prev.score ?? 0) + 67;
			return { ...prev, points: nextScore, score: nextScore };
		});

		// ONLY trigger celebration when backend sets completed === true
		// This is the most reliable indicator that all exercises are done
		if (updatedEntry.completed === true && completedEntryId !== entryId) {
			// Track completed entry and show celebration
		} else if (!updatedEntry.completed) {
			// Show single exercise celebration
			setShowCelebration(true);
			toast.success('Exercise completed');
		}
	}

	async function abortEntry(entryId: string) {
		const res = await fetch(
			`https://trainem-deploy-ccij2dm4s-julius-projects-c59e7d1a.vercel.app/api/entries/${entryId}/abort`,
			{
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
			},
		);

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

	// Start exit animation for celebration
	function startCelebrationExit() {
		setCelebrationExiting(true);
		// After exit animation, hide celebration and show toast
		setTimeout(() => {
			setShowWorkoutComplete(false);
			setCelebrationExiting(false);
			toast.success('Workout completed! Great job!');
		}, 300);
	}

	return (
		<>
			<PixelCelebration show={showCelebration} onComplete={() => setShowCelebration(false)} />

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

			<PixelCard className="relative overflow-hidden">
				{/* Workout Complete Celebration Overlay */}
				{showWorkoutComplete && (
					<WorkoutCompleteCelebration
						onFinish={startCelebrationExit}
						isExiting={celebrationExiting}
					/>
				)}

				<PixelCardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 bg-emerald-500 border-2 border-black" />
							<PixelCardTitle>Active Workout</PixelCardTitle>
						</div>
						{!showWorkoutComplete && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-black/50 hover:text-red-600 hover:bg-red-50"
								onClick={() => abortEntry(latestUncompletedEntry._id)}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
					<div className="flex items-center justify-between mt-2">
						<span className="text-sm font-medium text-black">{workout?.name ?? 'Workout'}</span>
						<div className="flex items-center gap-3">
							{/* Active workout timer */}
							<div className="flex items-center gap-1 px-2 py-0.5 bg-black/5 border border-black/20">
								<Clock className="h-3 w-3 text-black/60" />
								<span className="text-xs font-mono font-medium text-black/80">{elapsedTime}</span>
							</div>
							<span className="text-xs text-black/60">
								{completedCount}/{totalCount} exercises
							</span>
						</div>
					</div>
					{/* Progress bar */}
					<div className="h-2 w-full bg-black/10 border border-black overflow-hidden mt-2">
						<div
							className="h-full bg-emerald-500 transition-all duration-500"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</PixelCardHeader>

				<PixelCardContent scrollable>
					<div className="space-y-3">
						{/* Remaining Exercises Section */}
						{remainingExercises.length > 0 && (
							<div>
								<div className="flex items-center gap-2 mb-2">
									<div className="h-2 w-2 bg-amber-400 border border-black" />
									<span className="text-[10px] font-bold text-black/50 uppercase">
										Remaining ({remainingExercises.length})
									</span>
								</div>
								<div className="space-y-2">
									{remainingExercises.map((ex: any) => {
										const cardio = isCardio(ex);
										return (
											<div
												key={ex.exercise.name}
												className="flex items-center gap-3 p-3 border-2 bg-white border-black/20 hover:border-black/40 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all group"
											>
												<Checkbox
													checked={false}
													onCheckedChange={() => onCheckClick(ex)}
													className="shrink-0 border-2 border-black rounded-none"
												/>
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
															<div className="text-sm font-medium text-black truncate">
																{ex.exercise.name}
															</div>
															<div className="text-xs text-black/50">
																{cardio ? `${ex.duration}s` : `${ex.sets}x${ex.reps}`}
															</div>
														</div>
													</div>
												</button>
												<ChevronRight className="w-4 h-4 text-black/30 group-hover:text-black/60 shrink-0 transition-all" />

												<Popover
													open={openForExerciseName === ex.exercise.name}
													onOpenChange={(open) =>
														setOpenForExerciseName(open ? ex.exercise.name : null)
													}
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
															<div className="font-medium text-sm text-black">
																{ex.exercise.name}
															</div>
															{cardio ? (
																<div className="space-y-2">
																	<Label className="text-xs text-black/70">
																		Duration (seconds)
																	</Label>
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
							</div>
						)}

						{/* Completed Exercises Section */}
						{completedExercises.length > 0 && (
							<div>
								<button
									type="button"
									onClick={() => setShowCompleted(!showCompleted)}
									className="flex items-center gap-2 mb-2 w-full text-left cursor-pointer hover:opacity-80"
								>
									<div className="h-2 w-2 bg-emerald-500 border border-black" />
									<span className="text-[10px] font-bold text-black/50 uppercase">
										Completed ({completedExercises.length})
									</span>
									{showCompleted ? (
										<ChevronUp className="w-3 h-3 text-black/40 ml-auto" />
									) : (
										<ChevronDown className="w-3 h-3 text-black/40 ml-auto" />
									)}
								</button>

								{showCompleted && (
									<div className="space-y-2">
										{completedExercises.map((ex: any) => {
											return (
												<div
													key={ex.exercise?.name}
													className="flex items-center gap-3 p-3 border-2 bg-emerald-50 border-emerald-300"
												>
													<div className="w-5 h-5 bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center shrink-0">
														<svg
															viewBox="0 0 16 16"
															className="h-3 w-3 text-white"
															fill="currentColor"
														>
															<rect x="3" y="8" width="2" height="2" />
															<rect x="5" y="10" width="2" height="2" />
															<rect x="7" y="8" width="2" height="2" />
															<rect x="9" y="6" width="2" height="2" />
															<rect x="11" y="4" width="2" height="2" />
														</svg>
													</div>
													<button
														type="button"
														onClick={() => openExerciseDetail(ex)}
														className="flex-1 text-left cursor-pointer"
													>
														<div className="text-sm font-medium text-emerald-700 line-through truncate">
															{ex.exercise?.name}
														</div>
														<div className="text-xs text-emerald-600/70">
															{ex.weight ? `${ex.weight}kg` : ''}
															{ex.duration ? `${ex.duration}s` : ''}
														</div>
													</button>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}
					</div>
				</PixelCardContent>
			</PixelCard>
		</>
	);
}
