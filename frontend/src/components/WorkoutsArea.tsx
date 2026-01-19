import { useEffect, useState } from 'react';
import { useMyContext } from '@/context/AppContext';

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
	const { myUser, workouts, setWorkouts } = useMyContext();
	console.log(myUser.auth0Id);
	const auth0Id = myUser?.auth0Id as string | undefined;

	const [error, setError] = useState<string | null>(null);

	// Dialog state
	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

	// form state
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	// scheduling state
	const [scheduleDate, setScheduleDate] = useState<string>(() => isoDateOnly(new Date()));

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
		setWorkouts((prev) =>
			prev.map((w) => (w._id === activeWorkout._id ? { ...w, name, description } : w)),
		);
		setEditOpen(false);
		resetForm();
	}

	async function scheduleWorkout(workoutId: string) {
		if (!auth0Id) return;
		try {
			const res = await fetch('http://localhost:3000/api/entries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					auth0Id,
					workoutId,
					date: new Date(scheduleDate).toISOString(),
				}),
			});
			if (!res.ok) throw new Error('Entry konnte nicht erstellt werden');
			alert('Workout für den Tag geplant!');
		} catch (e: any) {
			setError(e?.message ?? 'Unbekannter Fehler');
		}
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

			<Card className="bg-white/70">
				<CardHeader>
					<CardTitle>Planen</CardTitle>
					<CardDescription>
						Wähle ein Datum und plane dann ein Workout über die ⋯ Aktionen.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Label htmlFor="date" className="sm:w-24">
						Datum
					</Label>
					<Input
						id="date"
						type="date"
						value={scheduleDate}
						onChange={(e) => setScheduleDate(e.target.value)}
						className="sm:w-[220px]"
					/>
					<div className="text-xs text-muted-foreground">
						Erstellt einen Entry für dieses Datum.
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{workouts.map((w) => (
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
										<DropdownMenuItem
											onClick={() =>
												scheduleWorkout(w._id).catch((e) => setError(String(e.message ?? e)))
											}
										>
											Für Datum planen
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => openEdit(w)}>
											Bearbeiten (MVP)
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>

						<CardContent className="text-sm text-muted-foreground">
							Übungen: {w.exercises?.length ?? 0}
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
