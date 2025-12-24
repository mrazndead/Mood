import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Activity, Moon, Calendar, Check, X,
  Briefcase, Dumbbell, Users, Gamepad2, Book, Film, Heart, Sparkles
} from 'lucide-react';
import { MOODS, ACTIVITIES } from '../constants';
import { useMood } from '../context/MoodContext';
import Planet from '../components/Planet';
import GlassCard from '../components/GlassCard';

interface LoggerScreenProps {
  onLogComplete: () => void;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const LoggerScreen: React.FC<LoggerScreenProps> = ({ onLogComplete }) => {
  const { addEntry } = useMood();
  const [moodIndex, setMoodIndex] = useState(2); // Start at 'Okay'
  const [energy, setEnergy] = useState(75);
  const [sleep, setSleep] = useState(7);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  const [isLogging, setIsLogging] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modals state
  const [activeModal, setActiveModal] = useState<'none' | 'activity' | 'sleep'>('none');

  // Ripple state
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const currentMood = MOODS[moodIndex];

  const handlePrev = () => {
    setMoodIndex((prev) => (prev > 0 ? prev - 1 : MOODS.length - 1));
  };

  const handleNext = () => {
    setMoodIndex((prev) => (prev < MOODS.length - 1 ? prev + 1 : 0));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      setSelectedDate(newDate);
    }
  };

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

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSleepClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate ripple position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setActiveModal('sleep');
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Helper to get icon component
  const getIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'briefcase': return <Briefcase size={size} />;
      case 'dumbbell': return <Dumbbell size={size} />;
      case 'users': return <Users size={size} />;
      case 'gamepad': return <Gamepad2 size={size} />;
      case 'book': return <Book size={size} />;
      case 'film': return <Film size={size} />;
      case 'heart': return <Heart size={size} />;
      case 'sparkles': return <Sparkles size={size} />;
      default: return <Activity size={size} />;
    }
  };

  return (
    <div className="h-full flex flex-col relative z-10 pb-24">
      {/* Header */}
      <header className="pt-8 px-6 flex justify-between items-start">
        <div className="flex flex-col text-white">
          <span className="text-white font-medium whitespace-nowrap text-lg opacity-90">How are you feeling?</span>
          <h1 className="text-4xl font-bold tracking-tight pt-1">{currentMood.label}</h1>
        </div>
        <div className="flex gap-2 opacity-80 items-center bg-black/10 backdrop-blur-md rounded-full pl-4 pr-1 py-1 border border-white/5">
          <span className="text-sm font-medium">
            {isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <div className="relative">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10 pointer-events-none">
                <Calendar size={20} />
            </button>
            <input 
                type="date" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                onChange={handleDateChange}
                value={selectedDate.toISOString().split('T')[0]}
            />
          </div>
        </div>
      </header>

      {/* Main Interaction Area */}
      <main className="flex-grow flex flex-col items-center justify-center w-full px-6 py-2">
        
        {/* Planet & Controls */}
        <div className="relative w-full flex items-center justify-center mb-8">
            <button 
                onClick={handlePrev}
                className="absolute left-0 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md z-20 active:scale-95 transition-all"
            >
                <ChevronLeft size={24} />
            </button>

            <Planet mood={currentMood} />

            <button 
                onClick={handleNext}
                className="absolute right-0 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md z-20 active:scale-95 transition-all"
            >
                <ChevronRight size={24} />
            </button>
        </div>

        {/* Inputs */}
        <div className="w-full space-y-4">
            {/* Energy Slider */}
            <GlassCard delay={0.1} className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-white/80">Energy Level</span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                        {energy > 80 ? 'High' : energy > 40 ? 'Moderate' : 'Low'}
                    </span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={energy} 
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
            </GlassCard>

            {/* 3 Columns: Activity, Sleep, Save */}
            <div className="grid grid-cols-3 gap-3">
                <GlassCard 
                    delay={0.2} 
                    onClick={() => setActiveModal('activity')}
                    className={`p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-colors group cursor-pointer aspect-square ${selectedActivities.length > 0 ? 'bg-white/20 border-white/40' : ''}`}
                >
                    <Activity className="text-white/80 group-hover:scale-110 transition-transform" size={28} />
                    <span className="text-xs font-medium">
                        {selectedActivities.length > 0 ? `${selectedActivities.length} Selected` : 'Activity'}
                    </span>
                </GlassCard>

                <GlassCard 
                    delay={0.3} 
                    onClick={handleSleepClick}
                    className="relative overflow-hidden p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-colors group cursor-pointer aspect-square"
                >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <Moon className="text-white/80 group-hover:scale-110 transition-transform" size={28} />
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-medium">Sleep</span>
                            <span className="text-[10px] text-white/50">{sleep}h</span>
                        </div>
                    </div>
                    {/* Ripple Effect */}
                    <AnimatePresence>
                        {ripples.map(r => (
                            <motion.span
                                key={r.id}
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 3, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                onAnimationComplete={() => removeRipple(r.id)}
                                className="absolute bg-white/30 rounded-full pointer-events-none"
                                style={{
                                    left: r.x,
                                    top: r.y,
                                    width: 100,
                                    height: 100,
                                    x: "-50%",
                                    y: "-50%",
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </GlassCard>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isLogging}
                    className="rounded-3xl font-bold text-white shadow-lg transition-all
                               bg-gradient-to-b from-white/20 to-white/5 hover:from-white/30 hover:to-white/10
                               backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center gap-2 aspect-square p-3"
                >
                    {isLogging ? (
                        <span className="block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Check size={28} className="drop-shadow-md" />
                            <span className="text-xs font-medium">Save</span>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
      </main>

      {/* Modals / Overlays */}
      <AnimatePresence>
        {activeModal !== 'none' && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setActiveModal('none')}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm bg-[#1a2632] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
                >
                    <button 
                        onClick={() => setActiveModal('none')}
                        className="absolute right-4 top-4 p-2 bg-white/5 rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>

                    {activeModal === 'activity' && (
                        <>
                            <h3 className="text-xl font-bold mb-6">What did you do?</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {ACTIVITIES.map(act => (
                                    <button
                                        key={act.id}
                                        onClick={() => toggleActivity(act.id)}
                                        className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedActivities.includes(act.id) ? 'bg-white/20 ring-2 ring-white/50' : 'bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={`p-3 rounded-full ${selectedActivities.includes(act.id) ? 'bg-white text-black' : 'bg-black/20 text-white'}`}>
                                            {getIcon(act.icon, 24)}
                                        </div>
                                        <span className="text-[10px] font-medium">{act.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {activeModal === 'sleep' && (
                        <>
                             <h3 className="text-xl font-bold mb-8 text-center">Hours Slept</h3>
                             <div className="flex items-center justify-center gap-8 mb-8">
                                <button 
                                    onClick={() => setSleep(prev => Math.max(0, prev - 0.5))}
                                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20"
                                >-</button>
                                <div className="text-center">
                                    <span className="text-6xl font-bold">{sleep}</span>
                                    <span className="text-white/50 block text-sm mt-1">hours</span>
                                </div>
                                <button 
                                    onClick={() => setSleep(prev => Math.min(24, prev + 0.5))}
                                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20"
                                >+</button>
                             </div>
                             <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                <div 
                                    className="bg-white h-full rounded-full transition-all" 
                                    style={{ width: `${(sleep / 12) * 100}%` }}
                                />
                             </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoggerScreen;