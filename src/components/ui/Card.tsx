import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glass?: boolean;
}

const Card = ({ children, className = '', hoverEffect = false, glass = false }: CardProps) => {
  const baseStyles = `rounded-2xl p-6 ${glass ? 'bg-white/30 backdrop-blur-lg border border-white/20' : 'bg-white'} shadow-sm ${hoverEffect ? 'hover:shadow-md' : ''} transition-all duration-300 ${className}`;
  
  if (hoverEffect) {
    return (
      <motion.div 
        className={baseStyles}
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseStyles}>{children}</div>;
};

export default Card;
