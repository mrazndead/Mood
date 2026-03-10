"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Activity, Moon, Calendar, Check, X, MapPin, Zap
} from 'lucide-react';
import { MOODS, ACTIVITIES } from '../constants';
import { useMood } from '../context/MoodContext';
import Planet from '../components/Planet';
import ShootingStars from '../components/ShootingStars';

interface LoggerScreenProps {
  onLogComplete: () => void;
}

const LoggerScreen: React.FC<LoggerScreenProps> = ({ onLogComplete }) => {
  const { addEntry } = useMood();
  const [moodIndex, setMoodIndex] = useState(0); // Start at 'Happy'
  const [energy, setEnergy] = useState(75);
  const [sleep, setSleep] = useState(7);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  const [isLogging, setIsLogging] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState<'none' | 'activity' | 'sleep'>('none');

  const currentMood = MOODS[moodIndex];

  const handlePrev = () => setMoodIndex((prev) => (prev > 0 ? prev - 1 : MOODS.length - 1));
  const handleNext = () => setMoodIndex((prev) => (prev < MOODS.length - 1 ? prev + 1 : 0));

  const handleSave = () => {
    setIsLogging(true);
    setTimeout(() => {
        addEntry({
            mood: currentMood.type,
            energy,
            sleep,
            activities: selectedActivities,
            note: ''
        }, selectedDate.toISOString());
        setIsLogging(false);
        onLogComplete();
    }, 800);
  };

  return (
    <div className="h-full flex flex-col relative z-10 pb-24 transition-colors duration-700" style={{ backgroundColor: currentMood.color }}>
      {/* Background Animations */}
      <ShootingStars />
      
      {/* Top Navigation/Status Bar */}
      <header className="pt-12 px-8 flex justify-between items-center text-white/80 relative z-10">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                    <MapPin size={10} />
                    <span>Location</span>
                </div>
                <span className="text-xs font-bold">Home Orbit</span>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                    <Calendar size={10} />
                    <span>Date</span>
                </div>
                <span className="text-xs font-bold">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Zap size={14} />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 relative z-10">
        <motion.div 
            key={currentMood.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                {currentMood.label}
            </h1>
            <div className="h-1 w-12 bg-white/30 mx-auto rounded-full" />
        </motion.div>

        {/* Planet with Navigation */}
        <div className="relative w-full flex items-center justify-center mb-16">
            <button 
                onClick={handlePrev}
                className="absolute left-0 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md z-20 active:scale-90 transition-all text-white"
            >
                <ChevronLeft size={24} />
            </button>

            <Planet mood={currentMood} />

            <button 
                onClick={handleNext}
                className="absolute right-0 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md z-20 active:scale-90 transition-all text-white"
            >
                <ChevronRight size={24} />
            </button>
        </div>

        {/* Quick Actions */}
        <div className="w-full grid grid-cols-3 gap-4 mb-5">
            <button 
                onClick={() => setActiveModal('activity')}
                className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
                <Activity size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Activity</span>
            </button>
            <button 
                onClick={() => setActiveModal('sleep')}
                className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
                <Moon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Sleep</span>
            </button>
            <button 
                onClick={handleSave}
                disabled={isLogging}
                className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10"
            >
                {isLogging ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Check size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Save</span>
                    </>
                )}
            </button>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {activeModal !== 'none' && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
                onClick={() => setActiveModal('none')}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm bg-[#1a2632] rounded-[32px] p-8 shadow-2xl border border-white/10 relative"
                >
                    <button 
                        onClick={() => setActiveModal('none')}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h3 className="text-xl font-bold text-white mb-6 text-center">
                        {activeModal === 'activity' ? 'What did you do?' : 'How much sleep?'}
                    </h3>
                    
                    {activeModal === 'activity' && (
                        <div className="grid grid-cols-2 gap-3">
                            {ACTIVITIES.map(act => (
                                <button
                                    key={act.id}
                                    onClick={() => setSelectedActivities(prev => prev.includes(act.id) ? prev.filter(a => a !== act.id) : [...prev, act.id])}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl transition-all border ${selectedActivities.includes(act.id) ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/5 hover:bg-white/10'}`}
                                >
                                    <span className="text-xs font-bold">{act.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeModal === 'sleep' && (
                        <div className="flex flex-col items-center py-4">
                            <div className="relative mb-8">
                                <span className="text-6xl font-black text-white">{sleep}</span>
                                <span className="text-xl font-bold text-white/40 ml-1">h</span>
                            </div>
                            <input 
                                type="range" min="0" max="12" step="0.5" value={sleep} 
                                onChange={(e) => setSleep(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                            />
                            <div className="w-full flex justify-between mt-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                <span>0h</span>
                                <span>6h</span>
                                <span>12h</span>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={() => setActiveModal('none')}
                        className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all"
                    >
                        Done
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoggerScreen;