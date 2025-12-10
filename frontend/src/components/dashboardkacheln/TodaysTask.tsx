import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import type { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAuth0 } from '@auth0/auth0-react';

interface TodayTaskProps {
	tasks: (ITask & { planName: string })[];
	onTaskCompleted: () => void;
}

export default function TodaysTask({ tasks, onTaskCompleted }: TodayTaskProps) {
	const navigate = useNavigate();
	const { user } = useAuth0();
	async function onChecked(taskId: string) {
		try {
			if (user?.sub) {
				const response = await fetch(
					`http://localhost:3000/api/completedTasks/${encodeURIComponent(user.sub)}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: taskId }),
					},
				);
				if (response.ok) {
					toast.success('Task has been completed');
					onTaskCompleted();
				} else {
					toast.error('Task has not been completed');
				}
			}
		} catch (error) {
			console.error('Netzwerkfehler:', error);
		}
	}
	return (
		<Card className=" overflow-auto ">
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
				{tasks.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 space-y-4">
						<p className="text-muted-foreground text-center">No scheduled tasks today</p>
						<Button variant="outline" onClick={() => navigate('/tasks')}>
							Create task for today
						</Button>
					</div>
				) : (
					tasks.map((task) => (
						<div
							key={task._id}
							className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
						>
							<Checkbox id={task._id} onCheckedChange={() => onChecked(task._id!)} />
							<label htmlFor={task._id} className="flex-1 cursor-pointer">
								<p className="font-medium">{task.title}</p>
								<p className="text-sm text-gray-600">{task.description}</p>
							</label>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
