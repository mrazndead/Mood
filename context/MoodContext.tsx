import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MoodEntry } from '../types';

interface MoodContextType {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id' | 'date' | 'timestamp'>, date?: string) => void;
  updateEntry: (id: string, updates: Partial<MoodEntry>) => void;
  getRecentStreak: () => number;
  getAverageMoodScore: () => number;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moodflow_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse entries", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('moodflow_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entryData: Omit<MoodEntry, 'id' | 'date' | 'timestamp'>, date?: string) => {
    const entryDate = date ? new Date(date) : new Date();
    const newEntry: MoodEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      date: entryDate.toISOString(),
      timestamp: entryDate.getTime(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<MoodEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const getRecentStreak = () => {
    let streak = 0;
    // Simplified streak logic
    for (let i = 0; i < entries.length; i++) {
        // In real app, check consecutive days
        streak++;
    }
    return Math.min(streak, entries.length > 0 ? entries.length : 0);
  };

  const getAverageMoodScore = () => {
    if (entries.length === 0) return 0;
    const scores = { 'Great': 5, 'Good': 4, 'Okay': 3, 'Low': 2, 'Bad': 1 };
    const total = entries.reduce((acc, curr) => acc + scores[curr.mood], 0);
    return Math.round((total / entries.length) * 20); // convert to percentage-ish
  };

  return (
    <MoodContext.Provider value={{ entries, addEntry, updateEntry, getRecentStreak, getAverageMoodScore }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within MoodProvider');
  return context;
};