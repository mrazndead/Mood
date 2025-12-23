import React from 'react';
import { LayoutDashboard, Plus, User } from 'lucide-react';

interface NavigationProps {
  currentScreen: 'logger' | 'dashboard';
  setScreen: (screen: 'logger' | 'dashboard') => void;
  onLogPress: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, setScreen, onLogPress }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-6">
      <div className="max-w-md mx-auto bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[32px] px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        
        <button 
          onClick={() => setScreen('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors duration-300 ${currentScreen === 'dashboard' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          <LayoutDashboard size={24} className="drop-shadow-sm" />
          <span className="text-[10px] font-medium tracking-wide">Orbit</span>
        </button>

        <button 
            onClick={onLogPress}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95
                        bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-xl border border-white/30 
                        shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)] 
                        text-white group"
        >
            <Plus size={28} strokeWidth={2.5} className="drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
        </button>

        <button 
            onClick={() => setScreen('logger')}
             className={`flex flex-col items-center gap-1 transition-colors duration-300 ${currentScreen === 'logger' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          <User size={24} className="drop-shadow-sm" />
          <span className="text-[10px] font-medium tracking-wide">Me</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;