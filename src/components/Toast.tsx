import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />,
  };

  const colorClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="flex items-start gap-3 bg-white dark:bg-gray-900 rounded-xl shadow-soft-lg p-4 min-w-[320px] max-w-md border border-gray-200 dark:border-gray-800 animate-slide-in">
      {/* Icon */}
      <div className={`${colorClasses[type]} text-white p-2 rounded-lg flex-shrink-0`}>
        {icons[type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
        {message && <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>}
      </div>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default Toast;
