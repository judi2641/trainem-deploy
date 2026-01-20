import type { ColumnDef } from '@tanstack/react-table';
import type { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

type TaskWithPlan = ITask & {
	planName: string;
	planId?: string;
};

export const columns: ColumnDef<TaskWithPlan>[] = [
	{
		accessorKey: 'title',
		header: 'Task',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'difficulty',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Difficulty
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'planName',
		header: 'Plan',
	},
];
