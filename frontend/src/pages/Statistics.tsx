'use client';

import Sidebar from '../components/Sidebar';
import PixelBackground from '@/components/pixel/PixelBackground';
import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useMemo } from 'react';
import {
	format,
	subDays,
	startOfWeek,
	endOfWeek,
	isWithinInterval,
	differenceInDays,
} from 'date-fns';

// Pixel icons
function TrophyIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="3" y="1" width="10" height="2" />
			<rect x="2" y="3" width="12" height="2" />
			<rect x="1" y="5" width="3" height="3" />
			<rect x="12" y="5" width="3" height="3" />
			<rect x="3" y="5" width="10" height="4" />
			<rect x="4" y="9" width="8" height="2" />
			<rect x="6" y="11" width="4" height="2" />
			<rect x="5" y="13" width="6" height="2" />
		</svg>
	);
}

function FlameIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="2" />
			<rect x="6" y="2" width="4" height="2" />
			<rect x="5" y="4" width="6" height="2" />
			<rect x="4" y="6" width="8" height="2" />
			<rect x="3" y="8" width="10" height="2" />
			<rect x="3" y="10" width="10" height="2" />
			<rect x="4" y="12" width="8" height="2" />
			<rect x="5" y="14" width="6" height="2" />
		</svg>
	);
}

function DumbbellIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="0" y="5" width="2" height="6" />
			<rect x="2" y="6" width="2" height="4" />
			<rect x="4" y="7" width="8" height="2" />
			<rect x="12" y="6" width="2" height="4" />
			<rect x="14" y="5" width="2" height="6" />
		</svg>
	);
}

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

function ChartIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="12" width="3" height="3" />
			<rect x="5" y="8" width="3" height="7" />
			<rect x="9" y="5" width="3" height="10" />
			<rect x="13" y="2" width="3" height="13" />
		</svg>
	);
}

export default function Statistics() {
	const { entries, workouts, habits, exercises } = useMyContext();

	const stats = useMemo(() => {
		const completedEntries = entries?.filter((e: any) => e.completed) ?? [];
		const today = new Date();

		// Total workouts
		const totalWorkouts = completedEntries.length;

		// This week's workouts
		const weekStart = startOfWeek(today, { weekStartsOn: 1 });
		const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
		const thisWeekWorkouts = completedEntries.filter((e: any) =>
			isWithinInterval(new Date(e.date), { start: weekStart, end: weekEnd }),
		).length;

		// Total exercises completed
		const totalExercises = completedEntries.reduce(
			(acc: number, entry: any) => acc + (entry.completed_exercises?.length ?? 0),
			0,
		);

		// Total weight lifted (in kg)
		const totalWeight = completedEntries.reduce((acc: number, entry: any) => {
			const exerciseWeight = (entry.completed_exercises ?? []).reduce((sum: number, ex: any) => {
				const weight = ex.weight ?? 0;
				const sets = ex.sets ?? 1;
				const reps = ex.reps ?? 1;
				return sum + weight * sets * reps;
			}, 0);
			return acc + exerciseWeight;
		}, 0);

		// Streak calculation
		let streak = 0;
		const sortedDates = completedEntries
			.map((e: any) => format(new Date(e.date), 'yyyy-MM-dd'))
			.filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
			.sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

		for (let i = 0; i < sortedDates.length; i++) {
			const expectedDate = format(subDays(today, i), 'yyyy-MM-dd');
			if (sortedDates.includes(expectedDate)) {
				streak++;
			} else if (i > 0) {
				break;
			}
		}

		// Last 7 days activity
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = subDays(today, 6 - i);
			const dateStr = format(date, 'yyyy-MM-dd');
			const hasWorkout = sortedDates.includes(dateStr);
			return {
				day: format(date, 'EEE'),
				date: dateStr,
				hasWorkout,
			};
		});

		// Most used workout
		const workoutCounts: Record<string, number> = {};
		completedEntries.forEach((e: any) => {
			workoutCounts[e.workoutId] = (workoutCounts[e.workoutId] ?? 0) + 1;
		});
		const mostUsedWorkoutId = Object.entries(workoutCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
		const mostUsedWorkout = workouts?.find((w: any) => w._id === mostUsedWorkoutId);

		// Member days
		const firstEntry = completedEntries.sort(
			(a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		)[0];
		const memberDays = firstEntry ? differenceInDays(today, new Date(firstEntry.date)) + 1 : 0;

		return {
			totalWorkouts,
			thisWeekWorkouts,
			totalExercises,
			totalWeight,
			streak,
			last7Days,
			mostUsedWorkout,
			memberDays,
			totalHabits: habits?.length ?? 0,
			totalExerciseTypes: exercises?.length ?? 0,
		};
	}, [entries, workouts, habits, exercises]);

	return (
		<div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Subtle grid */}
			<div
				className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
					backgroundSize: '24px 24px',
				}}
			/>

			{/* Glow effects */}
			<div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-300/30 dark:bg-emerald-500/10 blur-3xl" />
			<div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-amber-300/35 dark:bg-amber-500/10 blur-3xl" />

			{/* Pixel background */}
			<PixelBackground count={100} seed={99} />

			{/* Sidebar */}
			<Sidebar />

			{/* Main content */}
			<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden p-4 pr-6">
				<main className="flex-1 overflow-y-auto">
					{/* Header */}
					<div className="flex items-center gap-3 mb-6">
						<div className="h-6 w-6 bg-sky-400 border-2 border-black" />
						<h1 className="font-pixel text-xl text-black dark:text-white">Statistics</h1>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{/* Total Workouts */}
						<PixelCard>
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-emerald-500 border-2 border-black" />
									<PixelCardTitle>Total Workouts</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex items-center justify-between">
									<span className="font-pixel text-3xl text-emerald-600">
										{stats.totalWorkouts}
									</span>
									<DumbbellIcon className="h-10 w-10 text-emerald-300" />
								</div>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">
									Workouts completed all time
								</p>
							</PixelCardContent>
						</PixelCard>

						{/* Current Streak */}
						<PixelCard>
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-orange-500 border-2 border-black" />
									<PixelCardTitle>Current Streak</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex items-center justify-between">
									<span className="font-pixel text-3xl text-orange-600">{stats.streak}</span>
									<FlameIcon className="h-10 w-10 text-orange-300" />
								</div>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">
									Consecutive workout days
								</p>
							</PixelCardContent>
						</PixelCard>

						{/* This Week */}
						<PixelCard>
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-sky-500 border-2 border-black" />
									<PixelCardTitle>This Week</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex items-center justify-between">
									<span className="font-pixel text-3xl text-sky-600">{stats.thisWeekWorkouts}</span>
									<CalendarIcon className="h-10 w-10 text-sky-300" />
								</div>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">Workouts this week</p>
							</PixelCardContent>
						</PixelCard>

						{/* Total Weight */}
						<PixelCard>
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-purple-500 border-2 border-black" />
									<PixelCardTitle>Weight Lifted</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex items-center justify-between">
									<span className="font-pixel text-2xl text-purple-600">
										{stats.totalWeight > 1000
											? `${(stats.totalWeight / 1000).toFixed(1)}t`
											: `${stats.totalWeight}kg`}
									</span>
									<TrophyIcon className="h-10 w-10 text-purple-300" />
								</div>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">Total weight lifted</p>
							</PixelCardContent>
						</PixelCard>

						{/* Weekly Activity - Spans 2 columns */}
						<PixelCard className="md:col-span-2">
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-amber-500 border-2 border-black" />
									<PixelCardTitle>Last 7 Days</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex justify-between gap-2">
									{stats.last7Days.map((day) => (
										<div key={day.date} className="flex-1 text-center">
											<div className="text-[10px] text-black/50 dark:text-white/50 mb-2 font-medium">
												{day.day}
											</div>
											<div
												className={`h-12 w-full border-2 border-black flex items-end justify-center ${
													day.hasWorkout ? 'bg-emerald-400' : 'bg-black/5'
												}`}
											>
												{day.hasWorkout && (
													<div className="w-full h-full flex items-center justify-center">
														<div className="h-2 w-2 bg-white border border-black" />
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</PixelCardContent>
						</PixelCard>

						{/* Exercises Completed */}
						<PixelCard>
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-pink-500 border-2 border-black" />
									<PixelCardTitle>Exercises</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex items-center justify-between">
									<span className="font-pixel text-3xl text-pink-600">{stats.totalExercises}</span>
									<ChartIcon className="h-10 w-10 text-pink-300" />
								</div>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">
									Total exercises done
								</p>
							</PixelCardContent>
						</PixelCard>

						{/* Member Days */}
						<PixelCard>
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-cyan-500 border-2 border-black" />
									<PixelCardTitle>Member Days</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								<div className="flex items-center justify-between">
									<span className="font-pixel text-3xl text-cyan-600">{stats.memberDays}</span>
									<CalendarIcon className="h-10 w-10 text-cyan-300" />
								</div>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">
									Days since first workout
								</p>
							</PixelCardContent>
						</PixelCard>

						{/* Favorite Workout */}
						<PixelCard className="md:col-span-2">
							<PixelCardHeader>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-rose-500 border-2 border-black" />
									<PixelCardTitle>Favorite Workout</PixelCardTitle>
								</div>
							</PixelCardHeader>
							<PixelCardContent>
								{stats.mostUsedWorkout ? (
									<div className="flex items-center gap-4">
										<div className="h-16 w-16 bg-gradient-to-br from-rose-100 to-amber-100 border-2 border-black flex items-center justify-center">
											<TrophyIcon className="h-8 w-8 text-rose-500" />
										</div>
										<div>
											<p className="font-medium text-black dark:text-white text-lg">
												{stats.mostUsedWorkout.name}
											</p>
											<p className="text-xs text-black/50 dark:text-white/50 mt-1">
												{stats.mostUsedWorkout.exercises?.length ?? 0} exercises
											</p>
										</div>
									</div>
								) : (
									<p className="text-sm text-black/50 dark:text-white/50">
										Complete workouts to see your favorite!
									</p>
								)}
							</PixelCardContent>
						</PixelCard>
					</div>
				</main>
			</div>
		</div>
	);
}
