'use client';

import { useState, useMemo } from 'react';
import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useMyContext } from '@/context/AppContext';
import { useAuth0 } from '@auth0/auth0-react';

const WEEKDAYS = [
	{ value: 0, label: 'Sunday' },
	{ value: 1, label: 'Monday' },
	{ value: 2, label: 'Tuesday' },
	{ value: 3, label: 'Wednesday' },
	{ value: 4, label: 'Thursday' },
	{ value: 5, label: 'Friday' },
	{ value: 6, label: 'Saturday' },
];

// Pixel-style icons
function PlusIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 16 16" fill="currentColor">
			<rect x="7" y="3" width="2" height="10" />
			<rect x="3" y="7" width="10" height="2" />
		</svg>
	);
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 16 16" fill="currentColor">
			<rect x="3" y="8" width="2" height="2" />
			<rect x="5" y="10" width="2" height="2" />
			<rect x="7" y="8" width="2" height="2" />
			<rect x="9" y="6" width="2" height="2" />
			<rect x="11" y="4" width="2" height="2" />
		</svg>
	);
}

function SunIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 16 16" fill="currentColor">
			<rect x="7" y="1" width="2" height="2" />
			<rect x="7" y="13" width="2" height="2" />
			<rect x="1" y="7" width="2" height="2" />
			<rect x="13" y="7" width="2" height="2" />
			<rect x="6" y="6" width="4" height="4" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="11" y="11" width="2" height="2" />
		</svg>
	);
}

function CalendarIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 16 16" fill="currentColor">
			<rect x="2" y="3" width="12" height="2" />
			<rect x="2" y="3" width="2" height="11" />
			<rect x="12" y="3" width="2" height="11" />
			<rect x="2" y="12" width="12" height="2" />
			<rect x="4" y="1" width="2" height="3" />
			<rect x="10" y="1" width="2" height="3" />
			<rect x="5" y="7" width="2" height="2" />
			<rect x="9" y="7" width="2" height="2" />
			<rect x="5" y="10" width="2" height="2" />
		</svg>
	);
}

function TrashIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 16 16" fill="currentColor">
			<rect x="3" y="3" width="10" height="2" />
			<rect x="6" y="1" width="4" height="2" />
			<rect x="4" y="5" width="2" height="9" />
			<rect x="7" y="5" width="2" height="9" />
			<rect x="10" y="5" width="2" height="9" />
			<rect x="4" y="13" width="8" height="1" />
		</svg>
	);
}

export default function HabitsArea() {
	const { myUser, habits, setHabits, entries } = useMyContext();
	const { getAccessTokenSilently } = useAuth0();
	const auth0Id = myUser?.auth0Id;

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newHabitName, setNewHabitName] = useState('');
	const [newHabitType, setNewHabitType] = useState<'daily' | 'weekly'>('daily');
	const [newHabitDescription, setNewHabitDescription] = useState('');
	const [newHabitWeekday, setNewHabitWeekday] = useState<number>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dailyHabits = useMemo(() => habits.filter((h: any) => h.type === 'daily'), [habits]);
	const weeklyHabits = useMemo(() => habits.filter((h: any) => h.type === 'weekly'), [habits]);

	// Check which habits are completed today
	const todayStr = new Date().toISOString().split('T')[0];
	const completedHabitIds = useMemo(() => {
		return entries
			.filter((e: any) => e.habitId && e.date?.startsWith(todayStr) && e.completed)
			.map((e: any) => e.habitId);
	}, [entries, todayStr]);

	async function createHabit() {
		if (!auth0Id || !newHabitName.trim()) {
			toast.error('Please enter a habit name');
			return;
		}

		setIsSubmitting(true);
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch('http://localhost:3000/api/habits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({
					auth0Id,
					name: newHabitName.trim(),
					type: newHabitType,
					description: newHabitDescription.trim() || undefined,
					weekday: newHabitType === 'weekly' ? newHabitWeekday : undefined,
				}),
			});

			if (!res.ok) {
				throw new Error('Failed to create habit');
			}

			const newHabit = await res.json();
			setHabits((prev: any[]) => [...prev, newHabit]);
			setNewHabitName('');
			setNewHabitDescription('');
			setNewHabitType('daily');
			setNewHabitWeekday(1);
			setCreateDialogOpen(false);
			toast.success('Habit created!');
		} catch (err) {
			toast.error('Failed to create habit');
		} finally {
			setIsSubmitting(false);
		}
	}

	async function deleteHabit(habitId: string) {
		if (!confirm('Are you sure you want to delete this habit?')) return;

		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/habits/${habitId}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ auth0Id }),
			});

			if (!res.ok) {
				throw new Error('Failed to delete habit');
			}

			setHabits((prev: any[]) => prev.filter((h) => h._id !== habitId));
			toast.success('Habit deleted');
		} catch (err) {
			toast.error('Failed to delete habit');
		}
	}

	// Get today's weekday (0 = Sunday, 1 = Monday, etc.)
	const today = new Date().getDay();

	return (
		<div className="h-full flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 bg-pink-400 border-3 border-black flex items-center justify-center">
						<CheckIcon className="h-5 w-5 text-white" />
					</div>
					<h1 className="font-pixel text-2xl text-black dark:text-white">Habits</h1>
				</div>

				<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
					<DialogTrigger asChild>
						<button className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
							<PlusIcon className="h-4 w-4" />
							New Habit
						</button>
					</DialogTrigger>
					<DialogContent className="border-3 border-black bg-white text-black">
						<DialogHeader>
							<DialogTitle className="font-pixel text-lg">Create New Habit</DialogTitle>
							<DialogDescription>
								Add a daily or weekly habit to track your progress.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 mt-4">
							<div className="space-y-2">
								<Label className="font-medium">Habit Name</Label>
								<Input
									value={newHabitName}
									onChange={(e) => setNewHabitName(e.target.value)}
									placeholder="e.g. Drink 2L water"
									className="border-2 border-black"
								/>
							</div>

							<div className="space-y-2">
								<Label className="font-medium">Type</Label>
								<Select
									value={newHabitType}
									onValueChange={(v: 'daily' | 'weekly') => setNewHabitType(v)}
								>
									<SelectTrigger className="border-2 border-black">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="daily">
											<div className="flex items-center gap-2">
												<SunIcon className="h-4 w-4" />
												<span>Daily</span>
											</div>
										</SelectItem>
										<SelectItem value="weekly">
											<div className="flex items-center gap-2">
												<CalendarIcon className="h-4 w-4" />
												<span>Weekly</span>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{newHabitType === 'weekly' && (
								<div className="space-y-2">
									<Label className="font-medium">Weekday</Label>
									<Select
										value={newHabitWeekday.toString()}
										onValueChange={(v) => setNewHabitWeekday(parseInt(v))}
									>
										<SelectTrigger className="border-2 border-black">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{WEEKDAYS.map((day) => (
												<SelectItem key={day.value} value={day.value.toString()}>
													{day.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							<div className="space-y-2">
								<Label className="font-medium">Description (optional)</Label>
								<Input
									value={newHabitDescription}
									onChange={(e) => setNewHabitDescription(e.target.value)}
									placeholder="Add a note..."
									className="border-2 border-black"
								/>
							</div>

							<button
								onClick={createHabit}
								disabled={isSubmitting || !newHabitName.trim()}
								className="pixel-btn w-full p-2"
							>
								{isSubmitting ? 'Creating...' : 'Create Habit'}
							</button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Habits Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Daily Habits */}
				<PixelCard>
					<PixelCardHeader>
						<div className="flex items-center gap-2">
							<div className="h-5 w-5 bg-amber-400 border-2 border-black flex items-center justify-center">
								<SunIcon className="h-3 w-3 text-black" />
							</div>
							<PixelCardTitle>Daily Habits</PixelCardTitle>
							<span className="ml-auto text-xs text-black/50 dark:text-white/50 font-medium">
								{dailyHabits.length} habits
							</span>
						</div>
					</PixelCardHeader>

					<PixelCardContent>
						{dailyHabits.length === 0 ? (
							<div className="h-40 flex items-center justify-center">
								<div className="text-center">
									<SunIcon className="h-10 w-10 text-black/20 dark:text-white/20 mx-auto mb-2" />
									<p className="text-sm text-black/50 dark:text-white/50">No daily habits yet</p>
									<p className="text-xs text-black/40 dark:text-white/40 mt-1">
										Create one to get started!
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								{dailyHabits.map((habit: any) => (
									<HabitItem
										key={habit._id}
										habit={habit}
										onDelete={() => deleteHabit(habit._id)}
										isToday={true}
										isCompleted={completedHabitIds.includes(habit._id)}
									/>
								))}
							</div>
						)}
					</PixelCardContent>
				</PixelCard>

				{/* Weekly Habits */}
				<PixelCard>
					<PixelCardHeader>
						<div className="flex items-center gap-2">
							<div className="h-5 w-5 bg-sky-400 border-2 border-black flex items-center justify-center">
								<CalendarIcon className="h-3 w-3 text-black" />
							</div>
							<PixelCardTitle>Weekly Habits</PixelCardTitle>
							<span className="ml-auto text-xs text-black/50 dark:text-white/50 font-medium">
								{weeklyHabits.length} habits
							</span>
						</div>
					</PixelCardHeader>

					<PixelCardContent>
						{weeklyHabits.length === 0 ? (
							<div className="h-40 flex items-center justify-center">
								<div className="text-center">
									<CalendarIcon className="h-10 w-10 text-black/20 dark:text-white/20 mx-auto mb-2" />
									<p className="text-sm text-black/50 dark:text-white/50">No weekly habits yet</p>
									<p className="text-xs text-black/40 dark:text-white/40 mt-1">
										Create one to get started!
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								{weeklyHabits.map((habit: any) => (
									<HabitItem
										key={habit._id}
										habit={habit}
										onDelete={() => deleteHabit(habit._id)}
										isToday={habit.weekday === today}
										isCompleted={completedHabitIds.includes(habit._id)}
									/>
								))}
							</div>
						)}
					</PixelCardContent>
				</PixelCard>
			</div>
		</div>
	);
}

function HabitItem({
	habit,
	onDelete,
	isToday,
	isCompleted,
}: {
	habit: any;
	onDelete: () => void;
	isToday: boolean;
	isCompleted: boolean;
}) {
	return (
		<div
			className={`flex items-center gap-3 p-3 border-2 transition-colors ${
				isCompleted
					? 'bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-400'
					: isToday
						? 'bg-gradient-to-r from-emerald-50 to-white border-emerald-300'
						: 'bg-white/50 border-black/20'
			}`}
		>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-black truncate">{habit.name}</span>
				</div>
				{habit.description && (
					<p className="text-xs text-black/50 dark:text-white/50 truncate mt-0.5">
						{habit.description}
					</p>
				)}
				{habit.type === 'weekly' && (
					<p className="text-xs text-black/40 dark:text-white/40 mt-0.5">
						Every {WEEKDAYS.find((d) => d.value === habit.weekday)?.label}
					</p>
				)}
			</div>
			<button
				onClick={onDelete}
				className="p-1.5 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-50 transition-colors"
			>
				<TrashIcon className="h-4 w-4" />
			</button>
		</div>
	);
}
