'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReceiptHeader from './ReceiptHeader';
import ClientInformation from './ClientInformation';
import ReceiptDetails from './ReceiptDetails';
import { useAuth } from '@/contexts/AuthContext';
import { receiptsService } from '@/services/receiptsService';

interface Receipt {
  id: string;
  receiptNumber: string;
  receiptType: 'Physiotherapy' | 'Pilates';
  status: 'Paid' | 'Pending' | 'Overdue';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  receiptDate: string;
  amount: number;
  baseAmount: number;
  discount: number;
  paymentMode: string;
  membershipType?: string;
  membershipPeriod?: string;
  sessionCount?: number;
  notes?: string;
}

const ReceiptDetailInteractive = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load receipt data from Supabase
  useEffect(() => {
    const loadReceipt = async () => {
      if (!isHydrated || authLoading) return;
      
      const receiptId = searchParams.get('id');
      
      if (!receiptId) {
        setError('No receipt ID provided');
        setIsLoading(false);
        return;
      }

      if (!user?.id) {
        setError('Please log in to view receipt details');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load the receipt from Supabase
        const supabaseReceipt = await receiptsService.getById(receiptId);
        
        if (!supabaseReceipt) {
          setError('Receipt not found');
          setIsLoading(false);
          return;
        }

        // Calculate discount
        const baseAmount = supabaseReceipt.amount || 0;
        const totalAmount = supabaseReceipt.total_amount || 0;
        const discount = Math.max(0, baseAmount - totalAmount);

        // Transform Supabase receipt to UI format
        const transformedReceipt: Receipt = {
          id: supabaseReceipt.id,
          receiptNumber: supabaseReceipt.receipt_number,
          receiptType: supabaseReceipt.receipt_type === 'physiotherapy' ? 'Physiotherapy' : 'Pilates',
          status: mapPaymentStatus(supabaseReceipt.receipt_status),
          clientName: supabaseReceipt.client_name,
          clientEmail: supabaseReceipt.client_email || '',
          clientPhone: supabaseReceipt.client_phone,
          clientAddress: supabaseReceipt.client_address || '',
          receiptDate: formatDate(supabaseReceipt.issue_date),
          amount: totalAmount,
          baseAmount: baseAmount,
          discount: discount,
          paymentMode: mapPaymentMethodToUI(supabaseReceipt.payment_method),
          membershipType: supabaseReceipt.membership_type ? capitalizeFirst(supabaseReceipt.membership_type) : undefined,
          membershipPeriod: getMembershipPeriod(supabaseReceipt.membership_type),
          sessionCount: supabaseReceipt.session_count || undefined,
          notes: supabaseReceipt.notes || undefined,
        };

        setReceipt(transformedReceipt);

      } catch (err: any) {
        console.error('Failed to load receipt:', err);
        setError(err?.message || 'Failed to load receipt details');
      } finally {
        setIsLoading(false);
      }
    };

    loadReceipt();
  }, [isHydrated, authLoading, user, searchParams]);

  const mapPaymentStatus = (status: string): 'Paid' | 'Pending' | 'Overdue' => {
    switch (status) {
      case 'issued':
        return 'Paid';
      case 'draft':
        return 'Pending';
      case 'modified':
        return 'Pending';
      case 'cancelled':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  const mapPaymentMethodToUI = (method: string | null): string => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'bank_transfer': return 'Bank Transfer';
      default: return 'Other';
    }
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getMembershipPeriod = (type: string | null): string | undefined => {
    switch (type) {
      case 'monthly': return '1 Month';
      case 'quarterly': return '3 Months';
      case 'annual': return '12 Months';
      default: return undefined;
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleEdit = () => {
    if (!receipt) return;
    const editRoute = receipt.receiptType === 'Physiotherapy' ? '/physiotherapy-receipt-form' : '/pilates-receipt-form';
    router.push(`${editRoute}?id=${receipt.id}`);
  };

  const handleDownloadPDF = () => {
    if (!receipt) return;
    router.push(`/pdf-generation-view?id=${receipt.id}`);
  };

  const handleWhatsApp = () => {
    if (!receipt) return;
    // Navigate to PDF page for WhatsApp sharing (will download PDF and open WhatsApp)
    router.push(`/pdf-generation-view?id=${receipt.id}&share=whatsapp`);
  };

  const handlePrint = () => {
    if (!isHydrated) return;
    window.print();
  };

  const handleBack = () => {
    router.push('/receipt-listing-screen');
  };

  if (!isHydrated || isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="w-full px-4 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-20 bg-muted rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-muted rounded-lg" />
                  <div className="h-96 bg-muted rounded-lg" />
                </div>
                <div className="space-y-6">
                  <div className="h-64 bg-muted rounded-lg" />
                  <div className="h-64 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="w-full px-4 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-error/10">
                <svg className="w-8 h-8 text-error" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">Error Loading Receipt</h2>
              <p className="text-text-secondary mb-6">{error}</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 therapeutic-transition"
              >
                Back to Receipts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="w-full px-4 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">Receipt Not Found</h2>
              <p className="text-text-secondary mb-6">The requested receipt could not be found.</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 therapeutic-transition"
              >
                Back to Receipts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <ReceiptHeader
        receiptNumber={receipt.receiptNumber}
        receiptType={receipt.receiptType}
        status={receipt.status}
        onEdit={handleEdit}
        onDownloadPDF={handleDownloadPDF}
        onWhatsApp={handleWhatsApp}
        onPrint={handlePrint}
        onBack={handleBack}
      />

      <div className="w-full px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientInformation
              clientName={receipt.clientName}
              clientEmail={receipt.clientEmail}
              clientPhone={receipt.clientPhone}
              clientAddress={receipt.clientAddress}
            />

            <ReceiptDetails
              receiptType={receipt.receiptType}
              receiptDate={receipt.receiptDate}
              receiptNumber={receipt.receiptNumber}
              amount={receipt.amount}
              baseAmount={receipt.baseAmount}
              discount={receipt.discount}
              paymentMode={receipt.paymentMode}
              membershipType={receipt.membershipType}
              membershipPeriod={receipt.membershipPeriod}
              sessionCount={receipt.sessionCount}
              notes={receipt.notes}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white;
          }
          
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptDetailInteractive;
