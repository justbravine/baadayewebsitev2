import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const toast = (type: ToastType, message: string, options: ToastOptions = {}) => {
    const { title, description, duration = 5000, action } = options;
    
    const toastConfig = {
      duration,
      ...(action && {
        action: {
          label: action.label,
          onClick: action.onClick,
        },
      }),
    };

    switch (type) {
      case 'success':
        sonnerToast.success(title || 'Success', {
          description: description || message,
          ...toastConfig,
        });
        break;
      case 'error':
        sonnerToast.error(title || 'Error', {
          description: description || message,
          ...toastConfig,
        });
        break;
      case 'warning':
        sonnerToast.warning(title || 'Warning', {
          description: description || message,
          ...toastConfig,
        });
        break;
      case 'info':
      default:
        sonnerToast.info(title || 'Info', {
          description: description || message,
          ...toastConfig,
        });
        break;
    }
  };

  return {
    success: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      toast('success', message, options),
    error: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      toast('error', message, options),
    warning: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      toast('warning', message, options),
    info: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      toast('info', message, options),
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
  };
}
