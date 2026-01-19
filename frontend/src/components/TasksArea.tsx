import { useEffect, useState } from 'react';
import { format, startOfToday, addDays, startOfWeek, endOfWeek, isBefore } from 'date-fns';
import { de } from 'date-fns/locale';
import { EntryCalendar } from './EntryCalendar';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyContext } from '@/context/AppContext';

export default function TasksArea() {
	const { myUser, entries } = useMyContext();
	const [currentDate, setCurrentDate] = useState(startOfToday());
	const [reloadFlag, setReloadFlag] = useState(false);

	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
	const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
	const today = startOfToday();

	// Entries für diese Woche filtern
	const weekEntries = entries.filter((entry) => {
		const entryDate = new Date(entry.date);
		return entryDate >= weekStart && entryDate <= weekEnd;
	});

	// Statistiken berechnen
	const totalExercises = weekEntries.reduce(
		(sum, entry) => sum + (entry.plannedExercises?.length ?? 0),
		0,
	);
	const completedExercises = weekEntries.reduce(
		(sum, entry) => sum + (entry.completed_exercises?.length ?? 0),
		0,
	);
	const pendingExercises = totalExercises - completedExercises;

	const triggerReload = () => setReloadFlag((f) => !f);

	const handlePrevWeek = () => setCurrentDate((prev) => addDays(prev, -7));
	const handleNextWeek = () => setCurrentDate((prev) => addDays(prev, 7));
	const handleToday = () => setCurrentDate(startOfToday());

	return (
		<div className="h-full w-full bg-white shadow-md rounded-xl min-h-0 overflow-y-auto">
			<div className="top-0 grid grid-cols-4 p-6 z-20 rounded-xl pl-5 gap-4 sticky shadow-md bg-white backdrop-blur-3xl">
				<Card className="p-5 border border-border bg-card shadow-sm">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Total Exercises
							</p>
							<p className="text-3xl font-bold text-foreground mt-2">{totalExercises}</p>
						</div>
						<Circle className="h-10 w-10 text-blue-200 shrink-0" />
					</div>
				</Card>
				<Card className="p-5 border border-border bg-card shadow-sm">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Completed
							</p>
							<p className="text-3xl font-bold text-foreground mt-2">{completedExercises}</p>
						</div>
						<CheckCircle2 className="h-10 w-10 text-green-200 shrink-0" />
					</div>
				</Card>
				<Card className="p-5 border border-border bg-card shadow-sm">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Pending
							</p>
							<p className="text-3xl font-bold text-foreground mt-2">{pendingExercises}</p>
						</div>
						<Circle className="h-10 w-10 text-orange-200 shrink-0" />
					</div>
				</Card>
			</div>

			<div className="p-6 pt-3 pb-0">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{format(currentDate, 'MMMM yyyy', { locale: de })}
					</h2>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={handlePrevWeek}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={handleToday}>
							Today
						</Button>
						<Button variant="outline" size="sm" onClick={handleNextWeek}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
			<div className="p-6">
				<EntryCalendar weekStart={weekStart} onEntryUpdated={triggerReload} />
			</div>
		</div>
	);
}
