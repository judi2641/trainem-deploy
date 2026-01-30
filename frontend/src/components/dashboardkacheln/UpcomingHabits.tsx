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
import { format, isAfter, startOfToday, isSameDay, addDays, endOfWeek } from 'date-fns';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

// Pixel art icons
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

function CalendarIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="2" y="3" width="12" height="2" />
			<rect x="2" y="5" width="2" height="9" />
			<rect x="12" y="5" width="2" height="9" />
			<rect x="2" y="12" width="12" height="2" />
			<rect x="5" y="1" width="2" height="3" />
			<rect x="9" y="1" width="2" height="3" />
			<rect x="5" y="7" width="2" height="2" />
			<rect x="9" y="7" width="2" height="2" />
		</svg>
	);
}

// Mini celebration animation for habit completion
function HabitCompleteCelebration({ show, onComplete }: { show: boolean; onComplete: () => void }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (show) {
			setVisible(true);
			const timer = setTimeout(() => {
				setVisible(false);
				onComplete();
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [show, onComplete]);

	if (!show && !visible) return null;

	return (
		<div
			className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
			style={{
				background:
					'linear-gradient(135deg, rgba(236,253,245,0.95) 0%, rgba(167,243,208,0.95) 100%)',
				opacity: visible ? 1 : 0,
				transition: 'opacity 0.3s ease-out',
			}}
		>
			<div
				style={{
					transform: visible ? 'scale(1)' : 'scale(0.5)',
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				<div className="bg-emerald-500 border-3 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
					<CheckCircle2 className="h-8 w-8 text-white" />
				</div>
				<p className="font-pixel text-xs text-emerald-700 mt-2 text-center">Done!</p>
			</div>
		</div>
	);
}

// Weekday mapping: 0 = Sunday, 1 = Monday, etc.
const WEEKDAY_NAMES = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];

export default function UpcomingHabits() {
	const { habits, myUser, entries, setEntries } = useMyContext();
	const user = myUser; // Declare the user variable
	const [completingHabitId, setCompletingHabitId] = useState<string | null>(null);
	const [showCelebration, setShowCelebration] = useState(false);

	// Get today's date info
	const today = startOfToday();
	const todayWeekdayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
	const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

	// Get habits scheduled for today and upcoming days this week
	const { todayHabits, upcomingHabits, completedTodayIds } = useMemo(() => {
		if (!habits || !Array.isArray(habits)) {
			return { todayHabits: [], upcomingHabits: [], completedTodayIds: new Set<string>() };
		}

		// Find habit entries completed today
		const todayEntries = (entries || []).filter(
			(entry: any) => entry.habitId && isSameDay(new Date(entry.date), today) && entry.completed,
		);
		const completedIds = new Set<string>(todayEntries.map((e: any) => e.habitId));

		// Filter habits for today based on type
		// Daily habits show every day, weekly habits show on their specific weekday
		const todayList = habits.filter((habit: any) => {
			if (habit.paused) return false; // Skip paused habits
			if (habit.type === 'daily') return true;
			if (habit.type === 'weekly') {
				return habit.weekday === todayWeekdayIndex;
			}
			return false;
		});

		// Get WEEKLY habits for upcoming days this week (not today)
		// Daily habits are excluded - they only show in Today section
		const upcomingList: { habit: any; day: string; date: Date }[] = [];

		for (let i = 1; i <= 6; i++) {
			const futureDate = addDays(today, i);
			const futureWeekdayIndex = futureDate.getDay();

			if (isAfter(futureDate, weekEnd)) break;

			habits.forEach((habit: any) => {
				if (habit.paused) return; // Skip paused habits
				// Only include weekly habits scheduled for that specific day
				if (habit.type === 'weekly' && habit.weekday === futureWeekdayIndex) {
					upcomingList.push({ habit, day: WEEKDAY_NAMES[futureWeekdayIndex], date: futureDate });
				}
			});
		}

		return {
			todayHabits: todayList,
			upcomingHabits: upcomingList.slice(0, 5), // Limit to 5 upcoming
			completedTodayIds: completedIds,
		};
	}, [habits, entries, today, todayWeekdayIndex, weekEnd]);

	// Complete a habit
	const completeHabit = useCallback(
		async (habit: any) => {
			if (!myUser?._id || completedTodayIds.has(habit._id)) return;

			setCompletingHabitId(habit._id);

			try {
				// Create a completed entry for this habit
				const res = await fetch('http://localhost:3000/api/entries', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						auth0Id: user.auth0Id,
						habitId: habit._id,
						date: new Date().toISOString(),
					}),
				});

				if (!res.ok) throw new Error('Failed to complete habit');

				const newEntry = await res.json();
				setEntries((prev: any) => [...prev, newEntry]);

				// Show celebration
				setShowCelebration(true);
			} catch (err) {
				console.error('Error completing habit:', err);
				toast.error('Failed to complete habit');
			} finally {
				setCompletingHabitId(null);
			}
		},
		[myUser?._id, completedTodayIds, setEntries],
	);

	// Uncomplete a habit (delete the entry)
	const uncompleteHabit = useCallback(
		async (habit: any) => {
			if (!myUser?._id) return;

			// Find the entry to delete
			const entryToDelete = (entries || []).find(
				(entry: any) =>
					entry.habitId === habit._id && isSameDay(new Date(entry.date), today) && entry.completed,
			);

			if (!entryToDelete) return;

			try {
				const res = await fetch(`http://localhost:3000/api/entries/${entryToDelete._id}`, {
					method: 'DELETE',
				});

				if (!res.ok) throw new Error('Failed to uncomplete habit');

				setEntries((prev: any) => prev.filter((e: any) => e._id !== entryToDelete._id));
				toast.success('Habit unmarked');
			} catch (err) {
				console.error('Error uncompleting habit:', err);
				toast.error('Failed to uncomplete habit');
			}
		},
		[myUser?._id, entries, today, setEntries],
	);

	// Handle checkbox change
	const handleHabitToggle = useCallback(
		(habit: any, isCompleted: boolean) => {
			if (isCompleted) {
				uncompleteHabit(habit);
			} else {
				completeHabit(habit);
			}
		},
		[completeHabit, uncompleteHabit],
	);

	const hasContent = todayHabits.length > 0 || upcomingHabits.length > 0;
	const completedCount = todayHabits.filter((h: any) => completedTodayIds.has(h._id)).length;

	return (
		<PixelCard>
			{/* Celebration overlay */}
			<HabitCompleteCelebration
				show={showCelebration}
				onComplete={() => setShowCelebration(false)}
			/>

			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-violet-500 border-2 border-black" />
					<PixelCardTitle>Upcoming Habits</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent scrollable>
				{!hasContent ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<CalendarIcon className="h-8 w-8 text-black/30 mx-auto mb-2" />
							<p className="text-sm text-black/50">No habits scheduled</p>
							<p className="text-xs text-black/40 mt-1">Create habits to see them here</p>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{/* Today's Habits */}
						{todayHabits.length > 0 && (
							<div>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-1.5">
										<CheckIcon className="h-3 w-3 text-emerald-500" />
										<span className="text-[10px] font-bold text-black/50 uppercase">Today</span>
									</div>
									<span className="text-[10px] font-medium text-emerald-600">
										{completedCount}/{todayHabits.length}
									</span>
								</div>
								<div className="space-y-1.5">
									{todayHabits.map((habit: any) => {
										const isCompleted = completedTodayIds.has(habit._id);
										const isLoading = completingHabitId === habit._id;
										return (
											<div
												key={habit._id}
												className={`flex items-center gap-2 p-2 border-2 transition-all ${
													isCompleted
														? 'bg-emerald-50 border-emerald-300'
														: 'bg-gradient-to-r from-violet-50 to-white border-black/20 hover:border-violet-300'
												}`}
											>
												<Checkbox
													checked={isCompleted}
													disabled={isLoading}
													onCheckedChange={() => handleHabitToggle(habit, isCompleted)}
													className={`h-4 w-4 border-2 ${
														isCompleted
															? 'border-emerald-500 bg-emerald-500 data-[state=checked]:bg-emerald-500'
															: 'border-black/30'
													}`}
												/>
												<span
													className={`text-xs font-medium flex-1 truncate ${
														isCompleted ? 'text-emerald-700 line-through' : 'text-black'
													}`}
												>
													{habit.name}
												</span>
												<span
													className={`text-[9px] px-1.5 py-0.5 border shrink-0 ${
														habit.type === 'daily'
															? 'bg-amber-100 border-amber-300 text-amber-700'
															: 'bg-violet-100 border-violet-300 text-violet-700'
													}`}
												>
													{habit.type === 'daily' ? 'Daily' : 'Weekly'}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Upcoming Habits This Week */}
						{upcomingHabits.length > 0 && (
							<div>
								<div className="flex items-center gap-1.5 mb-2">
									<CalendarIcon className="h-3 w-3 text-violet-500" />
									<span className="text-[10px] font-bold text-black/50 uppercase">This Week</span>
								</div>
								<div className="space-y-1.5">
									{upcomingHabits.map((item: any, idx: number) => (
										<div
											key={`${item.habit._id}-${item.day}-${idx}`}
											className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-white border-2 border-black/10"
										>
											<div className="bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 border border-black shrink-0">
												{format(item.date, 'EEE')}
											</div>
											<span className="text-xs font-medium text-black/70 truncate flex-1">
												{item.habit.name}
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
