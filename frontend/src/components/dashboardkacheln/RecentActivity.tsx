'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, Activity } from 'lucide-react';

export default function RecentActivity() {
	const { entries, workouts, habits } = useMyContext();

	const recentEntries = useMemo(() => {
		return [...entries]
			.filter((e: any) => e.completed || e.aborted)
			.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 7)
			.map((entry: any) => {
				if (entry.workoutId) {
					const workout = workouts.find((w: any) => w._id === entry.workoutId);
					return {
						...entry,
						entryName: workout?.name ?? 'Workout',
					};
				} else {
					const habit = habits.find((h: any) => h._id === entry.habitId);
					return {
						...entry,
						entryName: habit?.name ?? 'Habit',
					};
				}
			});
	}, [entries, workouts]);

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-sky-400 border-2 border-black" />
					<PixelCardTitle>Recent Activity</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent scrollable>
				{recentEntries.length === 0 ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<Activity className="h-6 w-6 text-black/30 dark:text-white/30 mx-auto mb-1" />
							<p className="text-xs text-black/50 dark:text-white/50">No activity</p>
						</div>
					</div>
				) : (
					<div className="space-y-2">
						{recentEntries.slice(0, 3).map((entry: any) => (
							<div
								key={entry._id}
								className={`flex items-center gap-2 p-2 border-2 ${
									entry.completed ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
								}`}
							>
								{entry.completed ? (
									<CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
								) : (
									<XCircle className="h-4 w-4 text-red-500 shrink-0" />
								)}
								<div className="flex-1 min-w-0">
									<div className="text-xs font-medium text-black truncate">{entry.entryName}</div>
									<div className="text-[10px] text-black/50">
										{formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
									</div>
								</div>
								{entry.completed && entry.completed_exercises && (
									<div className="text-[10px] text-emerald-600 font-medium shrink-0">
										{entry.completed_exercises.length} ex
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</PixelCardContent>
		</PixelCard>
	);
}
