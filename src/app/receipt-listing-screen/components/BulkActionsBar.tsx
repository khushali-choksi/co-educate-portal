'use client';

import Icon from '@/components/ui/AppIcon';

interface BulkActionsBarProps {
  selectedCount: number;
  onDownloadSelected: () => void;
  onDeleteSelected: () => void;
  onDeselectAll: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onDownloadSelected,
  onDeleteSelected,
  onDeselectAll,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-card rounded-lg border border-border shadow-clinical-lg px-6 py-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-semibold">
              {selectedCount}
            </div>
            <span className="text-sm font-medium text-text-primary">
              {selectedCount === 1 ? 'receipt' : 'receipts'} selected
            </span>
          </div>

          <div className="h-6 w-px bg-border"></div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onDownloadSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-md text-sm font-medium hover:bg-brand-action/90 therapeutic-transition"
            >
              <Icon name="ArrowDownTrayIcon" size={16} variant="outline" />
              <span>Download PDFs</span>
            </button>

            <button
              onClick={onDeleteSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-destructive text-white rounded-md text-sm font-medium hover:bg-destructive/90 therapeutic-transition"
            >
              <Icon name="TrashIcon" size={16} variant="outline" />
              <span>Delete</span>
            </button>

            <button
              onClick={onDeselectAll}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-md therapeutic-transition"
              aria-label="Deselect all"
              title="Deselect All"
            >
              <Icon name="XMarkIcon" size={20} variant="outline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}