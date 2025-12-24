import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodDefinition } from '../types';

interface PlanetProps {
  mood: MoodDefinition;
  isAnimating?: boolean;
}

const Planet: React.FC<PlanetProps> = ({ mood, isAnimating = true }) => {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples(prev => [...prev, { x, y, id: Date.now() }]);
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Orbit Rings */}
      <div className="absolute inset-[-40px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-[-20px] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      
      {/* Glow Behind */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-[50px] opacity-60"
        animate={{ backgroundColor: mood.planetColor }}
        transition={{ duration: 1 }}
      />

      {/* The Planet Body */}
      <motion.div
        className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.3)] cursor-pointer"
        animate={{ 
            backgroundColor: mood.planetColor,
            y: isAnimating ? [0, -15, 0] : 0
        }}
        transition={{ 
            backgroundColor: { duration: 0.8 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
        }}
        onPointerDown={handlePointerDown}
        whileTap={{ scale: 0.98 }}
      >
        {/* Texture/Craters */}
        <div className="absolute w-16 h-16 bg-black/10 rounded-full top-8 left-10 blur-sm pointer-events-none" />
        <div className="absolute w-8 h-8 bg-black/10 rounded-full top-32 left-8 blur-sm pointer-events-none" />
        <div className="absolute w-20 h-20 bg-black/5 rounded-full bottom-8 right-12 blur-sm pointer-events-none" />
        
        {/* Ripples */}
        <AnimatePresence>
            {ripples.map(r => (
                <motion.div
                    key={r.id}
                    initial={{ opacity: 0.5, scale: 0 }}
                    animate={{ opacity: 0, scale: 3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute rounded-full bg-white/20 border border-white/30 pointer-events-none"
                    style={{
                        width: 100,
                        height: 100,
                        left: r.x,
                        top: r.y,
                        x: "-50%",
                        y: "-50%",
                    }}
                    onAnimationComplete={() => setRipples(prev => prev.filter(item => item.id !== r.id))}
                />
            ))}
        </AnimatePresence>

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-full pointer-events-none" />
      </motion.div>

      {/* Emoji Face Wrapper (maintained for structure) */}
      <AnimatePresence mode='wait'>
        <motion.div
            key={mood.type}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute z-10 text-6xl drop-shadow-lg pointer-events-none"
        >
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Planet;