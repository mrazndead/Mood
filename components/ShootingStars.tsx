"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShootingStarProps {
  id: number;
  onComplete: (id: number) => void;
}

const ShootingStar: React.FC<ShootingStarProps> = ({ id, onComplete }) => {
  const [config] = useState(() => ({
    startX: Math.random() * 80 + 10, // 10% to 90%
    startY: Math.random() * 40 + 5,  // 5% to 45%
    duration: 0.8 + Math.random() * 1.2,
    length: 60 + Math.random() * 100,
  }));
  
  return (
    <motion.div
      initial={{ 
        left: `${config.startX}%`, 
        top: `${config.startY}%`, 
        opacity: 0,
        scale: 0,
        rotate: -35
      }}
      animate={{ 
        left: `${config.startX + 15}%`, 
        top: `${config.startY + 15}%`, 
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
      }}
      transition={{ 
        duration: config.duration, 
        ease: "easeOut" 
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white] z-0"
    >
      <div 
        className="absolute top-1/2 right-0 h-[1px] bg-gradient-to-l from-white/60 to-transparent -translate-y-1/2 origin-right" 
        style={{ width: config.length }}
      />
    </motion.div>
  );
};

const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<{ id: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setStars(prev => [...prev, { id: Date.now() }]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const removeStar = (id: number) => {
    setStars(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence>
        {stars.map(star => (
          <ShootingStar key={star.id} id={star.id} onComplete={removeStar} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ShootingStars;