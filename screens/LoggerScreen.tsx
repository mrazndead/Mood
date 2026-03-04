import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Activity, Moon, Calendar, Check, X, MapPin, Zap
} from 'lucide-react';
import { MOODS, ACTIVITIES } from '../constants';
import { useMood } from '../context/MoodContext';
import Planet from '../components/Planet';
import GlassCard from '../components/GlassCard';

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
      {/* Top Navigation/Status Bar */}
      <header className="pt-12 px-8 flex justify-between items-center text-white/80">
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
      <main className="flex-grow flex flex-col items-center justify-center px-8">
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
        <div className="w-full grid grid-cols-3 gap-4">
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
                className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white text-black hover:bg-white/90 transition-all shadow-xl"
            >
                {isLogging ? (
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
                className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-end justify-center"
                onClick={() => setActiveModal('none')}
            >
                <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-[#1a2632] rounded-t-[40px] p-8 pb-12 shadow-2xl"
                >
                    <div className="w-12 h-1.5 bg-white/10 mx-auto rounded-full mb-8" />
                    
                    {activeModal === 'activity' && (
                        <div className="grid grid-cols-4 gap-4">
                            {ACTIVITIES.map(act => (
                                <button
                                    key={act.id}
                                    onClick={() => setSelectedActivities(prev => prev.includes(act.id) ? prev.filter(a => a !== act.id) : [...prev, act.id])}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${selectedActivities.includes(act.id) ? 'bg-white text-black' : 'bg-white/5 text-white'}`}
                                >
                                    <span className="text-xs font-bold">{act.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeModal === 'sleep' && (
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-black text-white mb-4">{sleep}h</span>
                            <input 
                                type="range" min="0" max="12" step="0.5" value={sleep} 
                                onChange={(e) => setSleep(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                            />
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoggerScreen;