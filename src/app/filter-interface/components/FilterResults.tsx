'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Receipt {
  id: string;
  receiptNumber: string;
  clientName: string;
  receiptType: 'physiotherapy' | 'pilates';
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface FilterResultsProps {
  filters: {
    clientName: string;
    startDate: string;
    endDate: string;
    receiptType: string;
    dateRange: string;
  };
}

const FilterResults = ({ filters }: FilterResultsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [results, setResults] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const mockReceipts: Receipt[] = [
        {
          id: '1',
          receiptNumber: 'RCP-2026-001',
          clientName: 'Rajesh Kumar Patel',
          receiptType: 'physiotherapy',
          amount: 2500,
          date: '2026-01-15',
          status: 'paid'
        },
        {
          id: '2',
          receiptNumber: 'RCP-2026-002',
          clientName: 'Priya Sharma',
          receiptType: 'pilates',
          amount: 5000,
          date: '2026-01-18',
          status: 'paid'
        },
        {
          id: '3',
          receiptNumber: 'RCP-2026-003',
          clientName: 'Amit Desai',
          receiptType: 'physiotherapy',
          amount: 1800,
          date: '2026-01-20',
          status: 'pending'
        },
        {
          id: '4',
          receiptNumber: 'RCP-2026-004',
          clientName: 'Neha Mehta',
          receiptType: 'pilates',
          amount: 4500,
          date: '2026-01-21',
          status: 'paid'
        }
      ];

      let filtered = mockReceipts;

      if (filters.clientName) {
        filtered = filtered.filter(r => 
          r.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
        );
      }

      if (filters.receiptType) {
        filtered = filtered.filter(r => r.receiptType === filters.receiptType);
      }

      if (filters.startDate && filters.endDate) {
        filtered = filtered.filter(r => {
          const receiptDate = new Date(r.date);
          const start = new Date(filters.startDate);
          const end = new Date(filters.endDate);
          return receiptDate >= start && receiptDate <= end;
        });
      }

      setResults(filtered);
      setIsLoading(false);
    }, 500);
  }, [filters, isHydrated]);

  const getStatusColor = (status: Receipt['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'overdue':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const getTypeColor = (type: Receipt['receiptType']) => {
    return type === 'physiotherapy' ?'bg-primary/10 text-primary' :'bg-secondary/10 text-secondary';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-clinical-md p-6 border border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-clinical-md border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-text-primary">Filter Results</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary">
              {isLoading ? 'Searching...' : `${results.length} receipt${results.length !== 1 ? 's' : ''} found`}
            </span>
            <Link
              href="/receipt-listing-screen"
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md therapeutic-transition"
            >
              <Icon name="ArrowLeftIcon" size={16} variant="outline" />
              <span>Back to All</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="DocumentMagnifyingGlassIcon" size={64} variant="outline" className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">No receipts found</h3>
            <p className="text-sm text-text-secondary mb-6">Try adjusting your filters to see more results</p>
            <Link
              href="/receipt-listing-screen"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 therapeutic-transition"
            >
              <Icon name="DocumentTextIcon" size={18} variant="solid" />
              <span>View All Receipts</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((receipt) => (
              <Link
                key={receipt.id}
                href={`/receipt-detail-view?id=${receipt.id}`}
                className="block p-4 bg-gradient-bg rounded-lg border border-border hover:shadow-clinical-md therapeutic-transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono font-medium text-text-primary">
                        {receipt.receiptNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(receipt.receiptType)}`}>
                        {receipt.receiptType.charAt(0).toUpperCase() + receipt.receiptType.slice(1)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                        {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-base font-medium text-text-primary mb-1">{receipt.clientName}</p>
                    <p className="text-sm text-text-secondary">{formatDate(receipt.date)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-heading font-semibold text-text-primary">
                        {formatAmount(receipt.amount)}
                      </p>
                    </div>
                    <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-text-secondary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterResults;