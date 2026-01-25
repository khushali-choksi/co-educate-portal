'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface FormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const FormActions = ({ onSubmit, isSubmitting, isEditMode = false }: FormActionsProps) => {
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    router.push(isEditMode ? '/receipt-listing-screen' : '/main-dashboard');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 bg-muted text-text-primary rounded-lg font-medium therapeutic-transition hover:bg-border focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-action text-white rounded-lg font-medium therapeutic-transition hover:shadow-clinical-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isEditMode ? 'Updating...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <Icon name={isEditMode ? "CheckIcon" : "DocumentCheckIcon"} size={20} variant="outline" />
                <span>{isEditMode ? 'Update Receipt' : 'Generate Receipt'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg shadow-clinical-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10">
                <Icon name="ExclamationTriangleIcon" size={24} variant="outline" className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary">Discard Changes?</h3>
                <p className="text-sm text-text-secondary">All unsaved data will be lost</p>
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to cancel? Any information you've entered will not be saved.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 bg-muted text-text-primary rounded-lg font-medium therapeutic-transition hover:bg-border focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Continue Editing
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium therapeutic-transition hover:shadow-clinical focus:outline-none focus:ring-2 focus:ring-destructive"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormActions;
