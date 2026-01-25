'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import FilterPanel, { FilterState } from './FilterPanel';
import ReceiptTableRow from './ReceiptTableRow';
import BulkActionsBar from './BulkActionsBar';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SuccessToast from './SuccessToast';
import EmptyState from './EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { receiptsService } from '@/services/receiptsService';
import { Receipt as SupabaseReceipt } from '@/types/supabase.types';

interface Receipt {
  id: string;
  receiptNumber: string;
  clientName: string;
  type: 'Physiotherapy' | 'Pilates';
  amount: number;
  date: string;
  paymentStatus: 'Paid' | 'Unpaid';
  email: string;
  phone: string;
}

export default function ReceiptListingInteractive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Receipt;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'multiple'>('single');
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    searchQuery: '',
    receiptType: 'all',
    paymentStatus: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for success message from URL params
  useEffect(() => {
    const success = searchParams.get('success');
    if (success) {
      setSuccessMessage(success);
      // Clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      // Auto-hide after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load receipts from Supabase
  useEffect(() => {
    const loadReceipts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await receiptsService.getAll(user.id);
        
        // Transform Supabase receipts to UI format
        const transformedReceipts: Receipt[] = data?.map((r: SupabaseReceipt) => ({
          id: r.id,
          receiptNumber: r.receipt_number,
          clientName: r.client_name,
          type: r.receipt_type === 'physiotherapy' ? 'Physiotherapy' : 'Pilates',
          amount: Number(r.total_amount),
          date: new Date(r.issue_date).toLocaleDateString('en-GB'),
          paymentStatus: mapPaymentStatus(r.receipt_status),
          email: '',
          phone: r.client_phone,
        })) || [];

        setReceipts(transformedReceipts);
        setFilteredReceipts(transformedReceipts);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load receipts';
        setError(errorMessage);
        setToastMessage(errorMessage);
        setIsToastVisible(true);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadReceipts();
    }
  }, [user, authLoading]);

  const mapPaymentStatus = (status: string): 'Paid' | 'Unpaid' => {
    switch (status) {
      case 'issued':
        return 'Paid';
      case 'draft':
      case 'modified':
      case 'cancelled':
      default:
        return 'Unpaid';
    }
  };

  const applyFilters = useCallback((filters: FilterState) => {
    let filtered = [...receipts];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (receipt) =>
          receipt.clientName.toLowerCase().includes(query) ||
          receipt.receiptNumber.toLowerCase().includes(query)
      );
    }

    if (filters.receiptType !== 'all') {
      filtered = filtered.filter((receipt) => receipt.type === filters.receiptType);
    }

    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(
        (receipt) => receipt.paymentStatus === filters.paymentStatus
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((receipt) => {
        const receiptDate = new Date(receipt.date.split('/').reverse().join('-'));
        const fromDate = new Date(filters.dateFrom);
        return receiptDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((receipt) => {
        const receiptDate = new Date(receipt.date.split('/').reverse().join('-'));
        const toDate = new Date(filters.dateTo);
        return receiptDate <= toDate;
      });
    }

    setFilteredReceipts(filtered);
    setCurrentFilters(filters);
  }, [receipts]);

  const handleSort = (key: keyof Receipt) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredReceipts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredReceipts(sorted);
  };

  const handleSelectAll = () => {
    if (selectedReceipts.length === filteredReceipts.length) {
      setSelectedReceipts([]);
    } else {
      setSelectedReceipts(filteredReceipts.map((r) => r.id));
    }
  };

  const handleSelectReceipt = (id: string) => {
    setSelectedReceipts((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleView = (receipt: Receipt) => {
    router.push(`/receipt-detail-view?id=${receipt.id}`);
  };

  const handleDownloadPDF = (receipt: Receipt) => {
    router.push(`/pdf-generation-view?id=${receipt.id}`);
  };

  const handleWhatsApp = (receipt: Receipt) => {
    // Navigate to PDF page for WhatsApp sharing (will download PDF and open WhatsApp)
    router.push(`/pdf-generation-view?id=${receipt.id}&share=whatsapp`);
  };

  const handleEdit = (receipt: Receipt) => {
    const formRoute =
      receipt.type === 'Physiotherapy' ?'/physiotherapy-receipt-form' :'/pilates-receipt-form';
    router.push(`${formRoute}?id=${receipt.id}`);
  };

  const handleDelete = (receipt: Receipt) => {
    setReceiptToDelete(receipt);
    setDeleteTarget('single');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSelected = () => {
    setDeleteTarget('multiple');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!user?.id) return;

    try {
      if (deleteTarget === 'single' && receiptToDelete) {
        await receiptsService.delete(receiptToDelete.id);
        setReceipts((prev) => prev.filter((r) => r.id !== receiptToDelete.id));
        setFilteredReceipts((prev) => prev.filter((r) => r.id !== receiptToDelete.id));
        setToastMessage(`Receipt ${receiptToDelete.receiptNumber} deleted successfully`);
      } else if (deleteTarget === 'multiple') {
        // Delete all selected receipts
        await Promise.all(
          selectedReceipts.map((id) => receiptsService.delete(id))
        );
        setReceipts((prev) => prev.filter((r) => !selectedReceipts.includes(r.id)));
        setFilteredReceipts((prev) => prev.filter((r) => !selectedReceipts.includes(r.id)));
        setToastMessage(`${selectedReceipts.length} receipts deleted successfully`);
        setSelectedReceipts([]);
      }
      setIsDeleteModalOpen(false);
      setReceiptToDelete(null);
      setIsToastVisible(true);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete receipt(s)';
      setToastMessage(errorMessage);
      setIsToastVisible(true);
    }
  };

  const handleDownloadSelected = () => {
    setToastMessage(`${selectedReceipts.length} PDFs downloaded successfully`);
    setIsToastVisible(true);
  };

  const hasActiveFilters =
    currentFilters.searchQuery ||
    currentFilters.receiptType !== 'all' ||
    currentFilters.paymentStatus !== 'all' ||
    currentFilters.dateFrom ||
    currentFilters.dateTo;

  const handleClearFilters = () => {
    const resetFilters: FilterState = {
      searchQuery: '',
      receiptType: 'all',
      paymentStatus: 'all',
      dateFrom: '',
      dateTo: '',
    };
    applyFilters(resetFilters);
  };

  if (!isHydrated || authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-bg pt-20 pb-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-bg pt-20 pb-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <Icon name="ExclamationTriangleIcon" size={48} variant="outline" className="mx-auto mb-4 text-warning" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-text-secondary mb-4">Please sign in to view your receipts.</p>
            <Link
              href="/login-screen"
              className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 therapeutic-transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-bg pt-20 pb-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text-primary mb-2">
                Receipt Management
              </h1>
              <p className="text-sm text-text-secondary">
                View, filter, and manage all client receipts in one place
              </p>
            </div>
            <Link
              href="/receipt-type-selection"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 shadow-clinical therapeutic-transition"
            >
              <Icon name="PlusCircleIcon" size={20} variant="outline" />
              <span>Add New Receipt</span>
            </Link>
          </div>

          <FilterPanel
            onFilterChange={applyFilters}
            totalReceipts={receipts.length}
            filteredCount={filteredReceipts.length}
          />

          <div className="bg-card rounded-lg border border-border shadow-clinical overflow-hidden">
            {filteredReceipts.length === 0 ? (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedReceipts.length === filteredReceipts.length &&
                            filteredReceipts.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                          aria-label="Select all receipts"
                        />
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('receiptNumber')}
                          className="flex items-center space-x-1 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary therapeutic-transition"
                        >
                          <span>Receipt No.</span>
                          <Icon
                            name="ChevronUpDownIcon"
                            size={14}
                            variant="outline"
                          />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('clientName')}
                          className="flex items-center space-x-1 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary therapeutic-transition"
                        >
                          <span>Client Name</span>
                          <Icon
                            name="ChevronUpDownIcon"
                            size={14}
                            variant="outline"
                          />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('type')}
                          className="flex items-center space-x-1 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary therapeutic-transition"
                        >
                          <span>Type</span>
                          <Icon
                            name="ChevronUpDownIcon"
                            size={14}
                            variant="outline"
                          />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('amount')}
                          className="flex items-center space-x-1 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary therapeutic-transition"
                        >
                          <span>Amount</span>
                          <Icon
                            name="ChevronUpDownIcon"
                            size={14}
                            variant="outline"
                          />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center space-x-1 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary therapeutic-transition"
                        >
                          <span>Date</span>
                          <Icon
                            name="ChevronUpDownIcon"
                            size={14}
                            variant="outline"
                          />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('paymentStatus')}
                          className="flex items-center space-x-1 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary therapeutic-transition"
                        >
                          <span>Status</span>
                          <Icon
                            name="ChevronUpDownIcon"
                            size={14}
                            variant="outline"
                          />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.map((receipt) => (
                      <ReceiptTableRow
                        key={receipt.id}
                        receipt={receipt}
                        isSelected={selectedReceipts.includes(receipt.id)}
                        onSelect={handleSelectReceipt}
                        onView={handleView}
                        onDownloadPDF={handleDownloadPDF}
                        onWhatsApp={handleWhatsApp}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <BulkActionsBar
        selectedCount={selectedReceipts.length}
        onDownloadSelected={handleDownloadSelected}
        onDeleteSelected={handleDeleteSelected}
        onDeselectAll={() => setSelectedReceipts([])}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        receiptCount={
          deleteTarget === 'single' ? 1 : selectedReceipts.length
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setReceiptToDelete(null);
        }}
      />

      <SuccessToast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </>
  );
}