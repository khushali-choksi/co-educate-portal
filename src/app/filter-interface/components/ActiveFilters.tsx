'use client';

import Icon from '@/components/ui/AppIcon';

interface ActiveFiltersProps {
  filters: {
    clientName: string;
    startDate: string;
    endDate: string;
    receiptType: string;
    dateRange: string;
  };
  onRemoveFilter: (filterKey: string) => void;
}

const ActiveFilters = ({ filters, onRemoveFilter }: ActiveFiltersProps) => {
  const activeFilters = [];

  if (filters.clientName) {
    activeFilters.push({
      key: 'clientName',
      label: 'Client',
      value: filters.clientName
    });
  }

  if (filters.dateRange && filters.dateRange !== 'custom') {
    const rangeLabels: { [key: string]: string } = {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      '3months': 'Last 3 Months',
      year: 'This Year'
    };
    activeFilters.push({
      key: 'dateRange',
      label: 'Date Range',
      value: rangeLabels[filters.dateRange] || filters.dateRange
    });
  }

  if (filters.startDate && filters.endDate) {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    activeFilters.push({
      key: 'customDate',
      label: 'Custom Date',
      value: `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
    });
  }

  if (filters.receiptType) {
    activeFilters.push({
      key: 'receiptType',
      label: 'Type',
      value: filters.receiptType.charAt(0).toUpperCase() + filters.receiptType.slice(1)
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-bg rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center space-x-2">
          <Icon name="FunnelIcon" size={16} variant="solid" className="text-primary" />
          <span>Active Filters</span>
        </h3>
        <span className="text-xs text-text-secondary bg-primary/10 px-2 py-1 rounded-full">
          {activeFilters.length} active
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="flex items-center space-x-2 bg-card px-3 py-1.5 rounded-md border border-border shadow-clinical"
          >
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary">{filter.label}</span>
              <span className="text-sm font-medium text-text-primary">{filter.value}</span>
            </div>
            <button
              onClick={() => onRemoveFilter(filter.key)}
              className="text-text-secondary hover:text-destructive therapeutic-transition"
              aria-label={`Remove ${filter.label} filter`}
            >
              <Icon name="XMarkIcon" size={16} variant="outline" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;