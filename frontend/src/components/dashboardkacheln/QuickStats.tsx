'use client';

import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { useMyContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { TrendingUp, Weight, Clock, Target } from 'lucide-react';

export default function QuickStats() {
	const { entries } = useMyContext();

	const stats = useMemo(() => {
		const completedEntries = entries.filter((e: any) => e.completed);

		const totalWorkouts = completedEntries.length;

		const totalExercises = completedEntries.reduce(
			(sum: number, e: any) => sum + (e.completed_exercises?.length ?? 0),
			0,
		);

		let totalWeightLifted = 0;
		completedEntries.forEach((entry: any) => {
			entry.completed_exercises?.forEach((ex: any) => {
				if (ex.weight && ex.sets && ex.reps) {
					totalWeightLifted += ex.weight * ex.sets * ex.reps;
				} else if (ex.weight) {
					totalWeightLifted += ex.weight;
				}
			});
		});

		let totalCardioMinutes = 0;
		completedEntries.forEach((entry: any) => {
			entry.completed_exercises?.forEach((ex: any) => {
				if (ex.duration) {
					totalCardioMinutes += ex.duration / 60;
				}
			});
		});

		return {
			totalWorkouts,
			totalExercises,
			totalWeightLifted: Math.round(totalWeightLifted),
			totalCardioMinutes: Math.round(totalCardioMinutes),
		};
	}, [entries]);

	const statItems = [
		{
			label: 'Workouts/Habits',
			value: stats.totalWorkouts,
			icon: Target,
			bgColor: 'bg-emerald-100',
			iconColor: 'text-emerald-600',
		},
		{
			label: 'Exercises',
			value: stats.totalExercises,
			icon: TrendingUp,
			bgColor: 'bg-sky-100',
			iconColor: 'text-sky-600',
		},
		{
			label: 'Weight',
			value: `${(stats.totalWeightLifted / 1000).toFixed(1)}t`,
			icon: Weight,
			bgColor: 'bg-amber-100',
			iconColor: 'text-amber-600',
		},
		{
			label: 'Cardio',
			value: `${stats.totalCardioMinutes}m`,
			icon: Clock,
			bgColor: 'bg-violet-100',
			iconColor: 'text-violet-600',
		},
	];

	return (
		<PixelCard>
			<PixelCardHeader>
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 bg-amber-400 border-2 border-black" />
					<PixelCardTitle>All Time</PixelCardTitle>
				</div>
			</PixelCardHeader>

			<PixelCardContent>
				<div className="grid grid-cols-2 gap-2 h-full">
					{statItems.map((stat) => (
						<div
							key={stat.label}
							className={`${stat.bgColor} border-2 border-black p-2 flex flex-col items-center justify-center text-center`}
						>
							<stat.icon className={`h-4 w-4 ${stat.iconColor} mb-1`} />
							<div className="text-lg font-bold text-black">{stat.value}</div>
							<div className="text-[10px] text-black/60 leading-tight">{stat.label}</div>
						</div>
					))}
				</div>
			</PixelCardContent>
		</PixelCard>
	);
}
