'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface WelcomeBannerProps {
  userName: string;
  userRole: string;
  practiceName?: string;
}

const WelcomeBanner = ({ userName, userRole, practiceName = 'CORE EDUCATE' }: WelcomeBannerProps) => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const updateDateTime = () => {
      const now = new Date();
      
      // Format date: "22 January 2026"
      const dateOptions: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-IN', dateOptions));
      
      // Format time: "09:29 AM"
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      setCurrentTime(now.toLocaleTimeString('en-IN', timeOptions).toUpperCase());
    };

    // Update immediately
    updateDateTime();

    // Update every second for real-time clock
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-brand-primary via-brand-action to-secondary rounded-2xl p-8 shadow-clinical-lg overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-white/90 text-lg">{userRole}</p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
            <Icon name="SparklesIcon" size={32} variant="solid" className="text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                <Icon name="CalendarIcon" size={20} variant="solid" className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Today&apos;s Date</p>
                <p className="text-sm font-semibold text-white">
                  {isHydrated ? currentDate : '...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                <Icon name="ClockIcon" size={20} variant="solid" className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Current Time</p>
                <p className="text-sm font-semibold text-white">
                  {isHydrated ? currentTime : '...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                <Icon name="BuildingOfficeIcon" size={20} variant="solid" className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Practice</p>
                <p className="text-sm font-semibold text-white">{practiceName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/receipt-type-selection"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-brand-primary rounded-lg font-heading font-semibold hover:bg-white/90 therapeutic-transition shadow-clinical"
          >
            <Icon name="PlusCircleIcon" size={20} variant="solid" />
            <span>ADD RECEIPTS</span>
          </Link>
          <Link
            href="/receipt-listing-screen"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 therapeutic-transition border border-white/20"
          >
            <Icon name="DocumentTextIcon" size={20} variant="outline" />
            <span>View All Receipts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;