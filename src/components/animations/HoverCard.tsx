
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'lift' | 'scale' | 'glow' | 'magnetic';
  onClick?: () => void;
}

const hoverVariants = {
  lift: {
    rest: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: { 
      y: -8, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98, y: -4 }
  },
  scale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.95 }
  },
  glow: {
    rest: { 
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
      borderColor: "rgba(226, 232, 240, 1)"
    },
    hover: { 
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.3 }
    }
  },
  magnetic: {
    rest: { x: 0, y: 0 },
    hover: { 
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }
};

export const HoverCard: React.FC<HoverCardProps> = ({ 
  children, 
  className, 
  variant = 'lift',
  onClick 
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (variant === 'magnetic') {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;
      setMousePosition({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseLeave = () => {
    if (variant === 'magnetic') {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      variants={hoverVariants[variant]}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={variant === 'magnetic' ? { 
        x: mousePosition.x, 
        y: mousePosition.y 
      } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
        variant === 'glow' && "border-2",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default HoverCard;
