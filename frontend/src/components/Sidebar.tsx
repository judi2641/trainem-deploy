'use client';

import React from 'react';

import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState, createContext, useContext } from 'react';
import { getLevelFromScore } from '@/util/level';
import { useMyContext } from '@/context/AppContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/components/ui/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type PixelArtPixel = {
	x: number;
	y: number;
	color: string;
};

function pixelArtToDataUrl(pixels: PixelArtPixel[], gridSize: number) {
	if (typeof document === 'undefined') return null;

	const canvas = document.createElement('canvas');
	canvas.width = gridSize;
	canvas.height = gridSize;

	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, gridSize, gridSize);

	pixels.forEach((pixel) => {
		if (
			typeof pixel.x !== 'number' ||
			typeof pixel.y !== 'number' ||
			typeof pixel.color !== 'string'
		) {
			return;
		}
		if (pixel.x < 0 || pixel.y < 0 || pixel.x >= gridSize || pixel.y >= gridSize) {
			return;
		}
		ctx.fillStyle = pixel.color;
		ctx.fillRect(pixel.x, pixel.y, 1, 1);
	});

	return canvas.toDataURL('image/png');
}

// Pixel-style icon components
function PixelDashboardIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="1" width="6" height="6" />
			<rect x="9" y="1" width="6" height="6" />
			<rect x="1" y="9" width="6" height="6" />
			<rect x="9" y="9" width="6" height="6" />
		</svg>
	);
}

export function PixelDumbbellIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="0" y="5" width="2" height="6" />
			<rect x="2" y="6" width="2" height="4" />
			<rect x="4" y="7" width="8" height="2" />
			<rect x="12" y="6" width="2" height="4" />
			<rect x="14" y="5" width="2" height="6" />
		</svg>
	);
}

export function PixelCheckIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="3" y="8" width="2" height="2" />
			<rect x="5" y="10" width="2" height="2" />
			<rect x="7" y="8" width="2" height="2" />
			<rect x="9" y="6" width="2" height="2" />
			<rect x="11" y="4" width="2" height="2" />
		</svg>
	);
}

function PixelSparkleIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="4" />
			<rect x="7" y="12" width="2" height="4" />
			<rect x="0" y="7" width="4" height="2" />
			<rect x="12" y="7" width="4" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="11" y="11" width="2" height="2" />
			<rect x="6" y="6" width="4" height="4" />
		</svg>
	);
}

function PixelChartIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="12" width="3" height="3" />
			<rect x="5" y="8" width="3" height="7" />
			<rect x="9" y="5" width="3" height="10" />
			<rect x="13" y="2" width="3" height="13" />
		</svg>
	);
}

function PixelGroupsIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			{/* Left person */}
			<rect x="1" y="3" width="2" height="2" />
			<rect x="0" y="5" width="4" height="4" />
			{/* Center person */}
			<rect x="7" y="1" width="2" height="2" />
			<rect x="6" y="3" width="4" height="5" />
			{/* Right person */}
			<rect x="13" y="3" width="2" height="2" />
			<rect x="12" y="5" width="4" height="4" />
		</svg>
	);
}

function PixelWarIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			{/* Crossed swords */}
			<rect x="1" y="1" width="2" height="2" />
			<rect x="3" y="3" width="2" height="2" />
			<rect x="5" y="5" width="2" height="2" />
			<rect x="7" y="7" width="2" height="2" />
			<rect x="9" y="5" width="2" height="2" />
			<rect x="11" y="3" width="2" height="2" />
			<rect x="13" y="1" width="2" height="2" />
			{/* Bottom */}
			<rect x="5" y="9" width="2" height="2" />
			<rect x="9" y="9" width="2" height="2" />
			<rect x="3" y="11" width="2" height="2" />
			<rect x="11" y="11" width="2" height="2" />
		</svg>
	);
}

function PixelSettingsIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="0" width="2" height="2" />
			<rect x="7" y="14" width="2" height="2" />
			<rect x="0" y="7" width="2" height="2" />
			<rect x="14" y="7" width="2" height="2" />
			<rect x="2" y="2" width="2" height="2" />
			<rect x="12" y="2" width="2" height="2" />
			<rect x="2" y="12" width="2" height="2" />
			<rect x="12" y="12" width="2" height="2" />
			<rect x="5" y="5" width="6" height="6" />
			<rect x="6" y="6" width="4" height="4" fill="white" />
		</svg>
	);
}

function PixelLogoutIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="1" width="2" height="14" />
			<rect x="1" y="1" width="6" height="2" />
			<rect x="1" y="13" width="6" height="2" />
			<rect x="6" y="7" width="8" height="2" />
			<rect x="11" y="5" width="2" height="2" />
			<rect x="11" y="9" width="2" height="2" />
			<rect x="13" y="6" width="2" height="4" />
		</svg>
	);
}

function PixelMenuIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="1" y="2" width="14" height="2" />
			<rect x="1" y="7" width="14" height="2" />
			<rect x="1" y="12" width="14" height="2" />
		</svg>
	);
}

function PixelCollapseIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="10" y="2" width="2" height="2" />
			<rect x="8" y="4" width="2" height="2" />
			<rect x="6" y="6" width="2" height="4" />
			<rect x="8" y="10" width="2" height="2" />
			<rect x="10" y="12" width="2" height="2" />
			<rect x="2" y="2" width="2" height="12" />
		</svg>
	);
}

function PixelExpandIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="4" y="2" width="2" height="2" />
			<rect x="6" y="4" width="2" height="2" />
			<rect x="8" y="6" width="2" height="4" />
			<rect x="6" y="10" width="2" height="2" />
			<rect x="4" y="12" width="2" height="2" />
			<rect x="12" y="2" width="2" height="12" />
		</svg>
	);
}

// Sidebar Context for collapse state
interface SidebarContextType {
	isCollapsed: boolean;
	setIsCollapsed: (value: boolean) => void;
	isMobileOpen: boolean;
	setIsMobileOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	return (
		<SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}>
			{children}
		</SidebarContext.Provider>
	);
}

// Navigation items configuration
const menuItems = [
	{ to: '/dashboard', label: 'Dashboard', icon: PixelDashboardIcon },
	{ to: '/workouts', label: 'Workouts', icon: PixelDumbbellIcon },
	{ to: '/habits', label: 'Habits', icon: PixelCheckIcon },
	{ to: '/pixel-art', label: 'Pixel Art', icon: PixelSparkleIcon },
	{ to: '/statistics', label: 'Statistics', icon: PixelChartIcon },
	{ to: '/groups', label: 'Groups', icon: PixelGroupsIcon },
	{ to: '/pixel-wars', label: 'Pixel Wars', icon: PixelWarIcon },
];

const generalItems = [{ to: '/settings', label: 'Settings', icon: PixelSettingsIcon }];

// Sidebar Content Component (shared between desktop and mobile)
function SidebarContent({
	isCollapsed,
	onToggleCollapse,
	showCollapseButton = true,
}: {
	isCollapsed: boolean;
	onToggleCollapse?: () => void;
	showCollapseButton?: boolean;
}) {
	const { myUser, pixelArt } = useMyContext();
	const { logout } = useAuth0();
	const [pixelAvatarUrl, setPixelAvatarUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!pixelArt) return;
		const gridSize = typeof pixelArt.gridSize === 'number' ? pixelArt.gridSize : 16;
		const pixels = Array.isArray(pixelArt.pixels) ? pixelArt.pixels : [];
		setPixelAvatarUrl(pixelArtToDataUrl(pixels, gridSize));
	}, [pixelArt, myUser]);

	const handleLogout = () => {
		if (window.confirm('Willst du dich ausloggen?')) {
			logout();
		}
	};

	const totalScore = myUser?.points ?? myUser?.score ?? 0;
	const { level, currentXp, nextLevelXp } = getLevelFromScore(totalScore);
	const xpPercent = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 0;

	const activeVisuals =
		'flex items-center gap-3 px-3 py-2.5 bg-emerald-500 text-white font-medium border-2 border-black dark:border-white/20';
	const nonActiveVisuals =
		'flex items-center gap-3 px-3 py-2.5 text-black/70 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border-2 border-transparent transition-colors';

	const collapsedActiveVisuals =
		'flex items-center justify-center p-2.5 bg-emerald-500 text-white font-medium border-2 border-black dark:border-white/20';
	const collapsedNonActiveVisuals =
		'flex items-center justify-center p-2.5 text-black/70 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border-2 border-transparent transition-colors';

	return (
		<TooltipProvider delayDuration={0}>
			<div className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur border-4 border-black dark:border-white/20 p-5 flex flex-col overflow-hidden">
				{/* Logo & Collapse Button */}
				<div
					className={cn(
						'flex items-center mb-8',
						isCollapsed ? 'justify-center' : 'justify-between',
					)}
				>
					<div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
						<div className="h-5 w-5 bg-emerald-500 border-2 border-black dark:border-white/30 shrink-0" />
						{!isCollapsed && (
							<span className="font-pixel text-black dark:text-white text-xl">TrainEm</span>
						)}
					</div>
					{showCollapseButton && onToggleCollapse && (
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									onClick={onToggleCollapse}
									className="p-1.5 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
									aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
								>
									{isCollapsed ? (
										<PixelExpandIcon className="h-4 w-4" />
									) : (
										<PixelCollapseIcon className="h-4 w-4" />
									)}
								</button>
							</TooltipTrigger>
							<TooltipContent side="right">{isCollapsed ? 'Expand' : 'Collapse'}</TooltipContent>
						</Tooltip>
					)}
				</div>

				{/* User Profile */}
				{!isCollapsed ? (
					<div className="flex  items-center gap-4 mb-8 p-3 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-900/30 dark:to-amber-900/30 border-2 border-black dark:border-white/20">
						<Avatar className="h-16 w-16 border-2 border-black dark:border-white/20 rounded-none shrink-0">
							{pixelAvatarUrl || myUser?.img ? (
								<AvatarImage
									src={pixelAvatarUrl || myUser?.img}
									alt="Avatar"
									className="object-contain pixelated"
								/>
							) : null}
							<AvatarFallback className="bg-white text-black font-pixel text-xs">
								{myUser?.firstName?.[0] ?? '?'}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="font-medium text-black dark:text-white truncate">
								{myUser?.firstName ?? 'User'}
							</p>
							<p className="text-xs text-black/60 dark:text-white/60">Level {level}</p>
							<div className="mt-2 h-2 w-full bg-black/10 dark:bg-white/10 border border-black dark:border-white/20 overflow-hidden">
								<div
									className="h-full bg-emerald-500 transition-all duration-300"
									style={{ width: `${xpPercent}%` }}
								/>
							</div>
							<p className="text-[10px] text-black/50 dark:text-white/50 mt-1">
								{nextLevelXp - currentXp} XP to next level
							</p>
						</div>
					</div>
				) : (
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex justify-center mb-8 p-2 ">
								<Avatar className="h-10 w-10 border-2 border-black dark:border-white/20 rounded-none">
									{pixelAvatarUrl || myUser?.img ? (
										<AvatarImage
											src={pixelAvatarUrl || myUser?.img}
											alt="Avatar"
											className="object-contain pixelated"
										/>
									) : null}
									<AvatarFallback className="bg-white text-black font-pixel text-xs">
										{myUser?.firstName?.[0] ?? '?'}
									</AvatarFallback>
								</Avatar>
							</div>
						</TooltipTrigger>
						<TooltipContent side="right" className="flex flex-col gap-1">
							<p className="font-medium">{myUser?.firstName ?? 'User'}</p>
							<p className="text-xs opacity-70">Level {level}</p>
							<p className="text-xs opacity-50">{nextLevelXp - currentXp} XP to next</p>
						</TooltipContent>
					</Tooltip>
				)}

				{/* Navigation */}
				<nav className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden">
					{/* Menu Section */}
					<div>
						{!isCollapsed && (
							<h3 className="font-pixel text-[10px] text-black/50 dark:text-white/50 uppercase mb-3 tracking-wider">
								Menu
							</h3>
						)}
						<ul className="space-y-1.5">
							{menuItems.map((item) => (
								<li key={item.to}>
									{isCollapsed ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<NavLink
													to={item.to}
													className={({ isActive }) =>
														isActive ? collapsedActiveVisuals : collapsedNonActiveVisuals
													}
												>
													<item.icon className="h-5 w-5 shrink-0" />
												</NavLink>
											</TooltipTrigger>
											<TooltipContent side="right">{item.label}</TooltipContent>
										</Tooltip>
									) : (
										<NavLink
											to={item.to}
											className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
										>
											<item.icon className="h-5 w-5 shrink-0" />
											<span className="truncate">{item.label}</span>
										</NavLink>
									)}
								</li>
							))}
						</ul>
					</div>

					{/* General Section */}
					<div>
						{!isCollapsed && (
							<h3 className="font-pixel text-[10px] text-black/50 dark:text-white/50 uppercase mb-3 tracking-wider">
								General
							</h3>
						)}
						<ul className="space-y-1.5">
							{generalItems.map((item) => (
								<li key={item.to}>
									{isCollapsed ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<NavLink
													to={item.to}
													className={({ isActive }) =>
														isActive ? collapsedActiveVisuals : collapsedNonActiveVisuals
													}
												>
													<item.icon className="h-5 w-5 shrink-0" />
												</NavLink>
											</TooltipTrigger>
											<TooltipContent side="right">{item.label}</TooltipContent>
										</Tooltip>
									) : (
										<NavLink
											to={item.to}
											className={({ isActive }) => (isActive ? activeVisuals : nonActiveVisuals)}
										>
											<item.icon className="h-5 w-5 shrink-0" />
											<span className="truncate">{item.label}</span>
										</NavLink>
									)}
								</li>
							))}
						</ul>
					</div>
				</nav>

				{/* Logout Button */}
				{isCollapsed ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={handleLogout}
								className="flex items-center justify-center p-2.5 mt-4 w-full text-black/70 dark:text-white/70 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors"
								aria-label="Logout"
							>
								<PixelLogoutIcon className="h-5 w-5 shrink-0" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="right">Logout</TooltipContent>
					</Tooltip>
				) : (
					<button
						onClick={handleLogout}
						className="flex items-center gap-3 px-3 py-2.5 mt-4 w-full text-black/70 dark:text-white/70 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors"
					>
						<PixelLogoutIcon className="h-5 w-5 shrink-0" />
						<span>Logout</span>
					</button>
				)}
			</div>
		</TooltipProvider>
	);
}

// Mobile Menu Button Component
export function MobileMenuButton() {
	const { setIsMobileOpen } = useSidebar();

	return (
		<Button
			variant="ghost"
			size="icon"
			className=" rounded-none mb-2 lg:hidden h-10 w-10 border-2 border-black dark:border-white/20 bg-white/90 dark:bg-gray-800/90"
			onClick={() => setIsMobileOpen(true)}
			aria-label="Open menu"
		>
			<PixelMenuIcon className="h-5 w-5" />
		</Button>
	);
}

// Main Sidebar Component
export default function Sidebar() {
	const isMobile = useIsMobile();
	const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

	// Mobile: Use Sheet component
	if (isMobile) {
		return (
			<Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
				<SheetContent side="left" className="w-72 p-0 border-0 bg-transparent [&>button]:hidden">
					<div className="h-full m-4 mr-0">
						{/* Shadow layer */}
						<div className="absolute left-6 top-6 h-[calc(100%-2rem)] w-[calc(100%-1rem)] border-4 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />
						<SidebarContent isCollapsed={false} showCollapseButton={false} />
					</div>
				</SheetContent>
			</Sheet>
		);
	}

	// Desktop: Collapsible sidebar
	return (
		<div
			className={cn(
				'relative m-4 flex flex-col shrink-0 transition-all duration-300',
				isCollapsed ? 'w-20' : 'w-72',
			)}
		>
			{/* Shadow layer */}
			<div className="absolute left-2 top-2 h-full w-full border-4 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />

			{/* Main sidebar container */}
			<SidebarContent
				isCollapsed={isCollapsed}
				onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
			/>
		</div>
	);
}
