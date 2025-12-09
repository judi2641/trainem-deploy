import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
export const description = 'A stacked area chart';

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
	mobile: {
		label: 'Completed',
		color: 'var(--chart-2)',
	},
	desktop: {
		label: 'Planned',
		color: 'var(--chart-1)',
	},
} satisfies ChartConfig;
export default function CompletedTasksChart() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Completed Tasks</CardTitle>
				<CardDescription>Shows how many tasks you completed and </CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 6,
							right: 6,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
						<Area
							dataKey="mobile"
							type="natural"
							fill="var(--color-mobile)"
							fillOpacity={0.4}
							stroke="var(--color-mobile)"
							stackId="a"
						/>
						<Area
							dataKey="desktop"
							type="natural"
							fill="var(--color-desktop)"
							fillOpacity={0.4}
							stroke="var(--color-desktop)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="text-muted-foreground flex items-center gap-2 leading-none">
							January - June 2024
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
