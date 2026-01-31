'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dumbbell, Timer, Play, ExternalLink } from 'lucide-react';
import { useState } from 'react';

// Pixel icons
function MuscleIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="2" y="6" width="3" height="4" />
			<rect x="5" y="5" width="2" height="6" />
			<rect x="7" y="4" width="2" height="8" />
			<rect x="9" y="5" width="2" height="6" />
			<rect x="11" y="6" width="3" height="4" />
		</svg>
	);
}

function InfoIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" className={className} fill="currentColor">
			<rect x="7" y="3" width="2" height="2" />
			<rect x="7" y="6" width="2" height="7" />
			<rect x="5" y="11" width="6" height="2" />
		</svg>
	);
}

interface ExerciseDetailDialogProps {
	exercise: {
		name: string;
		type?: 'strength' | 'cardio';
		primaryMuscleGroups?: string[];
		executionInstructions?: string;
		videoUrl?: string;
		imageUrl?: string;
	} | null;
	sets?: number;
	reps?: number;
	duration?: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function ExerciseDetailDialog({
	exercise,
	sets,
	reps,
	duration,
	open,
	onOpenChange,
}: ExerciseDetailDialogProps) {
	const [imageError, setImageError] = useState(false);
	const [videoLoading, setVideoLoading] = useState(true);

	if (!exercise) return null;

	const isCardio = exercise.type === 'cardio';
	const hasVideo = !!exercise.videoUrl;
	const hasImage = !!exercise.imageUrl && !imageError;

	// Extract YouTube video ID if it's a YouTube URL
	const getYouTubeEmbedUrl = (url: string) => {
		const youtubeRegex =
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
		const match = url.match(youtubeRegex);
		if (match) {
			return `https://www.youtube.com/embed/${match[1]}`;
		}
		return url;
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg border-4 border-black rounded-none bg-white p-0 overflow-hidden">
				{/* Header with exercise type indicator */}
				<div
					className={`px-6 py-4 border-b-4 border-black ${isCardio ? 'bg-sky-100' : 'bg-amber-100'}`}
				>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<div
								className={`w-10 h-10 border-2 border-black flex items-center justify-center ${isCardio ? 'bg-sky-400' : 'bg-amber-400'}`}
							>
								{isCardio ? (
									<Timer className="w-5 h-5 text-black" />
								) : (
									<Dumbbell className="w-5 h-5 text-black" />
								)}
							</div>
							<div>
								<h2 className="font-pixel text-lg text-black">{exercise.name}</h2>
								<p className="text-sm text-black/60 font-normal mt-0.5">
									{isCardio
										? duration
											? `${duration} seconds`
											: 'Cardio Exercise'
										: sets && reps
											? `${sets} sets x ${reps} reps`
											: 'Strength Exercise'}
								</p>
							</div>
						</DialogTitle>
					</DialogHeader>
				</div>

				{/* Content */}
				<div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
					{/* Video or Image Section */}
					{(hasVideo || hasImage) && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-black">
								<Play className="w-4 h-4" />
								<span>Demonstration</span>
							</div>
							<div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-black overflow-hidden relative">
								{hasVideo ? (
									<>
										{videoLoading && (
											<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
												<div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
											</div>
										)}
										<iframe
											src={getYouTubeEmbedUrl(exercise.videoUrl!)}
											className="w-full h-full"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											title={`${exercise.name} video`}
											onLoad={() => setVideoLoading(false)}
										/>
									</>
								) : hasImage ? (
									<img
										src={exercise.imageUrl || '/placeholder.svg'}
										alt={exercise.name}
										className="w-full h-full object-cover"
										onError={() => setImageError(true)}
									/>
								) : null}
							</div>
							{exercise.videoUrl && (
								<a
									href={exercise.videoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-xs text-black/60 hover:text-black transition-colors"
								>
									<ExternalLink className="w-3 h-3" />
									Open in new tab
								</a>
							)}
						</div>
					)}

					{/* No media placeholder */}
					{!hasVideo && !hasImage && (
						<div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-black/30 flex items-center justify-center">
							<div className="text-center">
								<div
									className={`w-16 h-16 mx-auto mb-3 border-2 border-black/20 flex items-center justify-center ${isCardio ? 'bg-sky-50' : 'bg-amber-50'}`}
								>
									{isCardio ? (
										<Timer className="w-8 h-8 text-black/30" />
									) : (
										<Dumbbell className="w-8 h-8 text-black/30" />
									)}
								</div>
								<p className="text-sm text-black/40">No video or image available</p>
							</div>
						</div>
					)}

					{/* Primary Muscle Groups */}
					{exercise.primaryMuscleGroups && exercise.primaryMuscleGroups.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-black">
								<MuscleIcon className="w-4 h-4" />
								<span>Target Muscles</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{exercise.primaryMuscleGroups.map((muscle) => (
									<span
										key={muscle}
										className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-pink-50 border-2 border-black text-xs font-medium text-black"
									>
										{muscle}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Execution Instructions */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm font-medium text-black">
							<InfoIcon className="w-4 h-4" />
							<span>Instructions</span>
						</div>
						<div className="p-4 bg-gradient-to-br from-emerald-50 to-white border-2 border-black">
							{exercise.executionInstructions ? (
								<p className="text-sm text-black/80 leading-relaxed whitespace-pre-line">
									{exercise.executionInstructions}
								</p>
							) : (
								<p className="text-sm text-black/50 italic">
									No specific instructions available for this exercise. Focus on maintaining proper
									form and controlled movements throughout each repetition.
								</p>
							)}
						</div>
					</div>

					{/* Exercise Info Summary */}
					<div className="grid grid-cols-2 gap-3">
						<div className="p-3 bg-gray-50 border-2 border-black/20">
							<p className="text-[10px] uppercase tracking-wider text-black/50 mb-1">Type</p>
							<p className="text-sm font-medium text-black capitalize">
								{exercise.type || 'Unknown'}
							</p>
						</div>
						<div className="p-3 bg-gray-50 border-2 border-black/20">
							<p className="text-[10px] uppercase tracking-wider text-black/50 mb-1">
								{isCardio ? 'Duration' : 'Volume'}
							</p>
							<p className="text-sm font-medium text-black">
								{isCardio
									? duration
										? `${duration}s`
										: '-'
									: sets && reps
										? `${sets} x ${reps}`
										: '-'}
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t-2 border-black/10 bg-gray-50">
					<button
						onClick={() => onOpenChange(false)}
						className="w-full pixel-btn px-4 py-2.5 text-sm font-medium"
					>
						Close
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
