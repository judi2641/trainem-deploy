'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import BattleList from './battles/BattleList';
import ChallengeModal from './battles/ChallengeModal';
import PendingChallenges from './battles/PendingChallenges';
import BattleArena from './battles/BattleArena';
import type { Battle, Group } from '../../../../shared/sharedTypes';

export default function PixelWarsArea() {
	const { user } = useAuth0();
	const [battles, setBattles] = useState<Battle[]>([]);
	const [pendingChallenges, setPendingChallenges] = useState<Battle[]>([]);
	const [myGroups, setMyGroups] = useState<Group[]>([]);
	const [publicGroups, setPublicGroups] = useState<Group[]>([]);
	const [loading, setLoading] = useState(true);
	const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
	const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
	const [view, setView] = useState<'list' | 'arena'>('list');

	useEffect(() => {
		if (user?.sub) {
			fetchData();
		}
	}, [user]);

	const fetchData = async () => {
		try {
			// Fetch user's battles
			const battlesRes = await fetch(`http://localhost:3000/api/pixelwar/battles?userId=${encodeURIComponent(user?.sub || '')}`);
			if (battlesRes.ok) {
				const data = await battlesRes.json();
				setBattles(data);
			}

			// Fetch pending challenges
			const pendingRes = await fetch(`http://localhost:3000/api/pixelwar/battles/pending?userId=${encodeURIComponent(user?.sub || '')}`);
			if (pendingRes.ok) {
				const data = await pendingRes.json();
				setPendingChallenges(data);
			}

			// Fetch user's groups
			const groupsRes = await fetch(`http://localhost:3000/api/groups/user/${encodeURIComponent(user?.sub || '')}`);
			if (groupsRes.ok) {
				const data = await groupsRes.json();
				setMyGroups(data);
			}

			// Fetch public groups for challenging
			const publicRes = await fetch(`http://localhost:3000/api/groups/public?limit=50`);
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
			const res = await fetch('http://localhost:3000/api/pixelwar/battles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...data,
					challengerUserId: user?.sub,
				}),
			});

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
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battleId}/accept`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: user?.sub }),
			});

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
			const res = await fetch(`http://localhost:3000/api/pixelwar/battles/${battleId}/decline`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: user?.sub }),
			});

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

	const handleSelectBattle = (battle: Battle) => {
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
				<div className="text-gray-600">Loading battles...</div>
			</div>
		);
	}

	// Show Battle Arena if a battle is selected
	if (view === 'arena' && selectedBattle) {
		return (
			<BattleArena
				battle={selectedBattle}
				userId={user?.sub || ''}
				onBack={handleBackToList}
			/>
		);
	}

	const activeBattles = battles.filter((b) => b.status === 'active');
	const completedBattles = battles.filter((b) => b.status === 'completed');

	return (
		<div className="h-full flex flex-col gap-4 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-800">Pixel Wars</h1>
					<p className="text-gray-600">Challenge other groups to epic pixel battles!</p>
				</div>
				<button
					onClick={() => setIsChallengeModalOpen(true)}
					className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
					disabled={myGroups.length === 0}
				>
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

			{/* Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
				{/* Active Battles */}
				<div className="flex flex-col gap-3 overflow-hidden">
					<h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
						<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
						Active Battles
					</h2>
					<BattleList
						battles={activeBattles}
						onSelect={handleSelectBattle}
						emptyMessage="No active battles. Challenge a group!"
					/>
				</div>

				{/* Completed Battles */}
				<div className="flex flex-col gap-3 overflow-hidden">
					<h2 className="text-xl font-semibold text-gray-700">Battle History</h2>
					<BattleList
						battles={completedBattles}
						onSelect={handleSelectBattle}
						emptyMessage="No completed battles yet."
					/>
				</div>
			</div>

			{/* Challenge Modal */}
			{isChallengeModalOpen && (
				<ChallengeModal
					myGroups={myGroups}
					targetGroups={publicGroups.filter(
						(g) => !myGroups.find((mg) => mg._id === g._id)
					)}
					onClose={() => setIsChallengeModalOpen(false)}
					onChallenge={handleCreateChallenge}
				/>
			)}
		</div>
	);
}
