'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { Swords } from 'lucide-react';
import BattleList from './battles/BattleList';
import ChallengeModal from './battles/ChallengeModal';
import PendingChallenges from './battles/PendingChallenges';
import BattleArena from './battles/BattleArena';
import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';

// Pixel-style icon
function PixelSwordsIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="1" width="2" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="5" y="5" width="2" height="2" />
			<rect x="7" y="7" width="2" height="2" />
			<rect x="9" y="5" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="13" y="1" width="2" height="2" />
			<rect x="5" y="9" width="2" height="2" />
			<rect x="9" y="9" width="2" height="2" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="11" y="11" width="2" height="2" />
		</svg>
	);
}

export default function PixelWarsArea() {
	const { user, getAccessTokenSilently } = useAuth0();
	const [battles, setBattles] = useState<any[]>([]);
	const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);
	const [myGroups, setMyGroups] = useState<any[]>([]);
	const [publicGroups, setPublicGroups] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
	const [selectedBattle, setSelectedBattle] = useState<any | null>(null);
	const [view, setView] = useState<'list' | 'arena'>('list');

	useEffect(() => {
		if (user?.sub) {
			fetchData();
		}
	}, [user]);

	const fetchData = async () => {
		try {
			const token = await getAccessTokenSilently();
			const battlesRes = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/pixelwar/battles?userId=${encodeURIComponent(user?.sub || '')}`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			if (battlesRes.ok) {
				const data = await battlesRes.json();
				setBattles(data);
			}

			const pendingRes = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/pixelwar/battles/pending?userId=${encodeURIComponent(user?.sub || '')}`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			if (pendingRes.ok) {
				const data = await pendingRes.json();
				setPendingChallenges(data);
			}

			const groupsRes = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/groups/user/${encodeURIComponent(user?.sub || '')}`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			if (groupsRes.ok) {
				const data = await groupsRes.json();
				setMyGroups(data);
			}

			const publicRes = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/groups/public?limit=50`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			if (publicRes.ok) {
				const data = await publicRes.json();
				setPublicGroups(data);
			}
		} catch (error) {
			console.error('Failed to fetch battle data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateChallenge = async (data: {
		challengerGroupId: string;
		opponentGroupId: string;
		name?: string;
		settings?: {
			duration: number;
			gridSize: number;
			winCondition: 'pixels' | 'xp' | 'hybrid';
		};
	}) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(
				'https://trainem-deploy-production.up.railway.app/api/pixelwar/battles',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({
						...data,
						challengerUserId: user?.sub,
					}),
				},
			);

			if (res.ok) {
				setIsChallengeModalOpen(false);
				toast.success('Challenge sent!');
				fetchData();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to create challenge');
			}
		} catch (error) {
			console.error('Failed to create challenge:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleAcceptChallenge = async (battleId: string) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/pixelwar/battles/${battleId}/accept`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({ userId: user?.sub }),
				},
			);

			if (res.ok) {
				toast.success('Challenge accepted! Battle started!');
				fetchData();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to accept challenge');
			}
		} catch (error) {
			console.error('Failed to accept challenge:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleDeclineChallenge = async (battleId: string) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(
				`https://trainem-deploy-production.up.railway.app/api/pixelwar/battles/${battleId}/decline`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({ userId: user?.sub }),
				},
			);

			if (res.ok) {
				toast.success('Challenge declined');
				fetchData();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to decline challenge');
			}
		} catch (error) {
			console.error('Failed to decline challenge:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleSelectBattle = (battle: any) => {
		setSelectedBattle(battle);
		setView('arena');
	};

	const handleBackToList = () => {
		setSelectedBattle(null);
		setView('list');
		fetchData();
	};

	if (loading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="flex items-center gap-3">
					<div className="h-4 w-4 bg-orange-500 border border-black dark:border-white/30 animate-pulse" />
					<span className="text-sm text-black/50 dark:text-white/50">Loading battles...</span>
				</div>
			</div>
		);
	}

	if (view === 'arena' && selectedBattle) {
		return (
			<BattleArena battle={selectedBattle} userId={user?.sub || ''} onBack={handleBackToList} />
		);
	}

	const activeBattles = battles.filter((b) => b.status === 'active');
	const completedBattles = battles.filter((b) => b.status === 'completed');

	return (
		<div className="h-full flex flex-col gap-4 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between pt-2">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 bg-orange-500 border-3 border-black flex items-center justify-center">
						<PixelSwordsIcon className="h-5 w-5 text-white" />
					</div>
					<h1 className="font-pixel text-2xl text-black dark:text-white">Pixel Wars</h1>
				</div>
				<button
					onClick={() => setIsChallengeModalOpen(true)}
					className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mr-2"
					disabled={myGroups.length === 0}
					title={myGroups.length === 0 ? 'Join a group first' : ''}
				>
					<Swords className="h-4 w-4" />
					New Challenge
				</button>
			</div>

			{/* Pending Challenges */}
			{pendingChallenges.length > 0 && (
				<PendingChallenges
					challenges={pendingChallenges}
					onAccept={handleAcceptChallenge}
					onDecline={handleDeclineChallenge}
				/>
			)}

			{/* No Groups Warning */}
			{myGroups.length === 0 && (
				<div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 p-4">
					<p className="text-sm text-amber-800 dark:text-amber-200">
						<span className="font-medium">No groups yet!</span> Join or create a group on the Groups
						page to start battling.
					</p>
				</div>
			)}

			{/* Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
				{/* Active Battles */}
				<PixelCard>
					<PixelCardHeader>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 bg-emerald-500 border-2 border-black animate-pulse" />
							<PixelCardTitle>Active Battles</PixelCardTitle>
							<span className="ml-auto text-xs text-black/50 dark:text-white/50 font-medium">
								{activeBattles.length} battles
							</span>
						</div>
					</PixelCardHeader>
					<PixelCardContent scrollable>
						<BattleList
							battles={activeBattles}
							onSelect={handleSelectBattle}
							emptyMessage="No active battles. Challenge a group!"
						/>
					</PixelCardContent>
				</PixelCard>

				{/* Completed Battles */}
				<PixelCard>
					<PixelCardHeader>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 bg-gray-400 border-2 border-black" />
							<PixelCardTitle>Battle History</PixelCardTitle>
							<span className="ml-auto text-xs text-black/50 dark:text-white/50 font-medium">
								{completedBattles.length} battles
							</span>
						</div>
					</PixelCardHeader>
					<PixelCardContent scrollable>
						<BattleList
							battles={completedBattles}
							onSelect={handleSelectBattle}
							emptyMessage="No completed battles yet."
						/>
					</PixelCardContent>
				</PixelCard>
			</div>

			{/* Challenge Modal */}
			{isChallengeModalOpen && (
				<ChallengeModal
					myGroups={myGroups}
					targetGroups={publicGroups.filter((g) => !myGroups.find((mg) => mg._id === g._id))}
					onClose={() => setIsChallengeModalOpen(false)}
					onChallenge={handleCreateChallenge}
				/>
			)}
		</div>
	);
}
