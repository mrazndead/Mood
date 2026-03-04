import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MoodEntry } from '../types';

interface MoodContextType {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id' | 'date' | 'timestamp'>, date?: string) => void;
  updateEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteEntries: (startDate: string, endDate: string) => void;
  clearAllEntries: () => void;
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

  const deleteEntries = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    setEntries(prev => prev.filter(entry => {
      const entryTime = new Date(entry.date).getTime();
      return entryTime < start || entryTime > end;
    }));
  };

  const clearAllEntries = () => {
    if (window.confirm('Are you sure you want to delete your entire journal? This cannot be undone.')) {
      setEntries([]);
    }
  };

  const getRecentStreak = () => {
    if (entries.length === 0) return 0;
    let streak = 0;
    // Simplified streak logic for demo
    return entries.length;
  };

  const getAverageMoodScore = () => {
    if (entries.length === 0) return 0;
    const scores = { 'Great': 5, 'Good': 4, 'Okay': 3, 'Low': 2, 'Bad': 1, 'Angry': 1 };
    const total = entries.reduce((acc, curr) => acc + (scores[curr.mood] || 3), 0);
    return Math.round((total / entries.length) * 20);
  };

  return (
    <MoodContext.Provider value={{ 
      entries, 
      addEntry, 
      updateEntry, 
      deleteEntries, 
      clearAllEntries, 
      getRecentStreak, 
      getAverageMoodScore 
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within MoodProvider');
  return context;
};