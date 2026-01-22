'use client';

import { useEffect, useState } from 'react';
import { useMyContext } from '@/context/AppContext';
import {
	Plus,
	Calendar,
	MoreVertical,
	Trash2,
	Edit3,
	X,
	Search,
	Dumbbell,
	Timer,
	ChevronRight,
	Info,
} from 'lucide-react';
import ExerciseDetailDialog from '@/components/ExerciseDetailDialog';
import { Button } from '@/components/ui/button';
import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Workout = {
	_id: string;
	name: string;
	description?: string;
	exercises?: any[];
};

function isoDateOnly(d: Date) {
	return d.toISOString().slice(0, 10);
}

export default function WorkoutsArea() {
	const { myUser, workouts, setWorkouts, entries, setEntries, exercises } = useMyContext();
	const auth0Id = myUser?.auth0Id as string | undefined;

	const [error, setError] = useState<string | null>(null);

	// Dialog states
	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
	const [scheduleOpen, setScheduleOpen] = useState(false);
	const [schedulingWorkout, setSchedulingWorkout] = useState<Workout | null>(null);

	// Form state
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [scheduleDate, setScheduleDate] = useState<string>(() => isoDateOnly(new Date()));

	// Exercise search
	const [exerciseSearch, setExerciseSearch] = useState('');
	const [selectedExercise, setSelectedExercise] = useState<any>(null);
	const [sets, setSets] = useState('3');
	const [reps, setReps] = useState('10');
	const [duration, setDuration] = useState('300');

	// Exercise detail dialog
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<any>(null);

	const filteredExercises = exercises.filter((ex: any) =>
		ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()),
	);

	function openExerciseDetail(ex: any) {
		setSelectedExerciseForDetail(ex);
		setDetailDialogOpen(true);
	}

	function openEdit(w: Workout) {
		setActiveWorkout(w);
		setName(w.name ?? '');
		setDescription(w.description ?? '');
		setEditOpen(true);
	}

	function openSchedule(w: Workout) {
		setSchedulingWorkout(w);
		setScheduleDate(isoDateOnly(new Date()));
		setScheduleOpen(true);
	}

	function resetForm() {
		setName('');
		setDescription('');
		setActiveWorkout(null);
		setExerciseSearch('');
		setSelectedExercise(null);
		setSets('3');
		setReps('10');
		setDuration('300');
	}

	async function scheduleWorkout() {
		if (!auth0Id || !schedulingWorkout) return;
		try {
			const res = await fetch('http://localhost:3000/api/entries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					auth0Id,
					workoutId: schedulingWorkout._id,
					date: new Date(scheduleDate).toISOString(),
				}),
			});
			if (!res.ok) throw new Error('Entry could not be created');

			const newEntry = await res.json();
			setEntries([...entries, newEntry]);
			setScheduleOpen(false);
			setSchedulingWorkout(null);
		} catch (e: any) {
			setError(e?.message ?? 'Unknown error');
		}
	}

	async function addExerciseToWorkout(workoutId: string) {
		if (!selectedExercise) return;
		try {
			const body: any = { exerciseName: selectedExercise.name };
			if (selectedExercise.type === 'strength') {
				if (sets) body.sets = Number(sets);
				if (reps) body.reps = Number(reps);
			} else if (selectedExercise.type === 'cardio') {
				if (duration) body.duration = Number(duration);
			}

			const res = await fetch(`http://localhost:3000/api/workouts/${workoutId}/exercises`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error('Exercise could not be added');

			const updatedWorkout = await res.json();
			setWorkouts((prev: any) => prev.map((w: any) => (w._id === workoutId ? updatedWorkout : w)));
			setActiveWorkout(updatedWorkout);
			setSelectedExercise(null);
			setExerciseSearch('');
		} catch (e: any) {
			setError(e?.message ?? 'Unknown error');
		}
	}

	async function removeExerciseFromWorkout(workoutId: string, exerciseName: string) {
		try {
			const res = await fetch(
				`http://localhost:3000/api/workouts/${workoutId}/exercises/${encodeURIComponent(exerciseName)}`,
				{
					method: 'DELETE',
				},
			);
			if (!res.ok) throw new Error('Exercise could not be removed');

			const updatedWorkout = await res.json();
			setWorkouts((prev: any) => prev.map((w: any) => (w._id === workoutId ? updatedWorkout : w)));
			setActiveWorkout(updatedWorkout);
		} catch (e: any) {
			setError(e?.message ?? 'Unknown error');
		}
	}

	async function createWorkout() {
		if (!auth0Id) return;
		try {
			const res = await fetch('http://localhost:3000/api/workouts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ auth0Id, name, description }),
			});
			if (!res.ok) throw new Error('Workout could not be created');

			const newWorkout = await res.json();
			setWorkouts([...workouts, newWorkout]);
			setCreateOpen(false);
			resetForm();
		} catch (e: any) {
			setError(e?.message ?? 'Unknown error');
		}
	}

	async function saveWorkoutEdits() {
		if (!activeWorkout) return;
		try {
			const res = await fetch(`http://localhost:3000/api/workouts/${activeWorkout._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, description }),
			});

			if (res.ok) {
				const updated = await res.json();
				setWorkouts((prev: any) =>
					prev.map((w: any) => (w._id === activeWorkout._id ? updated : w)),
				);
			} else {
				// Fallback to local update if API doesn't exist yet
				setWorkouts((prev: any) =>
					prev.map((w: any) => (w._id === activeWorkout._id ? { ...w, name, description } : w)),
				);
			}
		} catch {
			// Fallback to local update
			setWorkouts((prev: any) =>
				prev.map((w: any) => (w._id === activeWorkout._id ? { ...w, name, description } : w)),
			);
		}
		setEditOpen(false);
		resetForm();
	}

	async function deleteWorkout(workoutId: string) {
		if (!confirm('Are you sure you want to delete this workout?')) return;
		try {
			const res = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Workout could not be deleted');
			setWorkouts((prev: any) => prev.filter((w: any) => w._id !== workoutId));
		} catch (e: any) {
			setError(e?.message ?? 'Unknown error');
		}
	}

	useEffect(() => {
		async function loadWorkouts() {
			if (!auth0Id) return;
			try {
				const response = await fetch(`http://localhost:3000/api/workouts/${auth0Id}`, {
					headers: { 'Content-Type': 'application/json' },
				});
				const workoutsData = await response.json();
				setWorkouts(workoutsData);
			} catch (e) {
				console.error('Failed to load workouts', e);
			}
		}
		loadWorkouts();
	}, [auth0Id, setWorkouts]);

	return (
		<div className="h-full flex flex-col overflow-hidden">
			{/* Header - Fixed */}
			<div className="flex items-center justify-between gap-4 shrink-0 mb-4">
				<div>
					<h1 className="font-pixel text-xl text-black">Workouts</h1>
					<p className="text-sm text-black/60 mt-1">Manage your workout routines and exercises</p>
				</div>
				<button
					onClick={() => {
						resetForm();
						setCreateOpen(true);
					}}
					className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
				>
					<Plus className="w-4 h-4" />
					New Workout
				</button>
			</div>

			{/* Error display */}
			{error && (
				<PixelCard className="border-red-500">
					<PixelCardContent className="pt-4 text-sm text-red-600 flex items-center justify-between">
						<span>{error}</span>
						<button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
							<X className="w-4 h-4" />
						</button>
					</PixelCardContent>
				</PixelCard>
			)}

			{/* Workouts Grid - Scrollable */}
			<div className="flex-1 overflow-y-auto min-h-0">
				{workouts.length === 0 ? (
					<PixelCard>
						<PixelCardContent className="py-12 text-center">
							<div className="w-16 h-16 bg-emerald-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
								<Dumbbell className="w-8 h-8 text-emerald-600" />
							</div>
							<h3 className="font-pixel text-lg text-black mb-2">No Workouts Yet</h3>
							<p className="text-black/60 mb-4">Create your first workout to get started.</p>
							<button
								onClick={() => setCreateOpen(true)}
								className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
							>
								<Plus className="w-4 h-4" />
								Create Workout
							</button>
						</PixelCardContent>
					</PixelCard>
				) : (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 pb-4">
						{workouts.map((w: any) => (
							<PixelCard key={w._id}>
								<PixelCardHeader className="flex flex-row items-start justify-between gap-2">
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2 mb-1">
											<div className="w-6 h-6 bg-emerald-400 border-2 border-black flex items-center justify-center shrink-0">
												<Dumbbell className="w-3 h-3 text-black" />
											</div>
											<PixelCardTitle className="truncate">{w.name}</PixelCardTitle>
										</div>
										<p className="text-xs text-black/60 line-clamp-1">
											{w.description || 'No description'}
										</p>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="border-2 border-black">
											<DropdownMenuItem onClick={() => openEdit(w)} className="gap-2">
												<Edit3 className="w-4 h-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => openSchedule(w)} className="gap-2">
												<Calendar className="w-4 h-4" />
												Schedule
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => deleteWorkout(w._id)}
												className="gap-2 text-red-600"
											>
												<Trash2 className="w-4 h-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</PixelCardHeader>

								<PixelCardContent>
									{/* Exercise list preview - clickable */}
									<div className="space-y-2 mb-4">
										{(w.exercises || []).slice(0, 3).map((ex: any, i: number) => (
											<button
												key={i}
												type="button"
												onClick={() => openExerciseDetail(ex)}
												className="w-full flex items-center gap-2 text-sm p-2 -mx-2 rounded hover:bg-gray-50 transition-colors group cursor-pointer text-left"
											>
												<div
													className={`w-5 h-5 border-2 border-black flex items-center justify-center shrink-0 ${
														ex.exercise?.type === 'cardio' ? 'bg-sky-300' : 'bg-amber-300'
													}`}
												>
													{ex.exercise?.type === 'cardio' ? (
														<Timer className="w-3 h-3 text-black" />
													) : (
														<Dumbbell className="w-3 h-3 text-black" />
													)}
												</div>
												<span className="truncate text-black/80 flex-1">
													{ex.exercise?.name || 'Unknown'}
												</span>
												<span className="text-xs text-black/50 shrink-0">
													{ex.sets && ex.reps
														? `${ex.sets}x${ex.reps}`
														: ex.duration
															? `${ex.duration}s`
															: ''}
												</span>
												<ChevronRight className="w-3 h-3 text-black/30 group-hover:text-black/60 shrink-0 transition-colors" />
											</button>
										))}
										{(w.exercises?.length || 0) > 3 && (
											<p className="text-xs text-black/50 pl-2">+{w.exercises.length - 3} more</p>
										)}
										{(!w.exercises || w.exercises.length === 0) && (
											<p className="text-xs text-black/50 italic">No exercises added yet</p>
										)}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-3 border-t-2 border-black/10">
										<button
											onClick={() => openEdit(w)}
											className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border-2 border-black hover:bg-gray-50 transition-colors"
										>
											<Edit3 className="w-3 h-3" />
											Edit
										</button>
										<button
											onClick={() => openSchedule(w)}
											className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-400 border-2 border-black text-black hover:bg-emerald-500 transition-colors"
										>
											<Calendar className="w-3 h-3" />
											Schedule
										</button>
									</div>
								</PixelCardContent>
							</PixelCard>
						))}
					</div>
				)}
			</div>

			{/* Create Workout Dialog */}
			<Dialog
				open={createOpen}
				onOpenChange={(o) => {
					setCreateOpen(o);
					if (!o) resetForm();
				}}
			>
				<DialogContent className="sm:max-w-md border-4 border-black">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg flex items-center gap-2">
							<div className="w-6 h-6 bg-emerald-400 border-2 border-black flex items-center justify-center">
								<Plus className="w-3 h-3 text-black" />
							</div>
							Create Workout
						</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name" className="font-medium">
								Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Push Day"
								className="border-2 border-black"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="desc" className="font-medium">
								Description
							</Label>
							<Input
								id="desc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Optional description"
								className="border-2 border-black"
							/>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setCreateOpen(false)}
							className="border-2 border-black"
						>
							Cancel
						</Button>
						<button
							onClick={createWorkout}
							disabled={!name.trim()}
							className="pixel-btn px-4 py-2 text-sm font-medium disabled:opacity-50"
						>
							Create
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Workout Dialog */}
			<Dialog
				open={editOpen}
				onOpenChange={(o) => {
					setEditOpen(o);
					if (!o) resetForm();
				}}
			>
				<DialogContent className="sm:max-w-2xl border-4 border-black max-h-[90vh] overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg flex items-center gap-2">
							<div className="w-6 h-6 bg-amber-400 border-2 border-black flex items-center justify-center">
								<Edit3 className="w-3 h-3 text-black" />
							</div>
							Edit Workout
						</DialogTitle>
					</DialogHeader>

					<div className="flex-1 overflow-auto space-y-6 py-4">
						{/* Basic Info */}
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="edit-name" className="font-medium">
									Name
								</Label>
								<Input
									id="edit-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="border-2 border-black"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-desc" className="font-medium">
									Description
								</Label>
								<Input
									id="edit-desc"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="border-2 border-black"
								/>
							</div>
						</div>

						{/* Exercises Section */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-pixel text-sm">Exercises</h3>
								<span className="text-xs text-black/50">
									{activeWorkout?.exercises?.length || 0} exercises
								</span>
							</div>

							{/* Current Exercises */}
							<div className="space-y-2 max-h-48 overflow-auto">
								{(activeWorkout?.exercises || []).map((ex: any, i: number) => (
									<div
										key={i}
										className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black group hover:bg-gray-100 transition-colors"
									>
										<button
											type="button"
											onClick={() => openExerciseDetail(ex)}
											className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
										>
											<div
												className={`w-8 h-8 border-2 border-black flex items-center justify-center shrink-0 ${
													ex.exercise?.type === 'cardio' ? 'bg-sky-300' : 'bg-amber-300'
												}`}
											>
												{ex.exercise?.type === 'cardio' ? (
													<Timer className="w-4 h-4 text-black" />
												) : (
													<Dumbbell className="w-4 h-4 text-black" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-sm truncate">{ex.exercise?.name}</p>
												<p className="text-xs text-black/50">
													{ex.sets && ex.reps ? `${ex.sets} sets x ${ex.reps} reps` : ''}
													{ex.duration ? `${ex.duration} seconds` : ''}
												</p>
											</div>
											<Info className="w-4 h-4 text-black/30 group-hover:text-black/60 shrink-0" />
										</button>
										<button
											onClick={() =>
												activeWorkout &&
												removeExerciseFromWorkout(activeWorkout._id, ex.exercise?.name)
											}
											className="p-1.5 text-red-500 hover:bg-red-50 border-2 border-transparent hover:border-red-200 shrink-0"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								))}
								{(!activeWorkout?.exercises || activeWorkout.exercises.length === 0) && (
									<p className="text-sm text-black/50 text-center py-4">No exercises added yet</p>
								)}
							</div>

							{/* Add Exercise */}
							<div className="border-2 border-dashed border-black/30 p-4 space-y-3">
								<h4 className="font-medium text-sm">Add Exercise</h4>

								{!selectedExercise ? (
									<>
										<div className="relative">
											<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
											<Input
												value={exerciseSearch}
												onChange={(e) => setExerciseSearch(e.target.value)}
												placeholder="Search exercises..."
												className="pl-9 border-2 border-black"
											/>
										</div>
										{exerciseSearch && (
											<div className="max-h-40 overflow-auto border-2 border-black bg-white">
												{filteredExercises.length === 0 ? (
													<p className="p-3 text-sm text-black/50">No exercises found</p>
												) : (
													filteredExercises.map((ex: any) => (
														<button
															key={ex._id}
															onClick={() => setSelectedExercise(ex)}
															className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-black/10 last:border-0"
														>
															<div
																className={`w-5 h-5 border border-black flex items-center justify-center ${
																	ex.type === 'cardio' ? 'bg-sky-200' : 'bg-amber-200'
																}`}
															>
																{ex.type === 'cardio' ? (
																	<Timer className="w-3 h-3" />
																) : (
																	<Dumbbell className="w-3 h-3" />
																)}
															</div>
															<span className="text-sm">{ex.name}</span>
															<span className="text-xs text-black/40 ml-auto">{ex.type}</span>
														</button>
													))
												)}
											</div>
										)}
									</>
								) : (
									<div className="space-y-3">
										<div className="flex items-center gap-2 p-2 bg-emerald-50 border-2 border-emerald-300">
											<div
												className={`w-6 h-6 border-2 border-black flex items-center justify-center ${
													selectedExercise.type === 'cardio' ? 'bg-sky-300' : 'bg-amber-300'
												}`}
											>
												{selectedExercise.type === 'cardio' ? (
													<Timer className="w-3 h-3" />
												) : (
													<Dumbbell className="w-3 h-3" />
												)}
											</div>
											<span className="font-medium text-sm">{selectedExercise.name}</span>
											<button
												onClick={() => setSelectedExercise(null)}
												className="ml-auto text-black/40 hover:text-black"
											>
												<X className="w-4 h-4" />
											</button>
										</div>

										{selectedExercise.type === 'strength' ? (
											<div className="grid grid-cols-2 gap-3">
												<div className="space-y-1">
													<Label className="text-xs">Sets</Label>
													<Input
														type="number"
														value={sets}
														onChange={(e) => setSets(e.target.value)}
														className="border-2 border-black"
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-xs">Reps</Label>
													<Input
														type="number"
														value={reps}
														onChange={(e) => setReps(e.target.value)}
														className="border-2 border-black"
													/>
												</div>
											</div>
										) : (
											<div className="space-y-1">
												<Label className="text-xs">Duration (seconds)</Label>
												<Input
													type="number"
													value={duration}
													onChange={(e) => setDuration(e.target.value)}
													className="border-2 border-black"
												/>
											</div>
										)}

										<button
											onClick={() => activeWorkout && addExerciseToWorkout(activeWorkout._id)}
											className="w-full pixel-btn px-4 py-2 text-sm font-medium"
										>
											Add Exercise
										</button>
									</div>
								)}
							</div>
						</div>
					</div>

					<DialogFooter className="gap-2 border-t pt-4">
						<Button
							variant="outline"
							onClick={() => setEditOpen(false)}
							className="border-2 border-black"
						>
							Close
						</Button>
						<button
							onClick={saveWorkoutEdits}
							disabled={!name.trim()}
							className="pixel-btn px-4 py-2 text-sm font-medium disabled:opacity-50"
						>
							Save Changes
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Schedule Workout Dialog */}
			<Dialog
				open={scheduleOpen}
				onOpenChange={(o) => {
					setScheduleOpen(o);
					if (!o) setSchedulingWorkout(null);
				}}
			>
				<DialogContent className="sm:max-w-sm border-4 border-black">
					<DialogHeader>
						<DialogTitle className="font-pixel text-lg flex items-center gap-2">
							<div className="w-6 h-6 bg-sky-400 border-2 border-black flex items-center justify-center">
								<Calendar className="w-3 h-3 text-black" />
							</div>
							Schedule Workout
						</DialogTitle>
					</DialogHeader>

					<div className="py-4 space-y-4">
						<div className="p-3 bg-gray-50 border-2 border-black">
							<p className="font-medium">{schedulingWorkout?.name}</p>
							<p className="text-xs text-black/50">
								{schedulingWorkout?.exercises?.length || 0} exercises
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="schedule-date" className="font-medium">
								Date
							</Label>
							<Input
								id="schedule-date"
								type="date"
								value={scheduleDate}
								onChange={(e) => setScheduleDate(e.target.value)}
								className="border-2 border-black"
							/>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setScheduleOpen(false)}
							className="border-2 border-black"
						>
							Cancel
						</Button>
						<button onClick={scheduleWorkout} className="pixel-btn px-4 py-2 text-sm font-medium">
							Schedule
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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
		</div>
	);
}
