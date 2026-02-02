'use client';

import ActiveWorkout from './dashboardkacheln/ActiveWorkout';
import WeeklyProgress from './dashboardkacheln/WeeklyProgress';
import QuickStats from './dashboardkacheln/QuickStats';
import RecentActivity from './dashboardkacheln/RecentActivity';
import PixelCharacter from './dashboardkacheln/PixelCharacter';
import UpcomingHabits from './dashboardkacheln/UpcomingHabits';

export default function DashboardArea() {
	return (
		<div className="h-full flex gap-4 overflow-hidden pr-2">
			{/* Left Column - Active Workout (main focus, takes most space) */}
			<div className="flex-1 max-h-[99%] min-w-0 lg:max-w-[50%]">
				<ActiveWorkout />
			</div>

			{/* Middle Column - Character, Weekly Progress, Recent Activity */}
			<div className="hidden md:flex flex-col gap-4 max-h-[99%] w-[280px] lg:w-[300px] shrink-0">
				{/* Character */}
				<div className="h-[200px] shrink-0">
					<PixelCharacter />
				</div>

				{/* Weekly Progress */}
				<div className="flex-1 h-[220px] min-h-0">
					<WeeklyProgress />
				</div>

				{/* Recent Activity - integrated into middle column */}
				<div className="h-[200px] shrink-0">
					<RecentActivity />
				</div>
			</div>

			{/* Right Column - Stats & Upcoming */}
			<div className="hidden lg:flex flex-col gap-4 w-[200px] shrink-0">
				{/* All Time Stats */}
				<div className="max-h-[70%] shrink-0">
					<QuickStats />
				</div>

				{/* Upcoming */}
				<div className="max-h-[59%] min-h-[59%]">
					<UpcomingHabits />
				</div>
			</div>
		</div>
	);
}
