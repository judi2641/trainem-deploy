'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import GroupList from './groups/GroupList';
import CreateGroupModal from './groups/CreateGroupModal';
import {
	PixelCard,
	PixelCardContent,
	PixelCardHeader,
	PixelCardTitle,
} from '@/components/ui/pixel-card';
import type { Group } from '../../../shared/sharedTypes';

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
	const { user } = useAuth0();
	const [myGroups, setMyGroups] = useState<Group[]>([]);
	const [publicGroups, setPublicGroups] = useState<Group[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user?.sub) {
			fetchGroups();
		}
	}, [user]);

	const fetchGroups = async () => {
		try {
			// Fetch user's groups
			const myGroupsRes = await fetch(
				`http://localhost:3000/api/groups/user/${encodeURIComponent(user?.sub || '')}`
			);
			let userGroups: Group[] = [];
			if (myGroupsRes.ok) {
				userGroups = await myGroupsRes.json();
				setMyGroups(userGroups);
			}

			// Fetch public groups
			const publicRes = await fetch(`http://localhost:3000/api/groups/public?limit=20`);
			if (publicRes.ok) {
				const data = await publicRes.json();
				// Filter uses local userGroups, not stale state
				const userGroupIds = userGroups.map((g) => g._id);
				setPublicGroups(data.filter((g: Group) => !userGroupIds.includes(g._id)));
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
			const res = await fetch('http://localhost:3000/api/groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}/leave`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 bg-violet-500 border-3 border-black flex items-center justify-center">
						<PixelUsersIcon className="h-5 w-5 text-white" />
					</div>
					<h1 className="font-pixel text-2xl text-black dark:text-white">Groups</h1>
				</div>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className="pixel-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
				>
					<Users className="h-4 w-4" />
					Create Group
				</button>
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
		</div>
	);
}
