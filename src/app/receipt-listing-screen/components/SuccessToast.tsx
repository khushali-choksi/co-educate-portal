'use client';

import { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function SuccessToast({
  message,
  isVisible,
  onClose,
}: SuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
      <div className="bg-card rounded-lg border border-success/20 shadow-clinical-lg px-4 py-3 flex items-center space-x-3 min-w-[300px]">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
          <Icon
            name="CheckCircleIcon"
            size={20}
            variant="solid"
            className="text-success"
          />
        </div>
        <p className="flex-1 text-sm font-medium text-text-primary">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-text-secondary hover:text-text-primary therapeutic-transition"
          aria-label="Close notification"
        >
          <Icon name="XMarkIcon" size={18} variant="outline" />
        </button>
      </div>
    </div>
  );
}