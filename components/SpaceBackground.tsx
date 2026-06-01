"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Nebula {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  duration: number;
}

const SpaceBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nebulae, setNebulae] = useState<Nebula[]>([]);
  const [twinkles, setTwinkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    // Create floating particles
    const particleInterval = setInterval(() => {
      if (particles.length < 30) {
        const newParticle: Particle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          duration: Math.random() * 10 + 5,
          delay: Math.random() * 2,
        };
        setParticles(prev => [...prev, newParticle]);
      }
    }, 500);

    // Create nebula effects
    const nebulaInterval = setInterval(() => {
      if (nebulae.length < 5) {
        const colors = ['#8B5CF6', '#3B82F6', '#22D3EE', '#10B981', '#F59E0B'];
        const newNebula: Nebula = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.1 + 0.05,
          duration: Math.random() * 20 + 10,
        };
        setNebulae(prev => [...prev, newNebula]);
      }
    }, 3000);

    // Create twinkling stars
    const twinkleInterval = setInterval(() => {
      if (twinkles.length < 50) {
        const newTwinkle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 1.5 + 0.5,
        };
        setTwinkles(prev => [...prev, newTwinkle]);
      }
    }, 200);

    return () => {
      clearInterval(particleInterval);
      clearInterval(nebulaInterval);
      clearInterval(twinkleInterval);
    };
  }, [particles.length, nebulae.length, twinkles.length]);

  const removeParticle = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  const removeNebula = (id: number) => {
    setNebulae(prev => prev.filter(n => n.id !== id));
  };

  const removeTwinkle = (id: number) => {
    setTwinkles(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Nebula Effects */}
      <AnimatePresence>
        {nebulae.map(nebula => (
          <motion.div
            key={nebula.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: nebula.opacity, 
              scale: 1,
              x: nebula.x,
              y: nebula.y,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: nebula.duration,
              ease: "easeInOut"
            }}
            className="absolute rounded-full blur-3xl"
            style={{
              width: nebula.size,
              height: nebula.size,
              backgroundColor: nebula.color,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Twinkling Stars */}
      <AnimatePresence>
        {twinkles.map(twinkle => (
          <motion.div
            key={twinkle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            onAnimationComplete={() => removeTwinkle(twinkle.id)}
            className="absolute bg-white rounded-full"
            style={{
              left: `${twinkle.x}%`,
              top: `${twinkle.y}%`,
              width: twinkle.size,
              height: twinkle.size,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 0,
              x: particle.x,
              y: particle.y,
            }}
            animate={{ 
              opacity: particle.opacity,
              x: [particle.x, particle.x + (Math.random() - 0.5) * 20],
              y: [particle.y, particle.y + (Math.random() - 0.5) * 20],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeInOut"
            }}
            onAnimationComplete={() => removeParticle(particle.id)}
            className="absolute bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.6)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Static distant stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 1 + 0.5,
              height: Math.random() * 1 + 0.5,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpaceBackground;