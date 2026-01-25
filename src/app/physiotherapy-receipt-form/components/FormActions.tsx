'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface FormActionsProps {
  onSave: () => void;
  onSaveAndSend: (e: React.FormEvent) => void;
  isSaving: boolean;
  isEditMode?: boolean;
}

export default function FormActions({ onSave, onSaveAndSend, isSaving, isEditMode = false }: FormActionsProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
        <div className="w-full sm:w-auto h-12 bg-muted/50 rounded-lg animate-pulse"></div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-32 h-12 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="w-full sm:w-40 h-12 bg-muted/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      <Link
        href={isEditMode ? "/receipt-listing-screen" : "/main-dashboard"}
        className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-input text-text-secondary hover:text-text-primary hover:bg-muted therapeutic-transition w-full sm:w-auto justify-center"
      >
        <Icon name="ArrowLeftIcon" size={18} variant="outline" />
        <span className="font-medium">{isEditMode ? 'Cancel' : 'Back to Dashboard'}</span>
      </Link>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          type="submit"
          onClick={onSaveAndSend}
          disabled={isSaving}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 therapeutic-transition disabled:opacity-50 disabled:cursor-not-allowed clinical-shadow w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Processing...</span>
            </>
          ) : (
            <>
              <Icon name={isEditMode ? "CheckIcon" : "PaperAirplaneIcon"} size={18} variant="solid" />
              <span className="font-medium">{isEditMode ? 'Update Receipt' : 'Generate Receipt'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
