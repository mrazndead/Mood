import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Scale, Globe, Briefcase, Dumbbell, Users, Gamepad2, Book, Film, Heart, Activity, Sparkles,
  FileText, X, Check, Edit3, Moon
} from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { MOODS, ACTIVITIES } from '../constants';
import { MoodEntry } from '../types';
import GlassCard from '../components/GlassCard';

const DashboardScreen: React.FC = () => {
  const { entries, getRecentStreak, getAverageMoodScore, updateEntry } = useMood();
  const [view, setView] = useState<'stream' | 'constellation'>('stream');
  
  // Note Modal State
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const handleOpenEntry = (entry: MoodEntry) => {
    setSelectedEntry(entry);
    setNoteInput(entry.note || '');
  };

  const handleSaveNote = () => {
    if (selectedEntry) {
      updateEntry(selectedEntry.id, { note: noteInput });
      setSelectedEntry(null);
    }
  };

  // Prepare data for charts
  const recentEntries = entries.slice(0, 7).reverse();
  
  const chartData = recentEntries.map(e => ({
    name: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: MOODS.findIndex(m => m.type === e.mood) * 20 + 20, // Map mood to 0-100 roughly
  }));

  const sleepData = recentEntries.map(e => ({
    name: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: e.sleep,
  }));

  // Calculate Sleep Stats
  const avgSleep = recentEntries.length > 0 
    ? recentEntries.reduce((acc, curr) => acc + curr.sleep, 0) / recentEntries.length 
    : 0;

  let sleepRating = { label: '--', color: 'text-slate-400', bg: 'bg-slate-400/10' };
  if (recentEntries.length > 0) {
      if (avgSleep < 6) {
          sleepRating = { label: 'Bad', color: 'text-red-400', bg: 'bg-red-400/10' };
      } else if (avgSleep < 7.5) {
          sleepRating = { label: 'Good', color: 'text-blue-300', bg: 'bg-blue-400/10' };
      } else {
          sleepRating = { label: 'Great', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      }
  }

  const dominantMood = entries.length > 0 
    ? entries[0].mood 
    : 'Okay';
  
  const dominantColor = MOODS.find(m => m.type === dominantMood)?.color || '#fff';
  const todayDate = new Date().getDate();

  const getIcon = (iconName: string, size = 14) => {
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
    <div className="h-full flex flex-col relative z-10 pb-24 overflow-y-auto">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#132c45] to-transparent opacity-40 pointer-events-none -z-10" />

      {/* Header */}
      <header className="flex items-center p-6 pb-2 justify-between relative z-50">
        <h1 className="text-white text-lg font-bold tracking-tight">Your Orbit</h1>
        
        <button className="text-white/70 p-2 rounded-full hover:bg-white/5">
           <div className="w-6 h-6 border-2 border-white/70 rounded-md flex items-center justify-center text-[10px] font-bold">
             {todayDate}
           </div>
        </button>
      </header>

      {/* Toggle */}
      <div className="px-6 py-4">
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-dark-card p-1 border border-white/5">
          <button 
            onClick={() => setView('stream')}
            className={`relative flex-1 h-full rounded-[10px] text-sm font-medium transition-all ${view === 'stream' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
          >
            Stream View
          </button>
          <button 
            onClick={() => setView('constellation')}
            className={`relative flex-1 h-full rounded-[10px] text-sm font-medium transition-all ${view === 'constellation' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
          >
            Constellation
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 pb-2 pt-2">
        <h2 className="text-white text-[28px] font-bold leading-tight mb-6">
            You felt mostly <span style={{ color: dominantColor }}>{dominantMood}</span> this week.
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
            {/* Streak */}
            <GlassCard className="p-4 h-32 flex flex-col justify-between bg-dark-card/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20"><Flame size={32}/></div>
                <p className="text-slate-400 text-sm font-medium relative z-10">Streak</p>
                <div className="flex items-end gap-1 relative z-10">
                    <p className="text-white text-3xl font-bold">{getRecentStreak()}</p>
                    <p className="text-white/60 text-sm mb-1">Days</p>
                </div>
            </GlassCard>

            {/* Stability */}
            <GlassCard className="p-4 h-32 flex flex-col justify-between bg-dark-card/50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-20"><Scale size={32}/></div>
                <p className="text-slate-400 text-sm font-medium relative z-10">Stability</p>
                <div className="flex items-end gap-1 relative z-10">
                    <p className="text-white text-3xl font-bold">{getAverageMoodScore()}</p>
                    <p className="text-white/60 text-sm mb-1">%</p>
                </div>
            </GlassCard>

             {/* Dominant */}
             <GlassCard className="col-span-2 p-4 h-24 flex items-center justify-between bg-dark-card/50 relative overflow-hidden">
                 <div className="absolute -right-2 -top-2 p-3 opacity-10"><Globe size={64}/></div>
                 <div className="relative z-10">
                    <p className="text-slate-400 text-sm font-medium">Dominant Mood</p>
                    <p className="text-2xl font-bold" style={{ color: dominantColor }}>{dominantMood}</p>
                 </div>
                 <div className="w-12 h-12 rounded-full border-4 border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                      style={{ backgroundColor: dominantColor, boxShadow: `0 0 20px ${dominantColor}66` }} 
                 />
            </GlassCard>
        </div>
      </div>

      {view === 'constellation' ? (
        <div className="px-6 py-4 w-full space-y-4">
            {/* Mood Chart */}
            <GlassCard className="h-64 w-full p-4 flex flex-col">
                <h3 className="text-sm font-medium text-slate-400 mb-4">Mood Constellation (7 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a2632', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8B5CF6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </GlassCard>

             {/* Sleep Chart */}
            <GlassCard className="h-64 w-full p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                         <div className="p-1.5 rounded-md bg-cyan-500/20">
                             <Moon size={14} className="text-cyan-400" />
                         </div>
                         <h3 className="text-sm font-medium text-slate-300">Sleep Rhythm</h3>
                    </div>
                    
                    {/* Sleep Rating Badge */}
                    <div className={`flex flex-col items-end`}>
                         <div className={`px-2 py-0.5 rounded-full ${sleepRating.bg} border border-white/5`}>
                             <span className={`text-xs font-bold ${sleepRating.color}`}>{sleepRating.label}</span>
                         </div>
                         <span className="text-[10px] text-slate-500 mt-1">Avg: {avgSleep.toFixed(1)}h</span>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sleepData}>
                        <defs>
                            <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a2632', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`${value}h`, 'Sleep']}
                        />
                        <YAxis hide domain={[0, 12]} />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22D3EE" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorSleep)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </GlassCard>
        </div>
      ) : (
        /* Timeline View */
        <div className="px-6 pt-4 relative">
             <div className="absolute left-[47px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-white/10 via-white/10 to-transparent" />
             
             <div className="space-y-8">
                {entries.map((entry, idx) => {
                    const moodDef = MOODS.find(m => m.type === entry.mood) || MOODS[2];
                    const isToday = new Date(entry.date).toDateString() === new Date().toDateString();
                    
                    return (
                        <div key={entry.id} className="relative flex items-center group">
                            {/* Dot on timeline */}
                            <div className={`absolute -left-[3px] w-[8px] h-[8px] rounded-full border-2 border-dark-bg z-10 ${isToday ? 'bg-white w-[12px] h-[12px] -left-[5px] shadow-[0_0_10px_white]' : 'bg-slate-600'}`}></div>
                            
                            {/* Time */}
                            <div className="flex flex-col w-12 mr-6 text-right shrink-0">
                                <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-slate-400'}`}>
                                    {isToday ? 'Today' : new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </span>
                                <span className="text-slate-600 text-[10px]">
                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Card */}
                            <GlassCard 
                                onClick={() => handleOpenEntry(entry)}
                                className="flex-1 p-4 flex flex-col gap-3 hover:bg-white/10 active:scale-98 transition-all cursor-pointer border-white/5 bg-dark-card/40 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-10 h-10 rounded-full shrink-0 relative shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${moodDef.gradientFrom}, ${moodDef.gradientTo})` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-[2px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-sm">{moodDef.label}</span>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                                             <span>Energy: {entry.energy}%</span>
                                             <span>•</span>
                                             <span>Sleep: {entry.sleep}h</span>
                                        </div>
                                    </div>
                                    
                                    {/* Edit Hint Icon (Visible on Hover/Always subtle) */}
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit3 size={16} className="text-white/40" />
                                    </div>
                                </div>
                                {entry.activities && entry.activities.length > 0 && (
                                    <div className="flex gap-2 pl-14 flex-wrap">
                                        {entry.activities.map(actId => {
                                            const activityDef = ACTIVITIES.find(a => a.id === actId);
                                            if (!activityDef) return null;
                                            return (
                                                <div key={actId} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                                                    {getIcon(activityDef.icon)}
                                                    <span className="text-[10px] text-white/70">{activityDef.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                {/* Note Preview */}
                                {entry.note && (
                                    <div className="mt-2 pl-14 flex items-start gap-2">
                                        <FileText size={12} className="text-white/40 mt-[2px] shrink-0" />
                                        <p className="text-xs text-white/60 italic line-clamp-2">"{entry.note}"</p>
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    );
                })}
             </div>
        </div>
      )}

      {/* Note Edit Modal */}
      <AnimatePresence>
        {selectedEntry && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedEntry(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-sm bg-[#1a2632] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
                >
                    {/* Background blob for style */}
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Journal</h3>
                            <p className="text-white/50 text-xs">
                                {new Date(selectedEntry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <button 
                            onClick={() => setSelectedEntry(null)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} className="text-white/70" />
                        </button>
                    </div>

                    {/* Mood Context */}
                    <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div 
                            className="w-10 h-10 rounded-full shadow-lg"
                            style={{ 
                                background: MOODS.find(m => m.type === selectedEntry.mood)?.color || '#fff' 
                            }}
                        />
                        <div>
                            <p className="font-semibold text-sm">
                                Feeling {MOODS.find(m => m.type === selectedEntry.mood)?.label}
                            </p>
                            <p className="text-xs text-white/50">
                                Energy: {selectedEntry.energy}% • Sleep: {selectedEntry.sleep}h
                            </p>
                        </div>
                    </div>

                    {/* Note Input */}
                    <div className="mb-6 relative">
                        <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Write your thoughts here..."
                            className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
                        />
                        <FileText className="absolute bottom-4 right-4 text-white/10 pointer-events-none" size={48} />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveNote}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Save Note
                    </button>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardScreen;