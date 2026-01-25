'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  totalReceipts: number;
  filteredCount: number;
}

export interface FilterState {
  searchQuery: string;
  receiptType: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
}

export default function FilterPanel({
  onFilterChange,
  totalReceipts,
  filteredCount,
}: FilterPanelProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    receiptType: 'all',
    paymentStatus: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      onFilterChange(filters);
    }
  }, [filters, isHydrated, onFilterChange]);

  const handleReset = () => {
    const resetFilters: FilterState = {
      searchQuery: '',
      receiptType: 'all',
      paymentStatus: 'all',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(resetFilters);
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.receiptType !== 'all' ||
    filters.paymentStatus !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-clinical">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-clinical">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="FunnelIcon" size={20} variant="outline" className="text-brand-primary" />
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              Filter Receipts
            </h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-muted therapeutic-transition"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <Icon
              name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              size={20}
              variant="outline"
            />
          </button>
        </div>

        <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Search by Client Name or Receipt Number
            </label>
            <div className="relative">
              <Icon
                name="MagnifyingGlassIcon"
                size={18}
                variant="outline"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                id="search"
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                placeholder="Search receipts..."
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent therapeutic-transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="receiptType"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Receipt Type
              </label>
              <select
                id="receiptType"
                value={filters.receiptType}
                onChange={(e) =>
                  setFilters({ ...filters, receiptType: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent therapeutic-transition"
              >
                <option value="all">All Types</option>
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Pilates">Pilates</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={filters.paymentStatus}
                onChange={(e) =>
                  setFilters({ ...filters, paymentStatus: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent therapeutic-transition"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                From Date
              </label>
              <input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent therapeutic-transition"
              />
            </div>

            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                To Date
              </label>
              <input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent therapeutic-transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-text-secondary">
              Showing <span className="font-semibold text-text-primary">{filteredCount}</span> of{' '}
              <span className="font-semibold text-text-primary">{totalReceipts}</span> receipts
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-muted rounded-md therapeutic-transition"
              >
                <Icon name="XMarkIcon" size={16} variant="outline" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}