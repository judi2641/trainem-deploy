import { useState } from 'react';

type FaqPopupProps = {
	title: string;
	items: string[];
};

export default function FaqPopup({ title, items }: FaqPopupProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative">
			<button
				onClick={() => setOpen(true)}
				className="bg-white border border-gray-200 shadow-sm px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
			>
				FAQ
			</button>

			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
					<div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
						<div className="flex items-start justify-between mb-4">
							<h3 className="text-lg font-semibold">{title}</h3>
							<button
								onClick={() => setOpen(false)}
								className="text-gray-500 hover:text-gray-700"
								aria-label="Close"
							>
								✕
							</button>
						</div>
						<ul className="space-y-2 text-sm text-gray-700">
							{items.map((item, idx) => (
								<li key={idx} className="leading-relaxed">
									• {item}
								</li>
							))}
						</ul>
						<div className="mt-5 flex justify-end">
							<button
								onClick={() => setOpen(false)}
								className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
							>
								Schließen
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
