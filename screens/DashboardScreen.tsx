import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, Scale, Globe, Briefcase, Dumbbell, Users, Gamepad2, Book, Film, Heart, Activity } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { MOODS, ACTIVITIES } from '../constants';
import GlassCard from '../components/GlassCard';

const DashboardScreen: React.FC = () => {
  const { entries, getRecentStreak, getAverageMoodScore } = useMood();
  const [view, setView] = useState<'stream' | 'constellation'>('stream');

  // Prepare data for chart
  const chartData = entries.slice(0, 7).reverse().map(e => ({
    name: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: MOODS.findIndex(m => m.type === e.mood) * 20 + 20, // Map mood to 0-100 roughly
  }));

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
        <div className="px-6 py-4 h-64 w-full">
            <GlassCard className="h-full w-full p-4 flex flex-col">
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
                        <div key={entry.id} className="relative flex items-center">
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
                            <GlassCard className="flex-1 p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors cursor-pointer border-white/5 bg-dark-card/40">
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
                            </GlassCard>
                        </div>
                    );
                })}
             </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;