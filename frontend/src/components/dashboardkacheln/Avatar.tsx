import type { IUser } from '../../../../shared/types/database/user/User';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Progress } from '@/components/ui/progress';
interface AvatarProps {
	user: IUser | undefined;
}
export default function Avatar({ user }: AvatarProps) {
	return (
		<div className="h-full">
			<Card className="h-full">
				<CardContent className=" flex flex-col justify-between h-full">
					<div className="flex flex-col m-6">
						<h1 className="text-4xl font-bold text-center mb-2">Level 1</h1>
						<div className="flex justify-center items-center pb-6">
							<img src={user?.img} className="w-40 h-50 object-contain object-center" />
						</div>

						<div className="flex justify-between mb-2">
							<span className="font-semibold">Experience</span>
							<span className="text-gray-500">10/100 XP</span>
						</div>
						<Progress value={10}></Progress>
					</div>
					<div className="grid grid-cols-2 gap-4 mb-4">
						<Card>
							<CardContent className="p-6 text-center">
								<p className="text-gray-500">Today</p>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6 text-center">
								<p className="text-gray-500 mb-2">Streak</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardContent className="p-6 text-center">
							<p className="text-gray-500">Total XP</p>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
		</div>
	);
}
