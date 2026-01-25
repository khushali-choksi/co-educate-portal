'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterFormProps {
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

interface FilterState {
  clientName: string;
  startDate: string;
  endDate: string;
  receiptType: string;
  dateRange: string;
}

const FilterForm = ({ onApplyFilters, onResetFilters }: FilterFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    clientName: '',
    startDate: '',
    endDate: '',
    receiptType: '',
    dateRange: ''
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockClients = [
    'Rajesh Kumar Patel',
    'Priya Sharma',
    'Amit Desai',
    'Neha Mehta',
    'Vikram Singh',
    'Anjali Joshi',
    'Karan Shah',
    'Pooja Gupta',
    'Rahul Verma',
    'Sneha Reddy'
  ];

  const dateRangePresets = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom Range', value: 'custom' }
  ];

  const receiptTypes = [
    { label: 'All Types', value: '' },
    { label: 'Physiotherapy', value: 'physiotherapy' },
    { label: 'Pilates', value: 'pilates' }
  ];

  const handleClientNameChange = (value: string) => {
    setFilters({ ...filters, clientName: value });
    
    if (value.length > 0) {
      const filtered = mockClients.filter(client =>
        client.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters({ ...filters, clientName: suggestion });
    setShowSuggestions(false);
  };

  const handleDateRangeChange = (value: string) => {
    setFilters({ ...filters, dateRange: value });
    
    if (!isHydrated) return;

    const today = new Date();
    let startDate = '';
    let endDate = '';

    switch (value) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        startDate = weekStart.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case '3months':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        startDate = threeMonthsAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'custom':
        startDate = '';
        endDate = '';
        break;
    }

    setFilters({ ...filters, dateRange: value, startDate, endDate });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      clientName: '',
      startDate: '',
      endDate: '',
      receiptType: '',
      dateRange: ''
    });
    onResetFilters();
  };

  const isCustomDateRange = filters.dateRange === 'custom';
  const hasActiveFilters = filters.clientName || filters.startDate || filters.endDate || filters.receiptType || filters.dateRange;

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-clinical-md p-6 border border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-clinical-md p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-text-primary">Advanced Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-md therapeutic-transition"
          >
            <Icon name="XMarkIcon" size={16} variant="outline" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="clientName" className="block text-sm font-medium text-text-primary mb-2">
            Client Name
          </label>
          <div className="relative">
            <input
              id="clientName"
              type="text"
              value={filters.clientName}
              onChange={(e) => handleClientNameChange(e.target.value)}
              onFocus={() => filters.clientName && setShowSuggestions(true)}
              placeholder="Search by client name..."
              className="w-full px-4 py-2.5 pl-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-secondary therapeutic-transition"
            />
            <Icon 
              name="MagnifyingGlassIcon" 
              size={20} 
              variant="outline" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-clinical-lg max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-muted therapeutic-transition first:rounded-t-md last:rounded-b-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-text-primary mb-2">
            Date Range
          </label>
          <select
            id="dateRange"
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary therapeutic-transition appearance-none bg-card"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem'
            }}
          >
            <option value="">Select date range...</option>
            {dateRangePresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {(isCustomDateRange || filters.startDate || filters.endDate) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-text-primary mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary therapeutic-transition"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-2">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary therapeutic-transition"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="receiptType" className="block text-sm font-medium text-text-primary mb-2">
            Receipt Type
          </label>
          <select
            id="receiptType"
            value={filters.receiptType}
            onChange={(e) => setFilters({ ...filters, receiptType: e.target.value })}
            className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary therapeutic-transition appearance-none bg-card"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem'
            }}
          >
            {receiptTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            onClick={handleApplyFilters}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 shadow-clinical therapeutic-transition font-medium"
          >
            <Icon name="FunnelIcon" size={20} variant="solid" />
            <span>Apply Filters</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-muted rounded-md therapeutic-transition font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;