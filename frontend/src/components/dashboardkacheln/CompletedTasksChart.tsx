import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface ChartData {
	week: string;
	tasks: number;
}

interface CompletedTasksChartProps {
	data: ChartData[];
}

export function CompletedTasksChart({ data }: CompletedTasksChartProps) {
	const chartConfig = {
		tasks: {
			label: 'Tasks',
			color: 'var(--color-primary)',
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Completed Tasks</CardTitle>
				<CardDescription>Last 4 weeks</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart data={data} margin={{ left: 12, right: 12 }}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Area
							dataKey="tasks"
							type="monotone"
							fill="var(--color-tasks)"
							fillOpacity={0.4}
							stroke="var(--color-tasks)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
