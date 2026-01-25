import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Icon name="FunnelIcon" size={32} variant="outline" className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          No Receipts Found
        </h3>
        <p className="text-sm text-text-secondary text-center max-w-md mb-6">
          No receipts match your current filter criteria. Try adjusting your filters or clear them to see all receipts.
        </p>
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 therapeutic-transition"
        >
          <Icon name="XMarkIcon" size={18} variant="outline" />
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-action mb-4">
        <Icon name="DocumentTextIcon" size={32} variant="outline" className="text-white" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
        No Receipts Yet
      </h3>
      <p className="text-sm text-text-secondary text-center max-w-md mb-6">
        You haven't created any receipts yet. Start by adding your first receipt to track client payments and services.
      </p>
      <Link
        href="/receipt-type-selection"
        className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 therapeutic-transition"
      >
        <Icon name="PlusCircleIcon" size={18} variant="outline" />
        <span>Add First Receipt</span>
      </Link>
    </div>
  );
}