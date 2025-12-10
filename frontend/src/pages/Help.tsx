import { FormEvent, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Help() {
	const [status, setStatus] = useState<'idle' | 'sent'>('idle');

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const message = formData.get('message')?.toString() || '';

		const subject = encodeURIComponent('Support Anfrage');
		const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`);

		window.location.href = `mailto:info@trainem.de?subject=${subject}&body=${body}`;
		setStatus('sent');
	}

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
					<div className="bg-white shadow-md rounded-xl p-8 max-w-3xl ">
						<h1 className="text-2xl font-bold mb-2">Help & Support</h1>
						<p className="text-muted-foreground mb-6">
							Du hast Verbesserungsvorschläge? Es funktioniert etwas noch nicht? Dann kontaktiere
							den Support.
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
									placeholder="Dein Name"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
									E-Mail
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
									Nachricht
								</label>
								<textarea
									id="message"
									required
									name="message"
									rows={4}
									className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="Beschreibe dein Anliegen oder den Fehler."
								/>
							</div>
							<div className="flex items-center gap-3">
								<button
									type="submit"
									className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
								>
									Senden
								</button>
								{status === 'sent' && (
									<span className="text-sm text-green-600">
										Vielen Dank! Wir melden uns zeitnah.
									</span>
								)}
							</div>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}
