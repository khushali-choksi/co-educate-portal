'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AutoSaveIndicatorProps {
  lastSaved: string | null;
}

export default function AutoSaveIndicator({ lastSaved }: AutoSaveIndicatorProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || !lastSaved) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-text-secondary">
      <Icon name="CloudIcon" size={16} variant="outline" />
      <span>Last saved: {lastSaved}</span>
    </div>
  );
}