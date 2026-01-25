'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    clientName: string;
    startDate: string;
    endDate: string;
    receiptType: string;
    dateRange: string;
  };
  createdAt: string;
}

interface SavedFiltersProps {
  onLoadFilter: (filters: SavedFilter['filters']) => void;
}

const SavedFilters = ({ onLoadFilter }: SavedFiltersProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    setIsHydrated(true);
    const mockSavedFilters: SavedFilter[] = [
      {
        id: '1',
        name: 'This Month Physiotherapy',
        filters: {
          clientName: '',
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          receiptType: 'physiotherapy',
          dateRange: 'month'
        },
        createdAt: '2026-01-15'
      },
      {
        id: '2',
        name: 'Pilates Clients',
        filters: {
          clientName: '',
          startDate: '',
          endDate: '',
          receiptType: 'pilates',
          dateRange: ''
        },
        createdAt: '2026-01-10'
      }
    ];
    setSavedFilters(mockSavedFilters);
  }, []);

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    setShowSaveDialog(false);
    setFilterName('');
  };

  const handleDeleteFilter = (id: string) => {
    setSavedFilters(savedFilters.filter(f => f.id !== id));
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-clinical-md p-6 border border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-clinical-md p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-text-primary">Saved Filters</h2>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md therapeutic-transition"
        >
          <Icon name="BookmarkIcon" size={16} variant="outline" />
          <span>Save Current</span>
        </button>
      </div>

      {savedFilters.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="BookmarkIcon" size={48} variant="outline" className="mx-auto text-text-secondary mb-3" />
          <p className="text-sm text-text-secondary">No saved filters yet</p>
          <p className="text-xs text-text-secondary mt-1">Save your frequently used filter combinations</p>
        </div>
      ) : (
        <div className="space-y-2">
          {savedFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between p-3 bg-gradient-bg rounded-md border border-border hover:shadow-clinical therapeutic-transition"
            >
              <button
                onClick={() => onLoadFilter(filter.filters)}
                className="flex-1 text-left"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="FunnelIcon" size={18} variant="solid" className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{filter.name}</p>
                    <p className="text-xs text-text-secondary">
                      Created {new Date(filter.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleDeleteFilter(filter.id)}
                className="p-2 text-text-secondary hover:text-destructive hover:bg-destructive/10 rounded-md therapeutic-transition"
                aria-label="Delete saved filter"
              >
                <Icon name="TrashIcon" size={18} variant="outline" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-clinical-lg max-w-md w-full p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Save Filter Combination</h3>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter filter name..."
              className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-secondary mb-4"
              autoFocus
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveFilter}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 therapeutic-transition font-medium"
              >
                Save Filter
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setFilterName('');
                }}
                className="px-4 py-2.5 border border-border text-text-secondary hover:text-text-primary hover:bg-muted rounded-md therapeutic-transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedFilters;