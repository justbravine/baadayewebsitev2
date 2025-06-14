import { forwardRef } from 'react';
import { motion, HTMLMotionProps, Variants, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

type HoverEffect = 'scale' | 'glow' | 'slide' | 'rotate';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'onDrag'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hoverEffect?: HoverEffect;
}

const getHoverEffect = (effect: HoverEffect): Variants => {
  const transition: Transition = { type: 'spring', stiffness: 400, damping: 10 };
  
  switch (effect) {
    case 'glow':
      return {
        hover: { 
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
          transition: { duration: 0.2 }
        },
        tap: { scale: 0.98 }
      };
    case 'slide':
      return {
        hover: { 
          x: 4,
          transition
        },
        tap: { scale: 0.98 }
      };
    case 'rotate':
      return {
        hover: { 
          rotate: 5,
          transition
        },
        tap: { scale: 0.98 }
      };
    case 'scale':
    default:
      return {
        hover: { 
          scale: 1.05,
          transition: { duration: 0.2 }
        },
        tap: { scale: 0.98 }
      };
  }
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    hoverEffect = 'scale',
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'relative rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
    
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30',
      ghost: 'hover:bg-gray-100 text-gray-700 dark:hover:bg-slate-800 dark:text-slate-300',
      link: 'text-blue-600 hover:underline p-0 h-auto dark:text-blue-400',
      icon: 'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const iconSizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
      xl: 'p-4',
    };
    
    const sizeClass = variant === 'icon' ? iconSizes[size] || iconSizes.md : sizes[size] || sizes.md;
    const widthClass = fullWidth ? 'w-full' : 'w-auto';
    const isIconOnly = !children && variant !== 'link';
    const hoverVariants = getHoverEffect(hoverEffect);

    return (
      <motion.button
        variants={hoverVariants}
        initial={false}
        whileHover="hover"
        whileTap="tap"
        className={cn(
          baseStyles,
          variants[variant],
          sizeClass,
          widthClass,
          'relative overflow-hidden',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-offset-slate-900',
          isIconOnly && '!p-0 aspect-square',
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...(props as Omit<HTMLMotionProps<'button'>, 'onDrag'>)}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/30 backdrop-blur-sm">
            <svg 
              className="animate-spin h-5 w-5 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        
        <span className={cn(
          'flex items-center gap-2',
          isLoading && 'opacity-0',
          variant === 'icon' && 'justify-center'
        )}>
          {icon && iconPosition === 'left' && (
            <span className={cn(
              'flex-shrink-0',
              children ? 'mr-1.5' : ''
            )}>
              {icon}
            </span>
          )}
          <>{children}</>
          {icon && iconPosition === 'right' && (
            <span className={cn(
              'flex-shrink-0',
              children ? 'ml-1.5' : ''
            )}>
              {icon}
            </span>
          )}
        </span>
        
        {variant === 'primary' && (
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
