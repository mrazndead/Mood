import { MoodDefinition, ActivityTag } from './types';

export const MOODS: MoodDefinition[] = [
  {
    type: 'Great',
    label: 'Happy :)',
    emoji: '🤩',
    color: '#8B5CF6',
    gradientFrom: '#7C3AED',
    gradientTo: '#DB2777',
    shadowColor: 'rgba(219, 39, 119, 0.5)',
    planetColor: '#F472B6',
  },
  {
    type: 'Good',
    label: 'Good',
    emoji: '🙂',
    color: '#3B82F6',
    gradientFrom: '#2563EB',
    gradientTo: '#22D3EE',
    shadowColor: 'rgba(34, 211, 238, 0.5)',
    planetColor: '#60A5FA',
  },
  {
    type: 'Okay',
    label: 'Okay',
    emoji: '😐',
    color: '#10B981',
    gradientFrom: '#059669',
    gradientTo: '#A7F3D0',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    planetColor: '#34D399',
  },
  {
    type: 'Low',
    label: 'Low',
    emoji: '😔',
    color: '#F59E0B',
    gradientFrom: '#D97706',
    gradientTo: '#FDE68A',
    shadowColor: 'rgba(245, 158, 11, 0.5)',
    planetColor: '#FBBF24',
  },
  {
    type: 'Bad',
    label: 'Bad',
    emoji: '😫',
    color: '#EF4444',
    gradientFrom: '#B91C1C',
    gradientTo: '#FDA4AF',
    shadowColor: 'rgba(239, 68, 68, 0.5)',
    planetColor: '#F87171',
  },
];

export const ACTIVITIES: ActivityTag[] = [
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'exercise', label: 'Exercise', icon: 'dumbbell' },
  { id: 'social', label: 'Social', icon: 'users' },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad' },
  { id: 'reading', label: 'Reading', icon: 'book' },
  { id: 'movies', label: 'Movies', icon: 'film' },
  { id: 'date', label: 'Date', icon: 'heart' },
];
