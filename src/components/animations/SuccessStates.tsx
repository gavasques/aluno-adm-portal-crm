
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfettiProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ isVisible, onComplete }) => {
  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-green-500'][
      Math.floor(Math.random() * 5)
    ]
  }));

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className={cn("absolute w-2 h-2 rounded", piece.color)}
              initial={{
                x: `${piece.x}%`,
                y: -20,
                rotate: 0,
                scale: 1,
                opacity: 1
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360,
                scale: [1, 0.8, 0.6],
                opacity: [1, 0.8, 0]
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeOut"
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

interface SuccessCheckmarkProps {
  isVisible: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'check' | 'star' | 'heart';
  className?: string;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  isVisible,
  size = 'md',
  variant = 'check',
  className
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const icons = {
    check: CheckCircle,
    star: Star,
    heart: Heart
  };

  const Icon = icons[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            rotate: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.6
            }
          }}
          exit={{ scale: 0, opacity: 0 }}
          className={cn("relative", className)}
        >
          <Icon className={cn(sizes[size], "text-green-500")} />
          
          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-500"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ 
              scale: [1, 2, 3], 
              opacity: [0.8, 0.3, 0],
              transition: { duration: 1, ease: "easeOut" }
            }}
          />
          
          {/* Sparkles */}
          {variant === 'check' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 60}deg) translateY(-${size === 'lg' ? '3rem' : size === 'md' ? '2rem' : '1.5rem'})`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    opacity: [0, 1, 0],
                    transition: { 
                      duration: 1.2, 
                      delay: 0.3 + i * 0.1,
                      ease: "easeOut" 
                    }
                  }}
                >
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PulseRippleProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PulseRipple: React.FC<PulseRippleProps> = ({ 
  isActive, 
  children, 
  className 
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      <AnimatePresence>
        {isActive && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-blue-400"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ 
                  scale: [1, 2, 3], 
                  opacity: [0.6, 0.3, 0],
                  transition: { 
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeOut" 
                  }
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  isExpanded?: boolean;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  isExpanded = false,
  className
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 bg-blue-500 text-white rounded-full shadow-lg flex items-center space-x-3 z-50",
        "hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4">
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && label && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pr-4 whitespace-nowrap font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
