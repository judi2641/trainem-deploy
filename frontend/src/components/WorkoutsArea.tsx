import { useEffect, useState } from 'react';
import { useMyContext } from '@/context/AppContext';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';

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
	console.log(myUser.auth0Id);
	const auth0Id = myUser?.auth0Id as string | undefined;

	const [error, setError] = useState<string | null>(null);

	// Dialog state
	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

	// Exercise adding state
	const [addExerciseOpen, setAddExerciseOpen] = useState<string | null>(null);

	const [selectedExercise, setSelectedExercise] = useState<any>(null);
	const [sets, setSets] = useState('');
	const [reps, setReps] = useState('');
	const [duration, setDuration] = useState('');

	// form state
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	// scheduling state
	const [scheduleDate, setScheduleDate] = useState<string>(() => isoDateOnly(new Date()));
	const [schedulingWorkout, setSchedulingWorkout] = useState<string | null>(null);
	function openEdit(w: Workout) {
		setActiveWorkout(w);
		setName(w.name ?? '');
		setDescription(w.description ?? '');
		setEditOpen(true);
	}

	function resetForm() {
		setName('');
		setDescription('');
		setActiveWorkout(null);
	}

	async function scheduleWorkout(workoutId: string, date: string) {
		if (!auth0Id) return;
		try {
			const res = await fetch('http://localhost:3000/api/entries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					auth0Id,
					workoutId,
					date: new Date(date).toISOString(),
				}),
			});
			if (!res.ok) throw new Error('Entry konnte nicht erstellt werden');

			const newEntry = await res.json();

			// Context updaten
			setEntries([...entries, newEntry]);

			setSchedulingWorkout(null);
			setScheduleDate(isoDateOnly(new Date()));
		} catch (e: any) {
			setError(e?.message ?? 'Unbekannter Fehler');
		}
	}

	function resetExerciseForm() {
		setSelectedExercise(null);
		setSets('');
		setReps('');
		setDuration('');
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
			if (!res.ok) throw new Error('Übung konnte nicht hinzugefügt werden');

			const updatedWorkout = await res.json();
			setWorkouts((prev: any) => prev.map((w: any) => (w._id === workoutId ? updatedWorkout : w)));

			setAddExerciseOpen(null);
			resetExerciseForm();
		} catch (e: any) {
			setError(e?.message ?? 'Unbekannter Fehler');
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
			if (!res.ok) throw new Error('Workout konnte nicht erstellt werden');

			const newWorkout = await res.json();
			setWorkouts([...workouts, newWorkout]);

			setCreateOpen(false);
			resetForm();
		} catch (e: any) {
			setError(e?.message ?? 'Unbekannter Fehler');
		}
	}

	async function saveWorkoutEdits() {
		if (!activeWorkout) return;
		setWorkouts((prev: any) =>
			prev.map((w: any) => (w._id === activeWorkout._id ? { ...w, name, description } : w)),
		);
		setEditOpen(false);
		resetForm();
	}

	useEffect(() => {
		async function loadWorkouts() {
			const response = await fetch(`http://localhost:3000/api/workouts/${auth0Id}`, {
				headers: { 'Content-Type': 'application/json' },
			});
			const workouts = await response.json();
			setWorkouts(workouts);
		}
		loadWorkouts();
	}, []);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">Workouts</h2>
					<p className="text-sm text-muted-foreground">
						Erstellen, ansehen und für einen Tag planen.
					</p>
				</div>

				<Dialog
					open={createOpen}
					onOpenChange={(o) => {
						setCreateOpen(o);
						if (!o) resetForm();
					}}
				>
					<DialogTrigger asChild>
						<Button>Neues Workout</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Workout erstellen</DialogTitle>
						</DialogHeader>

						<div className="grid gap-4 py-2">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="z.B. Push Day"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="desc">Beschreibung</Label>
								<Input
									id="desc"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Optional"
								/>
							</div>
						</div>

						<DialogFooter>
							<Button variant="outline" onClick={() => setCreateOpen(false)}>
								Abbrechen
							</Button>
							<Button
								onClick={() => createWorkout().catch((e) => setError(String(e.message ?? e)))}
								disabled={!name.trim()}
							>
								Erstellen
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{error && (
				<Card className="border-destructive bg-white/70">
					<CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
				</Card>
			)}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{workouts.map((w: any) => (
					<Card key={w._id} className="bg-white/70">
						<CardHeader className="space-y-1">
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<CardTitle className="truncate">{w.name}</CardTitle>
									<CardDescription className="line-clamp-2">
										{w.description || 'Keine Beschreibung'}
									</CardDescription>
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="icon" aria-label="Aktionen">
											⋯
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => openEdit(w)}>
											Bearbeiten (MVP)
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>

						<CardContent className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Übungen: {w.exercises?.length ?? 0}</span>
							<Popover
								open={schedulingWorkout === w._id}
								onOpenChange={(open) => {
									setSchedulingWorkout(open ? w._id : null);
									if (!open) setScheduleDate(isoDateOnly(new Date()));
								}}
							>
								<PopoverTrigger asChild>
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
										<Calendar className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-4" align="end">
									<div className="space-y-3">
										<div>
											<h4 className="font-medium text-sm mb-1">Workout planen</h4>
											<p className="text-xs text-muted-foreground">{w.name} für einen Tag planen</p>
										</div>
										<div className="space-y-2">
											<Label htmlFor={`date-${w._id}`}>Datum</Label>
											<Input
												id={`date-${w._id}`}
												type="date"
												value={scheduleDate}
												onChange={(e) => setScheduleDate(e.target.value)}
											/>
										</div>
										<Button
											size="sm"
											className="w-full"
											onClick={() =>
												scheduleWorkout(w._id, scheduleDate).catch((e) =>
													setError(String(e.message ?? e)),
												)
											}
										>
											Planen
										</Button>
									</div>
								</PopoverContent>
							</Popover>
							<Popover
								open={addExerciseOpen === w._id}
								onOpenChange={(open) => {
									setAddExerciseOpen(open ? w._id : null);
									if (!open) resetExerciseForm();
								}}
							>
								<PopoverTrigger asChild>
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
										+
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80 p-0" align="end">
									{!selectedExercise ? (
										<Command>
											<CommandInput placeholder="Übung suchen..." />
											<CommandEmpty>Keine Übung gefunden.</CommandEmpty>
											<CommandGroup className="max-h-64 overflow-auto">
												{exercises.map((ex: any) => (
													<CommandItem key={ex._id} onSelect={() => setSelectedExercise(ex)}>
														<div className="flex flex-col">
															<span>{ex.name}</span>
															<span className="text-xs text-muted-foreground">
																{ex.type === 'strength' ? 'Kraft' : 'Cardio'}
															</span>
														</div>
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									) : (
										<div className="p-4 space-y-4">
											<div>
												<h4 className="font-medium mb-1">{selectedExercise.name}</h4>
												<p className="text-xs text-muted-foreground">
													{selectedExercise.type === 'strength' ? 'Kraftübung' : 'Cardio'}
												</p>
											</div>

											{selectedExercise.type === 'strength' ? (
												<div className="grid grid-cols-2 gap-2">
													<div className="space-y-1">
														<Label htmlFor="sets">Sets</Label>
														<Input
															id="sets"
															type="number"
															value={sets}
															onChange={(e) => setSets(e.target.value)}
															placeholder="3"
														/>
													</div>
													<div className="space-y-1">
														<Label htmlFor="reps">Reps</Label>
														<Input
															id="reps"
															type="number"
															value={reps}
															onChange={(e) => setReps(e.target.value)}
															placeholder="10"
														/>
													</div>
												</div>
											) : (
												<div className="space-y-1">
													<Label htmlFor="duration">Dauer (Sekunden)</Label>
													<Input
														id="duration"
														type="number"
														value={duration}
														onChange={(e) => setDuration(e.target.value)}
														placeholder="300"
													/>
												</div>
											)}

											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSelectedExercise(null)}
													className="flex-1"
												>
													Zurück
												</Button>
												<Button
													size="sm"
													onClick={() => addExerciseToWorkout(w._id)}
													className="flex-1"
												>
													Hinzufügen
												</Button>
											</div>
										</div>
									)}
								</PopoverContent>
							</Popover>
						</CardContent>
					</Card>
				))}
			</div>

			<Dialog
				open={editOpen}
				onOpenChange={(o) => {
					setEditOpen(o);
					if (!o) resetForm();
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Workout bearbeiten</DialogTitle>
					</DialogHeader>

					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<Label htmlFor="edit-name">Name</Label>
							<Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-desc">Beschreibung</Label>
							<Input
								id="edit-desc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setEditOpen(false)}>
							Schließen
						</Button>
						<Button onClick={saveWorkoutEdits} disabled={!name.trim()}>
							Speichern (local)
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{workouts.length === 0 && (
				<Card className="bg-white/70">
					<CardContent className="pt-6 text-sm text-muted-foreground">
						Noch keine Workouts vorhanden. Erstelle eins über „Neues Workout".
					</CardContent>
				</Card>
			)}
		</div>
	);
}
