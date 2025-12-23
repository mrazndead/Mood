import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
