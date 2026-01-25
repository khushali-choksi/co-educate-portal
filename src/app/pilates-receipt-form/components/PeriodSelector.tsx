'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PeriodSelectorProps {
  membershipType: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const PeriodSelector = ({ 
  membershipType, 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: PeriodSelectorProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (startDate && membershipType) {
      const start = new Date(startDate);
      let calculatedEndDate = new Date(start);

      switch (membershipType) {
        case 'monthly':
          calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 1);
          break;
        case 'quarterly':
          calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 3);
          break;
        case 'annual':
          calculatedEndDate.setFullYear(calculatedEndDate.getFullYear() + 1);
          break;
        default:
          calculatedEndDate = new Date(start);
      }

      calculatedEndDate.setDate(calculatedEndDate.getDate() - 1);
      const formattedEndDate = calculatedEndDate.toISOString().split('T')[0];
      onEndDateChange(formattedEndDate);
    }
  }, [startDate, membershipType, onEndDateChange]);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Start Date <span className="text-destructive">*</span>
          </label>
          <div className="w-full px-4 py-3 bg-muted border border-border rounded-lg">
            <div className="h-5 bg-border rounded animate-pulse"></div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            End Date <span className="text-destructive">*</span>
          </label>
          <div className="w-full px-4 py-3 bg-muted border border-border rounded-lg">
            <div className="h-5 bg-border rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-text-primary mb-2">
          Start Date <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={today}
            required
            className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="CalendarIcon" size={20} variant="outline" className="text-text-secondary" />
          </div>
        </div>
        <p className="mt-1 text-xs text-text-secondary">Select membership start date</p>
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-2">
          End Date <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            id="endDate"
            value={endDate}
            readOnly={membershipType !== 'individual'}
            required
            className={`w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              membershipType !== 'individual' ? 'bg-muted cursor-not-allowed' : ''
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="CalendarIcon" size={20} variant="outline" className="text-text-secondary" />
          </div>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          {membershipType !== 'individual' ? 'Auto-calculated based on membership type' : 'Select membership end date'}
        </p>
      </div>
    </div>
  );
};

export default PeriodSelector;