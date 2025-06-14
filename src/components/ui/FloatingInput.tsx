import { InputHTMLAttributes, forwardRef, useState, FocusEvent } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ id, label, className = '', error, containerClassName = '', onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(props.value && String(props.value).length > 0);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div className={cn('relative pt-5', containerClassName)}>
        <div className="relative z-0">
          <input
            ref={ref}
            id={id}
            className={cn(
              'peer block w-full appearance-none bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600',
              'focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-0',
              'py-2.5 px-0 text-gray-900 dark:text-white text-sm bg-transparent',
              error ? 'border-red-500 dark:border-red-400' : '',
              className
            )}
            placeholder=" "
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              'absolute left-0 -top-1 -z-10 origin-[0] transform text-sm',
              'duration-300 peer-focus:scale-75 peer-focus:-translate-y-4',
              'text-gray-500 dark:text-gray-400 peer-focus:text-blue-600 dark:peer-focus:text-blue-400',
              (isFocused || hasValue) ? 'scale-75 -translate-y-4' : 'translate-y-0',
              error ? 'text-red-500 dark:text-red-400' : ''
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';
