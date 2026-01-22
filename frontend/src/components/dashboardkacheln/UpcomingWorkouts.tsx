'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { format, isAfter, startOfToday, isSameDay } from 'date-fns';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

	// Get today's habits
	const todaysHabits = useMemo(() => {
		if (!habits) return [];
		return habits.filter((h: any) => h.type === 'daily' || h.weekday === todayWeekday).slice(0, 3);
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

	const hasContent = upcomingEntries.length > 0 || todaysHabits.length > 0;

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-violet-400 border-2 border-black" />
					<PixelCardTitle>Upcoming</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent>
				{!hasContent ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<CalendarIcon className="h-8 w-8 text-black/30 mx-auto mb-2" />
							<p className="text-sm text-black/50">Nothing scheduled</p>
						</div>
					</div>
				) : (
					<div className="space-y-3">
						{/* Today's Habits */}
						{todaysHabits.length > 0 && (
							<div>
								<div className="flex items-center gap-1.5 mb-2">
									<CheckIcon className="h-3 w-3 text-pink-500" />
									<span className="text-[10px] font-bold text-black/50 uppercase">
										Today's Habits
									</span>
								</div>
								<div className="space-y-1.5">
									{todaysHabits.map((habit: any) => (
										<div
											key={habit._id}
											className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-50 to-white border-2 border-black/20"
										>
											<div className="h-2 w-2 bg-pink-400 border border-black" />
											<span className="text-xs font-medium text-black truncate">{habit.name}</span>
											<span className="ml-auto text-[10px] text-black/40">
												{habit.type === 'daily' ? 'Daily' : WEEKDAYS[habit.weekday]}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Upcoming Workouts */}
						{upcomingEntries.length > 0 && (
							<div>
								<div className="flex items-center gap-1.5 mb-2">
									<CalendarIcon className="h-3 w-3 text-violet-500" />
									<span className="text-[10px] font-bold text-black/50 uppercase">Workouts</span>
								</div>
								<div className="space-y-1.5">
									{upcomingEntries.map((entry: any) => (
										<div
											key={entry._id}
											className="flex items-center gap-2 p-2 bg-gradient-to-r from-violet-50 to-white border-2 border-black/20"
										>
											<div className="bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 border border-black">
												{format(new Date(entry.date), 'MMM d')}
											</div>
											<span className="text-xs font-medium text-black truncate">
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
