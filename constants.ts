import { MoodDefinition, ActivityTag } from './types';

export const MOODS: MoodDefinition[] = [
  {
    type: 'Great',
    label: 'Happy :)',
    emoji: '🤩',
    color: '#3B82F6', // Blue
    gradientFrom: '#60A5FA',
    gradientTo: '#3B82F6',
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    planetColor: '#93C5FD',
  },
  {
    type: 'Good',
    label: 'Nice day',
    emoji: '🙂',
    color: '#FF9800',
    gradientFrom: '#FFB74D',
    gradientTo: '#FF9800',
    shadowColor: 'rgba(255, 152, 0, 0.4)',
    planetColor: '#FFE082',
  },
  {
    type: 'Okay',
    label: 'Fine',
    emoji: '😐',
    color: '#4CAF50',
    gradientFrom: '#81C784',
    gradientTo: '#4CAF50',
    shadowColor: 'rgba(76, 175, 80, 0.4)',
    planetColor: '#A5D6A7',
  },
  {
    type: 'Low',
    label: 'Just sad',
    emoji: '😔',
    color: '#8B5CF6', // Purple
    gradientFrom: '#A78BFA',
    gradientTo: '#8B5CF6',
    shadowColor: 'rgba(139, 92, 246, 0.4)',
    planetColor: '#C4B5FD',
  },
  {
    type: 'Bad',
    label: 'Tired and bored',
    emoji: '😫',
    color: '#37474F',
    gradientFrom: '#546E7A',
    gradientTo: '#37474F',
    shadowColor: 'rgba(55, 71, 79, 0.4)',
    planetColor: '#B0BEC5',
  },
  {
    type: 'Angry',
    label: 'Angry ;[',
    emoji: '😡',
    color: '#EF4444', // Red
    gradientFrom: '#F87171',
    gradientTo: '#EF4444',
    shadowColor: 'rgba(239, 68, 68, 0.4)',
    planetColor: '#FCA5A5',
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
  { id: 'intimacy', label: 'Intimacy', icon: 'sparkles' },
];