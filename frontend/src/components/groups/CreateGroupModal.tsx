import { useState } from 'react';

interface CreateGroupModalProps {
	onClose: () => void;
	onCreate: (data: {
		name: string;
		description?: string;
		color: string;
		isPublic: boolean;
	}) => void;
}

const PRESET_COLORS = [
	'#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
	'#98D8C8', '#F7B731', '#5F27CD', '#00D2D3',
	'#FF6348', '#1dd1a1', '#feca57', '#ff9ff3',
];

export default function CreateGroupModal({ onClose, onCreate }: CreateGroupModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [color, setColor] = useState(PRESET_COLORS[0]);
	const [isPublic, setIsPublic] = useState(true);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			onCreate({
				name: name.trim(),
				description: description.trim() || undefined,
				color,
				isPublic
			});
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Group</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Group Name *
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
							placeholder="Enter group name"
							required
							maxLength={50}
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
							placeholder="Enter group description (optional)"
							rows={3}
							maxLength={200}
						/>
					</div>

					{/* Color */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Group Color
						</label>
						<div className="grid grid-cols-6 gap-2">
							{PRESET_COLORS.map((presetColor) => (
								<button
									key={presetColor}
									type="button"
									onClick={() => setColor(presetColor)}
									className={`w-10 h-10 rounded-lg transition-transform hover:scale-110 ${
										color === presetColor ? 'ring-2 ring-gray-800 ring-offset-2' : ''
									}`}
									style={{ backgroundColor: presetColor }}
								/>
							))}
						</div>
					</div>

					{/* Visibility */}
					<div>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={isPublic}
								onChange={(e) => setIsPublic(e.target.checked)}
								className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
							/>
							<span className="text-sm font-medium text-gray-700">
								Make this group public
							</span>
						</label>
						<p className="text-xs text-gray-500 mt-1 ml-6">
							Public groups can be discovered and joined by anyone
						</p>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
						>
							Create Group
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
