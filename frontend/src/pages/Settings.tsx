'use client';

import { useEffect, useState } from 'react';
import Sidebar, { MobileMenuButton, SidebarProvider } from '../components/Sidebar';
import PixelBackground from '@/components/pixel/PixelBackground';
import { type ThemeMode, applyTheme, loadStoredTheme } from '../util/theme';

// Pixel icons
function SunIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="3" />
			<rect x="7" y="13" width="2" height="3" />
			<rect x="0" y="7" width="3" height="2" />
			<rect x="13" y="7" width="3" height="2" />
			<rect x="2" y="2" width="2" height="2" />
			<rect x="12" y="2" width="2" height="2" />
			<rect x="2" y="12" width="2" height="2" />
			<rect x="12" y="12" width="2" height="2" />
			<rect x="5" y="5" width="6" height="6" />
		</svg>
	);
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="5" y="1" width="2" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="2" y="5" width="2" height="6" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="5" y="13" width="6" height="2" />
			<rect x="11" y="11" width="2" height="2" />
			<rect x="13" y="5" width="2" height="6" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="7" y="1" width="4" height="2" />
			<rect x="9" y="3" width="2" height="2" />
			<rect x="11" y="5" width="2" height="2" />
		</svg>
	);
}

function InvertIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="4" y="1" width="8" height="2" />
			<rect x="2" y="3" width="2" height="2" />
			<rect x="12" y="3" width="2" height="2" />
			<rect x="1" y="5" width="2" height="6" />
			<rect x="13" y="5" width="2" height="6" />
			<rect x="2" y="11" width="2" height="2" />
			<rect x="12" y="11" width="2" height="2" />
			<rect x="4" y="13" width="8" height="2" />
			<rect x="4" y="5" width="4" height="6" />
		</svg>
	);
}

function GearIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="6" y="0" width="4" height="2" />
			<rect x="6" y="14" width="4" height="2" />
			<rect x="0" y="6" width="2" height="4" />
			<rect x="14" y="6" width="2" height="4" />
			<rect x="2" y="2" width="2" height="2" />
			<rect x="12" y="2" width="2" height="2" />
			<rect x="2" y="12" width="2" height="2" />
			<rect x="12" y="12" width="2" height="2" />
			<rect x="5" y="5" width="6" height="6" />
			<rect x="6" y="6" width="4" height="4" fill="white" />
		</svg>
	);
}

const themeOptions: {
	value: ThemeMode;
	label: string;
	description: string;
	icon: typeof SunIcon;
}[] = [
	{
		value: 'light',
		label: 'Light Mode',
		description: 'Bright and clean interface with full colors',
		icon: SunIcon,
	},
	{
		value: 'dark',
		label: 'True Dark Mode',
		description: 'Comprehensive dark theme optimized for low-light environments',
		icon: MoonIcon,
	},
	{
		value: 'invert',
		label: 'Invert Colors',
		description: 'Quick color inversion for high contrast viewing',
		icon: InvertIcon,
	},
];

export default function Settings() {
	const [themeMode, setThemeMode] = useState<ThemeMode>('light');

	useEffect(() => {
		setThemeMode(loadStoredTheme());
	}, []);

	function handleThemeChange(mode: ThemeMode) {
		setThemeMode(mode);
		applyTheme(mode);
	}

	return (
		<SidebarProvider>
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

				<div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden p-6">
					<main className="flex-1 overflow-y-auto flex flex-col gap-4">
						<MobileMenuButton />
						{/* Header */}
						<div className="flex items-center gap-3 pt-2">
							<div className="h-8 w-8 bg-violet-400 border-3 border-black flex items-center justify-center">
								<GearIcon className="h-5 w-5 text-white" />
							</div>
							<h1 className="font-pixel text-2xl text-black dark:text-white">Settings</h1>
						</div>

						<div className="max-w-3xl space-y-6">
							{/* Main Settings Card */}
							<div className="relative">
								<div className="absolute left-2 top-2 h-full w-full border-4 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />
								<div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur border-4 border-black dark:border-white/20 p-6">
									<p className="text-sm text-black/60 dark:text-white/60 mb-8">
										Customize your TrainEm experience. Choose your preferred theme and appearance
										settings.
									</p>

									{/* Theme Selection */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 mb-4">
											<GearIcon className="h-4 w-4 text-black/70 dark:text-white/70" />
											<h2 className="font-pixel text-sm text-black dark:text-white">Appearance</h2>
										</div>

										<div className="grid gap-4">
											{themeOptions.map((option) => {
												const Icon = option.icon;
												const isSelected = themeMode === option.value;
												return (
													<button
														key={option.value}
														type="button"
														onClick={() => handleThemeChange(option.value)}
														className={`w-full text-left p-4 border-3 transition-all ${
															isSelected
																? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
																: 'border-black/20 dark:border-white/20 bg-white/50 dark:bg-gray-700/50 hover:border-black/40 dark:hover:border-white/40'
														}`}
													>
														<div className="flex items-start gap-4">
															<div
																className={`h-10 w-10 border-2 flex items-center justify-center shrink-0 ${
																	isSelected
																		? 'bg-emerald-500 border-black dark:border-white/30'
																		: 'bg-gray-100 dark:bg-gray-600 border-black/30 dark:border-white/20'
																}`}
															>
																<Icon
																	className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-black/60 dark:text-white/60'}`}
																/>
															</div>
															<div className="flex-1">
																<div className="flex items-center gap-2">
																	<span
																		className={`font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-black dark:text-white'}`}
																	>
																		{option.label}
																	</span>
																	{isSelected && (
																		<span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5">
																			ACTIVE
																		</span>
																	)}
																</div>
																<p className="text-sm text-black/50 dark:text-white/50 mt-1">
																	{option.description}
																</p>
															</div>
														</div>
													</button>
												);
											})}
										</div>
									</div>
								</div>
							</div>

							{/* Additional Settings Card */}
							<div className="relative">
								<div className="absolute left-2 top-2 h-full w-full border-4 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />
								<div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur border-4 border-black dark:border-white/20 p-6">
									<div className="flex items-center gap-3 mb-4">
										<div className="h-4 w-4 bg-sky-400 border-2 border-black dark:border-white/30" />
										<h2 className="font-pixel text-sm text-black dark:text-white">
											About Theme Modes
										</h2>
									</div>

									<div className="space-y-4 text-sm text-black/70 dark:text-white/70">
										<div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700/50">
											<p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
												Light Mode
											</p>
											<p className="text-amber-700/80 dark:text-amber-400/80">
												The default bright theme with full color palette. Best for well-lit
												environments.
											</p>
										</div>

										<div className="p-3 bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-200 dark:border-violet-700/50">
											<p className="font-medium text-violet-800 dark:text-violet-300 mb-1">
												True Dark Mode
											</p>
											<p className="text-violet-700/80 dark:text-violet-400/80">
												A comprehensive dark theme with optimized contrast and colors specifically
												designed for dark backgrounds. Reduces eye strain in low-light conditions.
											</p>
										</div>

										<div className="p-3 bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600">
											<p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
												Invert Colors
											</p>
											<p className="text-gray-600 dark:text-gray-400">
												A quick color inversion filter. Useful for high contrast viewing but may
												affect image colors.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
