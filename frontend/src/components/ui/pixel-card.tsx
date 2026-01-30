'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

const PixelCard = React.forwardRef<HTMLDivElement, PixelCardProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className={cn('relative h-full', className)} ref={ref} {...props}>
				{/* Shadow layer */}
				<div className="absolute left-1.5 top-1.5 h-full w-full border-3 border-black dark:border-white/20 bg-black/10 dark:bg-white/5" />
				{/* Main card */}
				<div className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur border-3 border-black dark:border-white/20 p-4 flex flex-col overflow-hidden">
					{children}
				</div>
			</div>
		);
	},
);
PixelCard.displayName = 'PixelCard';

interface PixelCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

const PixelCardHeader = React.forwardRef<HTMLDivElement, PixelCardHeaderProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className={cn('pb-3', className)} ref={ref} {...props}>
				{children}
			</div>
		);
	},
);
PixelCardHeader.displayName = 'PixelCardHeader';

interface PixelCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
}

const PixelCardTitle = React.forwardRef<HTMLHeadingElement, PixelCardTitleProps>(
	({ className, children, ...props }, ref) => {
		return (
			<h3 className={cn('font-pixel text-sm text-black dark:text-white', className)} ref={ref} {...props}>
				{children}
			</h3>
		);
	},
);
PixelCardTitle.displayName = 'PixelCardTitle';

interface PixelCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	scrollable?: boolean;
}

const PixelCardContent = React.forwardRef<HTMLDivElement, PixelCardContentProps>(
	({ className, children, scrollable = false, ...props }, ref) => {
		return (
			<div
				className={cn(
					'flex-1 min-h-0',
					scrollable &&
						'overflow-y-auto scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent',
					className,
				)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		);
	},
);
PixelCardContent.displayName = 'PixelCardContent';

export { PixelCard, PixelCardHeader, PixelCardTitle, PixelCardContent };
