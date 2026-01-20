import type { IUser } from '../../../../shared/types/database/user/User';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Progress } from '@/components/ui/progress';
interface AvatarProps {
	user?: IUser;
	todayExp: number;
	streak: number;
}
export default function Avatar({ user, todayExp, streak }: AvatarProps) {
	return (
		<div className="h-full">
			<Card className="h-full">
				<CardContent className=" flex flex-col justify-between h-full">
					<div className="flex flex-col m-6">
						<h1 className="text-4xl font-bold text-center mb-2">
							Level {Math.min(14, Math.floor((user?.score ?? 0) / 100) + 1)}
						</h1>
						<div className="flex justify-center items-center pb-6">
							{user?.img ? (
								<img src={user.img} className="w-40 h-50 object-contain object-center" />
							) : (
								<div className="w-40 h-40 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
									No pixel art yet
								</div>
							)}
						</div>

						<div className="flex justify-between mb-2">
							<span className="font-semibold">Experience</span>
							<span className="text-gray-500">{(user?.score ?? 0) % 100}/100</span>
						</div>
						<Progress value={(user?.score ?? 0) % 100}></Progress>
					</div>
					<div className="grid grid-cols-2 gap-4 mb-4">
						<Card>
							<CardContent className="p-4 text-center">
								<p className="text-gray-500 mb-2">Today</p>
								<p className="text-foreground">{todayExp}</p>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4 text-center">
								<p className="text-gray-500 mb-2">Streak</p>
								<p className="text-foreground">{streak > 0 ? `${streak}🔥` : '0'}</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardContent className="p-4 text-center">
							<p className="text-gray-500 mb-2">Total XP</p>
							<p className="text-foreground">{user?.score}</p>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
		</div>
	);
}
