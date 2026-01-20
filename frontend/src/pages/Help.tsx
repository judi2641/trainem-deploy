import { useState } from 'react';
import type { FormEvent } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

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
		<div className="flex h-screen bg-[radial-gradient(circle_at_top_left,var(--color-primary),#ffe5c4)]">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.3fr,1fr] items-start">
						<div className="bg-white shadow-md rounded-xl p-8">
							<h1 className="text-2xl font-bold mb-2">Help & Support</h1>
							<p className="text-muted-foreground mb-6">
								Have suggestions or found an issue? Reach out to support and we will get back to
								you.
							</p>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
										Name
									</label>
									<input
										id="name"
										type="text"
										name="name"
										required
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Your name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
										Email
									</label>
									<input
										id="email"
										type="email"
										name="email"
										required
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="you@example.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
										Message
									</label>
									<textarea
										id="message"
										required
										name="message"
										rows={4}
										className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="Describe your idea or the issue you found."
									/>
								</div>
								<div className="flex items-center gap-3">
									<button
										type="submit"
										className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
									>
										Send
									</button>
									{status === 'sent' && (
										<span className="text-sm text-green-600">Thank you! We will reply soon.</span>
									)}
								</div>
							</form>
						</div>

						<div className="bg-white shadow-md rounded-xl p-8">
							<h2 className="text-xl font-semibold mb-3">FAQs</h2>
							<p className="text-muted-foreground mb-6">
								Quick guidance on working with tasks and training plans.
							</p>
							<div className="space-y-4">
								{helpSections.map((section) => (
									<div
										key={section.title}
										className="bg-gray-50 rounded-lg p-4 border border-gray-200"
									>
										<p className="font-semibold mb-2">{section.title}</p>
										<ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
											{section.items.map((item) => (
												<li key={item}>{item}</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
