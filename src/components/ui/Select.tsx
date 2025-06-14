import { SelectHTMLAttributes, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  containerClassName?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    label, 
    error, 
    options, 
    value = '', 
    onChange,
    containerClassName = '',
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedOption = options.find(opt => opt.value === value) || { label: 'Select an option', value: '' };
    
    const handleSelect = (value: string) => {
      onChange?.(value);
      setIsOpen(false);
    };

    return (
      <div className={`relative ${containerClassName}`} ref={ref}>
        {label && (
          <label 
            className={`block text-sm font-medium mb-1.5 ${
              error ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 text-left bg-white/70 backdrop-blur-sm border ${
              error
                ? 'border-red-400 focus:border-red-500'
                : isOpen
                ? 'border-blue-400 focus:border-blue-500'
                : 'border-gray-200 hover:border-gray-300'
            } rounded-xl focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-200 flex items-center justify-between`}
          >
            <span className={`${!selectedOption.value ? 'text-gray-400' : ''}`}>
              {selectedOption.label}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <ul className="py-1 max-h-60 overflow-auto">
                  {options.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                          value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        onClick={() => handleSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-6 left-0 text-red-600 text-xs mt-1"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
