import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import type { ITask } from '../../../../shared/types/database/traininsplan/Task';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAuth0 } from '@auth0/auth0-react';
import type { IUser } from '../../../../shared/types/database/user/User';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import confetti from 'canvas-confetti';

interface TodayTaskProps {
	tasks: (ITask & { planName: string })[];
	onTaskCompleted: () => void;
	trainemUser: IUser | undefined;
}

export default function TodaysTask({ tasks, onTaskCompleted, trainemUser }: TodayTaskProps) {
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
					toast.custom(
						(t) => (
							<div className="bg-white border rounded-lg shadow-lg p-4 flex flex-col gap-2 w-90">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-500" />
									<span className="font-medium">Task completed!</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-sm text-muted-foreground">
										Level {(trainemUser?.score ?? 0) / 100}
									</span>
									<Progress value={(trainemUser?.score ?? 0) % 100} className="h-2" />
								</div>
							</div>
						),
						{
							duration: 4000,
						},
					);
					confetti({
						particleCount: 150,
						spread: 90,
						origin: { y: 0.9 },
					});
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
