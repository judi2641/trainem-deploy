export const TRAINING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type TrainingDays = (typeof TRAINING_DAYS)[number];
