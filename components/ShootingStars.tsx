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
    startX: Math.random() * 100,
    startY: -10,
    endX: Math.random() * 100 - 50, // Moves diagonally
    duration: 3 + Math.random() * 4,
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
        left: `${config.startX + config.endX}%`, 
        top: '110%', 
        opacity: [0, 0.4, 0.4, 0],
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{ 
        duration: config.duration, 
        ease: "linear" 
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute bg-white/20 rounded-full blur-[1px] z-0"
      style={{ width: config.size, height: config.size }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] bg-gradient-to-t from-white/10 to-transparent origin-bottom" />
    </motion.div>
  );
};

const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; type: 'star' | 'meteor' }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.4) { // Increased frequency
        setStars(prev => [...prev, { id: Date.now(), type: 'star' }]);
      }
      if (rand > 0.85) { // Occasional meteors
        setStars(prev => [...prev, { id: Date.now() + 1, type: 'meteor' }]);
      }
    }, 1500); // Faster spawn rate
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