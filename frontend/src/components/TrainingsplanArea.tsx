import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { cn } from '@/lib/utils';
import type { ITrainingsplan } from '../../../shared/types/database/traininsplan/TrainingPlan';
import { columns } from './trainingsplan/columns';
import { DataTable } from './trainingsplan/data-table';

const WEEKDAY_OPTIONS = [
	{ value: 'Mon', label: 'Montag' },
	{ value: 'Tue', label: 'Dienstag' },
	{ value: 'Wed', label: 'Mittwoch' },
	{ value: 'Thu', label: 'Donnerstag' },
	{ value: 'Fri', label: 'Freitag' },
	{ value: 'Sat', label: 'Samstag' },
	{ value: 'Sun', label: 'Sonntag' },
];

export default function TrainigsplanArea() {
	const { user } = useAuth0();
	const [trainingsplan, setTrainingsplan] = useState<ITrainingsplan[]>([]);
	const [activeTab, setActiveTab] = useState('Mon');

	//trainigsplan aus datenbank holen
	async function loadTrainingsplan() {
		try {
			if (user?.sub) {
				const res = await fetch(
					`http://localhost:3000/api/trainingsplan/${encodeURIComponent(user.sub)}`,
				);
				const trainingsplanResponse = await res.json();
				setTrainingsplan(trainingsplanResponse);
			}
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		loadTrainingsplan();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);
	const visible = trainingsplan.flatMap((plan) =>
		plan.tasks
			.filter((t) => t.day === activeTab)
			.map((task) => ({
				...task,
				planName: plan.name,
			})),
	);

	return (
		<div className="h-full w-full bg-white shadow-md p-4 rounded-xl ">
			<div className="w-full">
				<div className="">
					<nav className="flex gap-2" aria-label="Weekday navigation">
						{WEEKDAY_OPTIONS.map((day) => (
							<button
								key={day.value}
								onClick={() => setActiveTab(day.value)}
								className={cn(
									'flex-auto  rounded-xl py-2 text-sm font-medium transition-colors border-2 -mb-px',
									activeTab === day.value
										? 'border-primary text-primary shadow-sm'
										: 'border-border text-muted-foreground hover:text-primary hover:border-primary shadow-sm',
								)}
								aria-current={activeTab === day.value ? 'page' : undefined}
							>
								{day.label}
							</button>
						))}
					</nav>
				</div>

				<div>
					{WEEKDAY_OPTIONS.map((day) => (
						<div key={day.value} className={cn(activeTab === day.value ? 'block' : 'hidden')}>
							<DataTable columns={columns} data={visible} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
