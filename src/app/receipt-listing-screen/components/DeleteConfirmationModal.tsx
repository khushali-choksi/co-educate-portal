'use client';

import Icon from '@/components/ui/AppIcon';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  receiptCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  receiptCount,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-card rounded-lg shadow-clinical-lg max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <Icon
              name="ExclamationTriangleIcon"
              size={24}
              variant="outline"
              className="text-destructive"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
              Delete {receiptCount === 1 ? 'Receipt' : 'Receipts'}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete {receiptCount === 1 ? 'this receipt' : `these ${receiptCount} receipts`}? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 bg-destructive text-white rounded-md text-sm font-medium hover:bg-destructive/90 therapeutic-transition"
              >
                Delete {receiptCount === 1 ? 'Receipt' : 'Receipts'}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 bg-muted text-text-primary rounded-md text-sm font-medium hover:bg-muted/80 therapeutic-transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}