import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import type { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { Button } from '../ui/button';

interface TodayTaskProps {
	tasks: (ITask & { planName: string })[];
}

export default function TodaysTask({ tasks }: TodayTaskProps) {
	const navigate = useNavigate();
	return (
		<Card className="h-full overflow-auto ">
			<CardHeader className="p-3 sticky top-0 bg-white shadow-md rounded-xl">
				<div className="flex items-center justify-between">
					<CardTitle>Todays tasks</CardTitle>
					<Button
						className="text-primary hover:bg-primary/10"
						variant="ghost"
						size="sm"
						onClick={() => navigate('/tasks')}
					>
						View All Tasks
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{/* Task Item */}
				{tasks.map((task) => (
					<div
						key={task._id}
						className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
					>
						<Checkbox id={task._id} />
						<label htmlFor={task._id} className="flex-1 cursor-pointer">
							<p className="font-medium">{task.title}</p>
							<p className="text-sm text-gray-600">{task.description}</p>
						</label>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
