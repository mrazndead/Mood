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
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* Glow Behind */}
      <motion.div 
        className="absolute inset-4 rounded-full blur-[60px] opacity-40"
        animate={{ backgroundColor: mood.planetColor }}
        transition={{ duration: 0.8 }}
      />

      {/* The Planet Body */}
      <motion.div
        className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_-25px_-25px_60px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.15)] cursor-pointer"
        animate={{ 
            backgroundColor: mood.planetColor,
            y: isAnimating ? [0, -12, 0] : 0
        }}
        transition={{ 
            backgroundColor: { duration: 0.6 },
            y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
        }}
        onPointerDown={handlePointerDown}
        whileTap={{ scale: 0.97 }}
      >
        {/* Texture/Craters - Dynamic based on mood type */}
        <div className="absolute inset-0 opacity-30">
            <div className="absolute w-20 h-20 bg-black/10 rounded-full top-10 left-12 blur-[2px]" />
            <div className="absolute w-12 h-12 bg-black/10 rounded-full top-36 left-6 blur-[1px]" />
            <div className="absolute w-24 h-24 bg-black/5 rounded-full bottom-10 right-10 blur-[3px]" />
            <div className="absolute w-8 h-8 bg-white/20 rounded-full top-20 right-20 blur-[1px]" />
            
            {/* Swirl patterns for some moods */}
            {['Great', 'Okay', 'Low'].includes(mood.type) && (
                <div className="absolute inset-0 border-[15px] border-white/10 rounded-full scale-110 -translate-x-10 translate-y-10 blur-sm" />
            )}
        </div>
        
        {/* Ripples */}
        <AnimatePresence>
            {ripples.map(r => (
                <motion.div
                    key={r.id}
                    initial={{ opacity: 0.4, scale: 0 }}
                    animate={{ opacity: 0, scale: 2.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute rounded-full bg-white/30 border border-white/40 pointer-events-none"
                    style={{
                        width: 120,
                        height: 120,
                        left: r.x,
                        top: r.y,
                        x: "-50%",
                        y: "-50%",
                    }}
                    onAnimationComplete={() => setRipples(prev => prev.filter(item => item.id !== r.id))}
                />
            ))}
        </AnimatePresence>

        {/* Shine/Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/25 rounded-full pointer-events-none" />
      </motion.div>

      {/* Rings for specific moods like in the design */}
      {mood.type === 'Okay' && (
        <motion.div 
            initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
            animate={{ opacity: 1, rotate: -20, scale: 1.1 }}
            className="absolute w-[120%] h-12 border-[10px] border-white/20 rounded-[100%] pointer-events-none blur-[1px]"
        />
      )}
    </div>
  );
};

export default Planet;