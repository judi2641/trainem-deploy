import { useState } from 'react';
import type { FormEvent } from 'react';
import Sidebar from '../components/Sidebar';
import PixelBackground from '@/components/pixel/PixelBackground';

const helpSections = [
	{
		title: 'Tasks basics',
		items: [
			'Create tasks for your plan and check them off as you go.',
			'Use the day overview to see what is due today.',
			'More features are coming—this is the basic version for now.',
		],
	},
	{
		title: 'Training plan basics',
		items: [
			'Set up training plans and structure your week.',
			'Schedule sessions by weekday to keep a clear routine.',
			'Additional options will follow—these tips cover the essentials.',
		],
	},
];

export default function Help() {
	const [status, setStatus] = useState<'idle' | 'sent'>('idle');

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const message = formData.get('message')?.toString() || '';

		const subject = encodeURIComponent('Support Request');
		const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

		window.location.href = `mailto:info@trainem.de?subject=${subject}&body=${body}`;
		setStatus('sent');
	}

	return (
		<div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Subtle grid */}
			<div
				className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
					backgroundSize: '24px 24px',
				}}
			/>

			{/* Glow effects */}
			<div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-300/30 dark:bg-emerald-500/10 blur-3xl" />
			<div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-amber-300/35 dark:bg-amber-500/10 blur-3xl" />

			{/* Pixel background */}
			<PixelBackground count={80} seed={42} />

			<Sidebar />

			<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden p-4 pr-6">
				<main className="flex-1 overflow-y-auto">
					<div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.3fr,1fr] items-start max-w-6xl">
						{/* Contact Form Card */}
						<div className="relative">
							<div className="absolute left-2 top-2 h-full w-full border-4 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />
							<div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur border-4 border-black dark:border-white/20 p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="h-5 w-5 bg-emerald-400 border-2 border-black dark:border-white/30" />
									<h1 className="font-pixel text-xl text-black dark:text-white">Help & Support</h1>
								</div>
								<p className="text-sm text-black/60 dark:text-white/60 mb-6">
									Have suggestions or found an issue? Reach out to support and we will get back to
									you.
								</p>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<label
											className="block text-sm font-medium text-black dark:text-white mb-1"
											htmlFor="name"
										>
											Name
										</label>
										<input
											id="name"
											type="text"
											name="name"
											required
											className="w-full border-2 border-black dark:border-white/20 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
											placeholder="Your name"
										/>
									</div>
									<div>
										<label
											className="block text-sm font-medium text-black dark:text-white mb-1"
											htmlFor="email"
										>
											Email
										</label>
										<input
											id="email"
											type="email"
											name="email"
											required
											className="w-full border-2 border-black dark:border-white/20 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
											placeholder="you@example.com"
										/>
									</div>
									<div>
										<label
											className="block text-sm font-medium text-black dark:text-white mb-1"
											htmlFor="message"
										>
											Message
										</label>
										<textarea
											id="message"
											required
											name="message"
											rows={4}
											className="w-full border-2 border-black dark:border-white/20 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
											placeholder="Describe your idea or the issue you found."
										/>
									</div>
									<div className="flex items-center gap-3">
										<button
											type="submit"
											className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 border-2 border-black dark:border-white/20 font-medium transition-colors"
										>
											Send
										</button>
										{status === 'sent' && (
											<span className="text-sm text-emerald-600 dark:text-emerald-400">
												Thank you! We will reply soon.
											</span>
										)}
									</div>
								</form>
							</div>
						</div>

						{/* FAQ Card */}
						<div className="relative">
							<div className="absolute left-2 top-2 h-full w-full border-4 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />
							<div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur border-4 border-black dark:border-white/20 p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="h-5 w-5 bg-amber-400 border-2 border-black dark:border-white/30" />
									<h2 className="font-pixel text-lg text-black dark:text-white">FAQs</h2>
								</div>
								<p className="text-sm text-black/60 dark:text-white/60 mb-6">
									Quick guidance on working with tasks and training plans.
								</p>
								<div className="space-y-4">
									{helpSections.map((section) => (
										<div
											key={section.title}
											className="bg-black/5 dark:bg-white/5 border-2 border-black/20 dark:border-white/10 p-4"
										>
											<p className="font-medium text-black dark:text-white mb-2">{section.title}</p>
											<ul className="list-disc list-inside space-y-1 text-sm text-black/70 dark:text-white/70">
												{section.items.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
