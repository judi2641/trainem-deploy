import { useState } from 'react';
import { Users } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CreateGroupModalProps {
	onClose: () => void;
	onCreate: (data: {
		name: string;
		description?: string;
		color: string;
		isPublic: boolean;
	}) => void;
}

export default function CreateGroupModal({ onClose, onCreate }: CreateGroupModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isPublic, setIsPublic] = useState(true);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			onCreate({
				name: name.trim(),
				description: description.trim() || undefined,
				color: '#10b981', // Default emerald-500 color
				isPublic,
			});
		}
	};

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-lg border-4 border-black bg-white text-black">
				<DialogHeader>
					<DialogTitle className="font-pixel text-lg flex items-center gap-2">
						<div className="w-6 h-6 bg-violet-500 border-2 border-black flex items-center justify-center">
							<Users className="w-3 h-3 text-white" />
						</div>
						Create New Group
					</DialogTitle>
					<DialogDescription>Create a group to compete in Pixel Wars!</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 mt-4">
					{/* Name */}
					<div className="space-y-2">
						<Label className="font-medium text-sm">Group Name *</Label>
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
							placeholder="Enter group name"
							required
							maxLength={50}
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label className="font-medium text-sm">Description</Label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
							placeholder="Enter group description (optional)"
							rows={3}
							maxLength={200}
						/>
					</div>

					{/* Visibility */}
					<div className="space-y-2">
						<label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-black hover:bg-violet-50 transition-colors">
							<input
								type="checkbox"
								checked={isPublic}
								onChange={(e) => setIsPublic(e.target.checked)}
								className="w-5 h-5 border-2 border-black accent-violet-500"
							/>
							<div>
								<span className="text-sm font-medium text-black">Make this group public</span>
								<p className="text-xs text-black/50 mt-0.5">
									Public groups can be discovered and joined by anyone
								</p>
							</div>
						</label>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 p-3 border-2 border-black bg-white text-black hover:bg-gray-50 transition-colors font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!name.trim()}
							className="flex-1 p-3 bg-violet-500 text-white border-2 border-black hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
						>
							Create Group
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
