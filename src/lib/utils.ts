import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dark mode colors based on the provided palette
export const darkTheme = {
  background: 'bg-slate-900',
  card: 'bg-slate-800',
  primary: 'bg-blue-600',
  accent: 'bg-blue-500',
  textPrimary: 'text-slate-100',
  textSecondary: 'text-slate-400',
  border: 'border-slate-700',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
} as const;

// Animation variants for Framer Motion
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Glassmorphism styles
export const glassStyle = 'bg-white/5 backdrop-blur-md border border-white/10';

export const glassCardStyle = 'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg';

// Button animation variants
export const buttonHover = {
  scale: 1.03,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};

export const buttonTap = {
  scale: 0.98,
};

// Toast styles
export const toastStyles = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
} as const;
