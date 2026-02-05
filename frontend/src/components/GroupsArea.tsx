'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { Users, KeyRound } from 'lucide-react';
import GroupList from './groups/GroupList';
import CreateGroupModal from './groups/CreateGroupModal';
import GroupDetailModal from './groups/GroupDetailModal';
import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

// Pixel-style icon
function PixelUsersIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="3" y="2" width="4" height="4" />
			<rect x="9" y="2" width="4" height="4" />
			<rect x="2" y="7" width="6" height="2" />
			<rect x="8" y="7" width="6" height="2" />
			<rect x="1" y="9" width="2" height="5" />
			<rect x="7" y="9" width="2" height="5" />
			<rect x="13" y="9" width="2" height="5" />
			<rect x="3" y="12" width="4" height="2" />
			<rect x="9" y="12" width="4" height="2" />
		</svg>
	);
}

export default function GroupsArea() {
	const { user, getAccessTokenSilently } = useAuth0();
	const [myGroups, setMyGroups] = useState<any[]>([]);
	const [publicGroups, setPublicGroups] = useState<any[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false);
	const [joinCode, setJoinCode] = useState('');
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user?.sub) {
			fetchGroups();
		}
	}, [user]);

	const fetchGroups = async () => {
		try {
			const token = await getAccessTokenSilently();
			// Fetch user's groups
			const myGroupsRes = await fetch(
				`http://localhost:3000/api/groups/user/${encodeURIComponent(user?.sub || '')}`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			let userGroups: any[] = [];
			if (myGroupsRes.ok) {
				userGroups = await myGroupsRes.json();
				setMyGroups(userGroups);
			}

			// Fetch public groups
			const publicRes = await fetch(`http://localhost:3000/api/groups/public?limit=20`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (publicRes.ok) {
				const data = await publicRes.json();
				// Filter uses local userGroups, not stale state
				const userGroupIds = userGroups.map((g) => g._id);
				setPublicGroups(data.filter((g: any) => !userGroupIds.includes(g._id)));
			}
		} catch (error) {
			console.error('Failed to fetch groups:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateGroup = async (groupData: {
		name: string;
		description?: string;
		color: string;
		isPublic: boolean;
	}) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch('http://localhost:3000/api/groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({
					...groupData,
					ownerId: user?.sub,
				}),
			});

			if (res.ok) {
				setIsCreateModalOpen(false);
				toast.success('Group created!');
				fetchGroups();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to create group');
			}
		} catch (error) {
			console.error('Failed to create group:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleJoinGroup = async (groupId: string) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId: user?.sub }),
			});

			if (res.ok) {
				toast.success('Joined group!');
				fetchGroups();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to join group');
			}
		} catch (error) {
			console.error('Failed to join group:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleLeaveGroup = async (groupId: string) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}/leave`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId: user?.sub }),
			});

			if (res.ok) {
				toast.success('Left group');
				fetchGroups();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to leave group');
			}
		} catch (error) {
			console.error('Failed to leave group:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleGroupClick = (group: any) => {
		setSelectedGroup(group);
	};

	const handleGroupUpdate = (updatedGroup: any) => {
		setMyGroups((prev) => prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
		setPublicGroups((prev) => prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
		setSelectedGroup(updatedGroup);
	};

	const handleDeleteGroup = async (groupId: string) => {
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId: user?.sub }),
			});

			if (res.ok) {
				toast.success('Group deleted');
				setSelectedGroup(null);
				fetchGroups();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to delete group');
			}
		} catch (error) {
			console.error('Failed to delete group:', error);
			toast.error('Network error - please try again');
		}
	};

	const handleJoinByCode = async () => {
		if (!joinCode.trim()) {
			toast.error('Please enter an invite code');
			return;
		}
		try {
			const token = await getAccessTokenSilently();
			const res = await fetch('http://localhost:3000/api/groups/join-by-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId: user?.sub, inviteCode: joinCode.trim() }),
			});

			if (res.ok) {
				toast.success('Joined group!');
				setIsJoinCodeModalOpen(false);
				setJoinCode('');
				fetchGroups();
			} else {
				const errorData = await res.json();
				toast.error(errorData.error || 'Failed to join group');
			}
		} catch (error) {
			console.error('Failed to join by code:', error);
			toast.error('Network error - please try again');
		}
	};

	if (loading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="flex items-center gap-3">
					<div className="h-4 w-4 bg-violet-500 border border-black dark:border-white/30 animate-pulse" />
					<span className="text-sm text-black/50 dark:text-white/50">Loading groups...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col gap-4 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between pt-2">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 bg-violet-500 border-3 border-black flex items-center justify-center">
						<PixelUsersIcon className="h-5 w-5 text-white" />
					</div>
					<h1 className="font-pixel text-2xl text-black dark:text-white">Groups</h1>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => setIsJoinCodeModalOpen(true)}
						className="pixel-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
					>
						<KeyRound className="h-4 w-4" />
						Join by Code
					</button>
					<button
						onClick={() => setIsCreateModalOpen(true)}
						className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mr-2"
					>
						<Users className="h-4 w-4" />
						Create Group
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
				{/* My Groups */}
				<PixelCard>
					<PixelCardHeader>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 bg-emerald-500 border-2 border-black" />
							<PixelCardTitle>My Groups</PixelCardTitle>
							<span className="ml-auto text-xs text-black/50 dark:text-white/50 font-medium">
								{myGroups.length} groups
							</span>
						</div>
					</PixelCardHeader>
					<PixelCardContent scrollable>
						<GroupList
							groups={myGroups}
							onJoin={handleJoinGroup}
							onLeave={handleLeaveGroup}
							onClick={handleGroupClick}
							currentUserId={user?.sub}
							showLeaveButton
						/>
					</PixelCardContent>
				</PixelCard>

				{/* Public Groups */}
				<PixelCard>
					<PixelCardHeader>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 bg-sky-500 border-2 border-black" />
							<PixelCardTitle>Public Groups</PixelCardTitle>
							<span className="ml-auto text-xs text-black/50 dark:text-white/50 font-medium">
								{publicGroups.length} groups
							</span>
						</div>
					</PixelCardHeader>
					<PixelCardContent scrollable>
						<GroupList
							groups={publicGroups}
							onJoin={handleJoinGroup}
							onClick={handleGroupClick}
							currentUserId={user?.sub}
							showJoinButton
						/>
					</PixelCardContent>
				</PixelCard>
			</div>

			{/* Create Group Modal */}
			{isCreateModalOpen && (
				<CreateGroupModal
					onClose={() => setIsCreateModalOpen(false)}
					onCreate={handleCreateGroup}
				/>
			)}

			{/* Group Detail Modal */}
			{selectedGroup && (
				<GroupDetailModal
					group={selectedGroup}
					currentUserId={user?.sub}
					onClose={() => setSelectedGroup(null)}
					onGroupUpdate={handleGroupUpdate}
					onDelete={handleDeleteGroup}
				/>
			)}

			{/* Join by Code Modal */}
			{isJoinCodeModalOpen && (
				<Dialog open={true} onOpenChange={(open) => !open && setIsJoinCodeModalOpen(false)}>
					<DialogContent className="sm:max-w-md border-4 border-black bg-white dark:bg-gray-900 text-black dark:text-white">
						<DialogHeader>
							<DialogTitle className="font-pixel text-lg flex items-center gap-2">
								<KeyRound className="h-5 w-5 text-emerald-500" />
								Join by Invite Code
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 mt-4">
							<div>
								<label className="text-sm font-medium mb-2 block">Enter Invite Code</label>
								<input
									type="text"
									value={joinCode}
									onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
									placeholder="e.g. A1B2C3D4"
									className="w-full p-3 border-2 border-black bg-white dark:bg-gray-800 text-black dark:text-white font-mono text-lg tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
									maxLength={8}
								/>
								<p className="text-xs text-black/50 dark:text-white/50 mt-2">
									Get the code from a group owner or admin
								</p>
							</div>
							<div className="flex gap-3">
								<button
									onClick={() => {
										setIsJoinCodeModalOpen(false);
										setJoinCode('');
									}}
									className="flex-1 p-3 border-2 border-black bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
								>
									Cancel
								</button>
								<button
									onClick={handleJoinByCode}
									disabled={!joinCode.trim()}
									className="flex-1 p-3 bg-emerald-500 text-white border-2 border-black hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
								>
									Join Group
								</button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
