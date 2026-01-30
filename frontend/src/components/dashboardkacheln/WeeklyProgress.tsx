'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import { Flame } from 'lucide-react';

export default function WeeklyProgress() {
	const { entries, myUser } = useMyContext();

	const weekData = useMemo(() => {
		const now = new Date();
		const weekStart = startOfWeek(now, { weekStartsOn: 1 });
		const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

		const weekEntries = entries.filter((e: any) =>
			isWithinInterval(new Date(e.date), { start: weekStart, end: weekEnd }),
		);

		const completedWorkouts = weekEntries.filter((e: any) => e.completed).length;

		// Calculate streak
		let streak = 0;
		const sortedEntries = [...entries]
			.filter((e: any) => e.completed)

			.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

		if (sortedEntries.length > 0) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			for (let i = 0; i < sortedEntries.length; i++) {
				const entryDate = new Date(sortedEntries[i].date);
				entryDate.setHours(0, 0, 0, 0);

				const expectedDate = new Date(today);
				expectedDate.setDate(expectedDate.getDate() - i);

				if (entryDate.getTime() === expectedDate.getTime()) {
					streak++;
				} else if (i === 0 && entryDate.getTime() === expectedDate.getTime() - 86400000) {
					streak++;
				} else {
					break;
				}
			}
		}

		// Days of the week status
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		const dayStatus = days.map((_, index) => {
			const day = new Date(weekStart);
			day.setDate(day.getDate() + index);

			const dayEntry = weekEntries.find((e: any) => {
				const entryDate = new Date(e.date);
				return (
					entryDate.getDate() === day.getDate() &&
					entryDate.getMonth() === day.getMonth() &&
					entryDate.getFullYear() === day.getFullYear()
				);
			});

			return {
				day: days[index],
				date: day,
				completed: dayEntry?.completed ?? false,
				scheduled: !!dayEntry,
				isPast: day < now,
				isToday:
					day.getDate() === now.getDate() &&
					day.getMonth() === now.getMonth() &&
					day.getFullYear() === now.getFullYear(),
			};
		});

		return {
			completedWorkouts,
			streak,
			dayStatus,
			weekStart,
			weekEnd,
		};
	}, [entries]);

	const weeklyGoal = myUser?.weeklyGoal ?? 4;
	const goalProgress = Math.min((weekData.completedWorkouts / weeklyGoal) * 100, 100);

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-sky-400 border-2 border-black" />
					<PixelCardTitle>This Week</PixelCardTitle>
				</div>
				<p className="text-xs text-black/50 dark:text-white/50 mt-1">
					{format(weekData.weekStart, 'MMM d')} - {format(weekData.weekEnd, 'MMM d')}
				</p>
			</PixelCardHeader>

			<PixelCardContent className="flex flex-col gap-4">
				{/* Stats row */}
				<div className="grid grid-cols-2 gap-3">
					<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-black p-3 text-center">
						<div className="text-2xl font-bold text-black">{weekData.completedWorkouts}</div>
						<div className="text-xs text-black/60">Workouts/Habits</div>
					</div>
					<div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 border-2 border-black dark:border-white/20 p-3 text-center">
						<div className="text-2xl font-bold text-black dark:text-white flex items-center justify-center gap-1">
							{weekData.streak}
							{weekData.streak > 0 && <Flame className="h-5 w-5 text-orange-500" />}
						</div>
						<div className="text-xs text-black/60 dark:text-white/60">Day Streak</div>
					</div>
				</div>

				{/* Weekly goal progress */}
				<div>
					<div className="flex items-center justify-between text-sm mb-1">
						<span className="text-black/60 dark:text-white/60">Weekly Goal</span>
						<span className="font-medium text-black dark:text-white">
							{weekData.completedWorkouts}/{weeklyGoal}
						</span>
					</div>
					<div className="h-3 w-full bg-black/10 border-2 border-black overflow-hidden">
						<div
							className="h-full bg-amber-400 transition-all duration-300"
							style={{ width: `${goalProgress}%` }}
						/>
					</div>
				</div>

				{/* Day indicators */}
				<div className="flex justify-between gap-1 mt-auto">
					{weekData.dayStatus.map((day) => (
						<div key={day.day} className="flex flex-col items-center gap-1">
							<span className="text-[10px] text-black/50 dark:text-white/50 font-medium">
								{day.day}
							</span>
							<div
								className={`w-7 h-7 border-2 flex items-center justify-center text-xs transition-colors ${
									day.completed
										? 'bg-emerald-500 border-black text-white'
										: day.isToday
											? 'bg-amber-100 border-amber-500'
											: day.scheduled
												? 'bg-sky-100 border-black/30'
												: 'bg-white/50 border-black/20'
								}`}
							>
								{day.completed && <span className="font-bold">✓</span>}
							</div>
						</div>
					))}
				</div>
			</PixelCardContent>
		</PixelCard>
	);
}
