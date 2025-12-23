export type MoodType = 'Great' | 'Good' | 'Okay' | 'Low' | 'Bad';

export interface MoodDefinition {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  shadowColor: string;
  planetColor: string;
}

export interface ActivityTag {
  id: string;
  label: string;
  icon: string;
}

export interface MoodEntry {
  id: string;
  date: string; // ISO String
  timestamp: number;
  mood: MoodType;
  energy: number; // 0-100
  sleep: number; // hours
  activities: string[];
  note: string;
  weather?: {
    temp: number;
    condition: string;
  };
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
