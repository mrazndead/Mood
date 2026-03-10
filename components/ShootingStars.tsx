"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelestialObjectProps {
  id: number;
  onComplete: (id: number) => void;
}

const ShootingStar: React.FC<CelestialObjectProps> = ({ id, onComplete }) => {
  const [config] = useState(() => ({
    startX: Math.random() * 80 + 10,
    startY: Math.random() * 40 + 5,
    duration: 0.6 + Math.random() * 0.8,
    length: 80 + Math.random() * 120,
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
        left: `${config.startX + 20}%`, 
        top: `${config.startY + 20}%`, 
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
      }}
      transition={{ 
        duration: config.duration, 
        ease: "linear" 
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] z-0"
    >
      <div 
        className="absolute top-1/2 right-0 h-[1.5px] bg-gradient-to-l from-white/80 to-transparent -translate-y-1/2 origin-right" 
        style={{ width: config.length }}
      />
    </motion.div>
  );
};

const Meteor: React.FC<CelestialObjectProps> = ({ id, onComplete }) => {
  const [config] = useState(() => ({
    startX: -20,
    startY: 10 + Math.random() * 50,
    endY: (10 + Math.random() * 50) + (Math.random() * 10 - 5), // Slight diagonal drift
    duration: 6 + Math.random() * 4,
    size: 2 + Math.random() * 2,
  }));

  return (
    <motion.div
      initial={{ 
        left: `${config.startX}%`, 
        top: `${config.startY}%`, 
        opacity: 0,
        scale: 0.5
      }}
      animate={{ 
        left: '120%', 
        top: `${config.endY}%`, 
        opacity: [0, 0.3, 0.3, 0],
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{ 
        duration: config.duration, 
        ease: "linear" 
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute bg-white/10 rounded-full blur-[1px] z-0"
      style={{ width: config.size, height: config.size }}
    >
      {/* Horizontal trail */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[150px] h-[1px] bg-gradient-to-l from-white/5 to-transparent origin-right" />
    </motion.div>
  );
};

const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; type: 'star' | 'meteor' }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      // Decreased shooting star spawn rate by 40% (from 0.6 to 0.36 chance)
      if (rand > 0.64) { 
        setStars(prev => [...prev, { id: Date.now(), type: 'star' }]);
      }
      // Occasional meteors
      if (rand > 0.92) { 
        setStars(prev => [...prev, { id: Date.now() + 1, type: 'meteor' }]);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const removeObject = (id: number) => {
    setStars(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence>
        {stars.map(obj => (
          obj.type === 'star' ? (
            <ShootingStar key={obj.id} id={obj.id} onComplete={removeObject} />
          ) : (
            <Meteor key={obj.id} id={obj.id} onComplete={removeObject} />
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ShootingStars;