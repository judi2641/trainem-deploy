import {
	type ColumnDef,
	flexRender,
	type ColumnFiltersState,
	getFilteredRowModel,
	type SortingState,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState, type FormEvent } from 'react';
import { stringToColor } from '@/util/stringToColor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [planName, setPlanName] = useState('');
	const [planCat, setPlanCat] = useState('');
	const { user } = useAuth0();
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			columnFilters,
			sorting,
		},
	});

	const uniquePlans = Array.from(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		new Set(data.map((row: any) => row.planName).filter(Boolean)),
	).sort();
	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (user?.sub) {
			try {
				const response = await fetch(
					`http://localhost:3000/api/trainingsplan/createempty/${encodeURIComponent(user.sub)}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ name: planName, category: 'default' }),
					},
				);

				if (response.ok) {
					setPlanName('');
					setPlanCat('');

					toast.success('Plan has been created');
				} else {
					toast.error('Plan has not been created');
				}
			} catch (error) {
				console.error('Netzwerkfehler:', error);
			}
		}
	};
	return (
		<div>
			<div className="flex items-center justify-between py-4">
				<Select
					value={(table.getColumn('planName')?.getFilterValue() as string) ?? 'all'}
					onValueChange={(value) => {
						table.getColumn('planName')?.setFilterValue(value === 'all' ? '' : value);
					}}
				>
					<SelectTrigger className="max-w-60">
						<SelectValue placeholder="Filter nach Plan..." />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">all</SelectItem>
						{uniquePlans.map((plan) => (
							<SelectItem key={plan} value={plan}>
								{plan}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Popover>
					<PopoverTrigger asChild>
						<Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
							<Plus className="h-4 w-4 mr-1" />
							Add Plan
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-96">
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label>Name</Label>
									<Input
										id="planName"
										name="planName"
										onChange={(e) => setPlanName(e.target.value)}
									/>
								</div>
								{/* <div className="grid gap-3">
									<Label>Category</Label>
									<Input
										id="planCategory"
										name="planCategory"
										onChange={(e) => setPlanCat(e.target.value)}
									/>
								</div> */}
							</div>
							<div className="flex justify-end gap-2 mt-3">
								<Button type="submit" size="sm">
									Save plan
								</Button>
							</div>
						</form>
					</PopoverContent>
				</Popover>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table className="table-fixed w-full ">
					<TableHeader className="text-md">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="text-md">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={cn(stringToColor(row.original.planName))}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className=" flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
