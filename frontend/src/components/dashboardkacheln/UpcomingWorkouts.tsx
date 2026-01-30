'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { Checkbox } from '@/components/ui/checkbox';
import { useMyContext } from '@/context/AppContext';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { format, isAfter, startOfToday, isSameDay } from 'date-fns';
import { toast } from 'sonner';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Storage key for today's completed habits
const getStorageKey = (date: Date) => `completed_habits_${format(date, 'yyyy-MM-dd')}`;

// Pixel icons
function CalendarIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="2" y="3" width="12" height="2" />
			<rect x="2" y="3" width="2" height="11" />
			<rect x="12" y="3" width="2" height="11" />
			<rect x="2" y="12" width="12" height="2" />
			<rect x="4" y="1" width="2" height="3" />
			<rect x="10" y="1" width="2" height="3" />
			<rect x="5" y="7" width="2" height="2" />
			<rect x="9" y="7" width="2" height="2" />
		</svg>
	);
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="3" y="8" width="2" height="2" />
			<rect x="5" y="10" width="2" height="2" />
			<rect x="7" y="8" width="2" height="2" />
			<rect x="9" y="6" width="2" height="2" />
			<rect x="11" y="4" width="2" height="2" />
		</svg>
	);
}

export default function UpcomingWorkouts() {
	const { entries, workouts, habits } = useMyContext();
	const today = new Date();
	const todayWeekday = today.getDay();

	// Track completed habits for today using localStorage
	const [completedHabitIds, setCompletedHabitIds] = useState<string[]>([]);

	// Load completed habits from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(getStorageKey(today));
		if (stored) {
			try {
				setCompletedHabitIds(JSON.parse(stored));
			} catch {
				setCompletedHabitIds([]);
			}
		}
	}, []);

	// Get today's habits
	const todaysHabits = useMemo(() => {
		if (!habits) return [];
		return habits.filter((h: any) => h.type === 'daily' || h.weekday === todayWeekday).slice(0, 5);
	}, [habits, todayWeekday]);

	// Get upcoming workouts
	const upcomingEntries = useMemo(() => {
		const todayStart = startOfToday();
		return entries
			.filter(
				(e: any) =>
					(isAfter(new Date(e.date), todayStart) || isSameDay(new Date(e.date), todayStart)) &&
					!e.completed &&
					!e.aborted,
			)
			.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.slice(0, 3)
			.map((entry: any) => {
				const workout = workouts.find((w: any) => w._id === entry.workoutId);
				return {
					...entry,
					workoutName: workout?.name ?? 'Workout',
				};
			});
	}, [entries, workouts]);

	const toggleHabitComplete = useCallback(
		(habitId: string, habitName: string) => {
			setCompletedHabitIds((prev) => {
				const isCompleted = prev.includes(habitId);
				const newList = isCompleted ? prev.filter((id) => id !== habitId) : [...prev, habitId];

				// Save to localStorage
				localStorage.setItem(getStorageKey(today), JSON.stringify(newList));

				// Show toast
				if (!isCompleted) {
					toast.success(`${habitName} completed!`);
				}

				return newList;
			});
		},
		[today],
	);

	const hasContent = upcomingEntries.length > 0 || todaysHabits.length > 0;
	const completedHabitsCount = todaysHabits.filter((h: any) =>
		completedHabitIds.includes(h._id),
	).length;
	const totalHabitsCount = todaysHabits.length;

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-violet-400 border-2 border-black" />
					<PixelCardTitle>Upcoming</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent scrollable>
				{!hasContent ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<CalendarIcon className="h-8 w-8 text-black/30 dark:text-white/30 mx-auto mb-2" />
							<p className="text-sm text-black/50 dark:text-white/50">Nothing scheduled</p>
						</div>
					</div>
				) : (
					<div className="space-y-3">
						{/* Today's Habits - with completion */}
						{todaysHabits.length > 0 && (
							<div>
								<div className="flex items-center gap-1.5 mb-2">
									<CheckIcon className="h-3 w-3 text-pink-500" />
									<span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase">
										Today's Habits
									</span>
									{totalHabitsCount > 0 && (
										<span className="text-[10px] text-black/40 dark:text-white/40 ml-auto">
											{completedHabitsCount}/{totalHabitsCount}
										</span>
									)}
								</div>
								<div className="space-y-1.5">
									{todaysHabits.map((habit: any) => {
										const isCompleted = completedHabitIds.includes(habit._id);
										return (
											<div
												key={habit._id}
												className={`flex items-center gap-2 p-2 border-2 transition-all ${
													isCompleted
														? 'bg-emerald-50 border-emerald-300'
														: 'bg-gradient-to-r from-pink-50 to-white border-black/20 hover:border-black/30'
												}`}
											>
												<Checkbox
													checked={isCompleted}
													onCheckedChange={() => toggleHabitComplete(habit._id, habit.name)}
													className="shrink-0 border-2 border-black rounded-none data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-4 w-4"
												/>
												<span
													className={`text-xs font-medium flex-1 truncate ${
														isCompleted ? 'text-emerald-700 line-through' : 'text-black dark:text-white'
													}`}
												>
													{habit.name}
												</span>
												<span
													className={`text-[10px] shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-black/40 dark:text-white/40'}`}
												>
													{habit.type === 'daily' ? 'Daily' : WEEKDAYS[habit.weekday]?.slice(0, 3)}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Upcoming Workouts */}
						{upcomingEntries.length > 0 && (
							<div>
								<div className="flex items-center gap-1.5 mb-2">
									<CalendarIcon className="h-3 w-3 text-violet-500" />
									<span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase">Workouts</span>
								</div>
								<div className="space-y-1.5">
									{upcomingEntries.map((entry: any) => (
										<div
											key={entry._id}
											className="flex items-center gap-2 p-2 bg-gradient-to-r from-violet-50 to-white border-2 border-black/20"
										>
											<div className="bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 border border-black shrink-0">
												{format(new Date(entry.date), 'MMM d')}
											</div>
											<span className="text-xs font-medium text-black dark:text-white truncate">
												{entry.workoutName}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</PixelCardContent>
		</PixelCard>
	);
}
