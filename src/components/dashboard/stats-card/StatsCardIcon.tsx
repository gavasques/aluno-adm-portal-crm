
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardIconProps {
  icon: LucideIcon;
  gradient: string;
  delay: number;
}

export const StatsCardIcon: React.FC<StatsCardIconProps> = ({ icon: Icon, gradient, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        delay: delay + 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-modern-2 group-hover:shadow-modern-3 transition-shadow duration-300`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300`} />
    </motion.div>
  );
};
