'use client';

import { useState } from 'react';
import FilterForm from './FilterForm';
import ActiveFilters from './ActiveFilters';
import SavedFilters from './SavedFilters';
import FilterResults from './FilterResults';

interface FilterState {
  clientName: string;
  startDate: string;
  endDate: string;
  receiptType: string;
  dateRange: string;
}

const FilterInteractive = () => {
  const [filters, setFilters] = useState<FilterState>({
    clientName: '',
    startDate: '',
    endDate: '',
    receiptType: '',
    dateRange: ''
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    clientName: '',
    startDate: '',
    endDate: '',
    receiptType: '',
    dateRange: ''
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      clientName: '',
      startDate: '',
      endDate: '',
      receiptType: '',
      dateRange: ''
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const handleRemoveFilter = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };
    
    if (filterKey === 'customDate') {
      updatedFilters.startDate = '';
      updatedFilters.endDate = '';
    } else if (filterKey === 'dateRange') {
      updatedFilters.dateRange = '';
      updatedFilters.startDate = '';
      updatedFilters.endDate = '';
    } else {
      updatedFilters[filterKey as keyof FilterState] = '';
    }
    
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
  };

  const handleLoadFilter = (savedFilters: FilterState) => {
    setFilters(savedFilters);
    setAppliedFilters(savedFilters);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FilterForm 
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>
        <div>
          <SavedFilters onLoadFilter={handleLoadFilter} />
        </div>
      </div>

      {(appliedFilters.clientName || appliedFilters.startDate || appliedFilters.endDate || appliedFilters.receiptType || appliedFilters.dateRange) && (
        <ActiveFilters 
          filters={appliedFilters}
          onRemoveFilter={handleRemoveFilter}
        />
      )}

      <FilterResults filters={appliedFilters} />
    </div>
  );
};

export default FilterInteractive;