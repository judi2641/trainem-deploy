'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import GroupList from './groups/GroupList';
import CreateGroupModal from './groups/CreateGroupModal';
import type { Group } from '../../../shared/sharedTypes';

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
			const myGroupsRes = await fetch(`http://localhost:3000/api/groups/user/${encodeURIComponent(user?.sub || '')}`);
			if (myGroupsRes.ok) {
				const data = await myGroupsRes.json();
				setMyGroups(data);
			}

			// Fetch public groups
			const publicRes = await fetch(`http://localhost:3000/api/groups/public?limit=20`);
			if (publicRes.ok) {
				const data = await publicRes.json();
				setPublicGroups(data.filter((g: Group) => !myGroups.find(mg => mg._id === g._id)));
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
					ownerId: user?.sub
				})
			});

			if (res.ok) {
				setIsCreateModalOpen(false);
				fetchGroups();
			}
		} catch (error) {
			console.error('Failed to create group:', error);
		}
	};

	const handleJoinGroup = async (groupId: string) => {
		try {
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: user?.sub })
			});

			if (res.ok) {
				fetchGroups();
			}
		} catch (error) {
			console.error('Failed to join group:', error);
		}
	};

	const handleLeaveGroup = async (groupId: string) => {
		try {
			const res = await fetch(`http://localhost:3000/api/groups/${groupId}/leave`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: user?.sub })
			});

			if (res.ok) {
				fetchGroups();
			}
		} catch (error) {
			console.error('Failed to leave group:', error);
		}
	};

	if (loading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="text-gray-600">Loading groups...</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col gap-4 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-800">Groups</h1>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
				>
					Create Group
				</button>
			</div>

			{/* Content */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
				{/* My Groups */}
				<div className="flex flex-col gap-3 overflow-hidden">
					<h2 className="text-xl font-semibold text-gray-700">My Groups</h2>
					<GroupList
						groups={myGroups}
						onJoin={handleJoinGroup}
						onLeave={handleLeaveGroup}
						currentUserId={user?.sub}
						showLeaveButton
					/>
				</div>

				{/* Public Groups */}
				<div className="flex flex-col gap-3 overflow-hidden">
					<h2 className="text-xl font-semibold text-gray-700">Public Groups</h2>
					<GroupList
						groups={publicGroups}
						onJoin={handleJoinGroup}
						currentUserId={user?.sub}
						showJoinButton
					/>
				</div>
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
