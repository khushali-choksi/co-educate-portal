'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import ClientInformationSection from './ClientInformationSection';
import PaymentDetailsSection from './PaymentDetailsSection';
import FormActions from './FormActions';
import { useAuth } from '@/contexts/AuthContext';
import { receiptsService } from '@/services/receiptsService';
import { InsertReceipt, UpdateReceipt } from '@/types/supabase.types';

export default function PilatesReceiptFormInteractive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editReceiptId, setEditReceiptId] = useState<string | null>(null);
  const [existingReceiptNumber, setExistingReceiptNumber] = useState<string | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);

  const [formData, setFormData] = useState({
    receiptDate: new Date().toISOString().split('T')[0],
    membership: '',
    period: '',
    startDate: '',
    endDate: '',
    clientName: '',
    email: '',
    phone: '',
    address: '',
    amount: '',
    discount: '',
    paymentMode: '',
    status: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{
    clientName?: string;
    email?: string;
    phone?: string;
  }>({});

  // Load receipt data for edit mode
  useEffect(() => {
    const loadReceiptForEdit = async () => {
      const receiptId = searchParams.get('id');
      
      if (receiptId && user?.id) {
        setIsEditMode(true);
        setEditReceiptId(receiptId);
        setIsLoadingReceipt(true);
        
        try {
          const receipt = await receiptsService.getById(receiptId);
          
          if (receipt) {
            setExistingReceiptNumber(receipt.receipt_number);
            
            // Parse membership and period from description if available
            const parsed = parseMembershipFromDescription(receipt.description);
            const membership = parsed.membership || '';
            const period = parsed.period || mapMembershipTypeToUI(receipt.membership_type);
            
            setFormData({
              receiptDate: receipt.issue_date || new Date().toISOString().split('T')[0],
              membership: membership,
              period: period,
              startDate: receipt.membership_start_date || '',
              endDate: receipt.membership_end_date || '',
              clientName: receipt.client_name || '',
              email: receipt.client_email || '',
              phone: receipt.client_phone || '',
              address: receipt.client_address || '',
              amount: receipt.amount?.toString() || '',
              discount: receipt.amount && receipt.total_amount 
                ? (((receipt.amount - receipt.total_amount) / receipt.amount) * 100).toFixed(0)
                : '',
              paymentMode: mapPaymentMethodToUI(receipt.payment_method),
              status: mapStatusToUI(receipt.receipt_status),
              notes: receipt.notes || '',
            });
          }
        } catch (err: any) {
          setToastMessage(err?.message || 'Failed to load receipt');
          setIsToastVisible(true);
        } finally {
          setIsLoadingReceipt(false);
        }
      }
    };

    if (isHydrated && user?.id) {
      loadReceiptForEdit();
    }
  }, [isHydrated, searchParams, user?.id]);

  const mapPaymentMethodToUI = (method: string | null): string => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'bank_transfer': return 'Bank Transfer';
      default: return 'Cash';
    }
  };

  const mapStatusToUI = (status: string | null): string => {
    switch (status) {
      case 'issued': return 'paid';
      case 'draft': return 'pending';
      case 'modified': return 'partial';
      default: return 'pending';
    }
  };

  const mapMembershipTypeToUI = (type: string | null): string => {
    switch (type) {
      case 'monthly': return '1_month';
      case 'quarterly': return '3_months_24_sessions';
      case 'annual': return '12_months';
      default: return '';
    }
  };

  // Parse description to extract membership and period for editing
  const parseMembershipFromDescription = (description: string | null): { membership: string; period: string } => {
    if (!description) return { membership: '', period: '' };
    
    // Expected format: "Mat and Apparatus (3 Months - 24 Sessions)"
    const match = description.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      const membershipName = match[1].trim();
      const periodName = match[2].trim();
      
      // Map membership name back to ID
      const membershipMap: Record<string, string> = {
        'Mat': 'mat',
        'Mat and Apparatus': 'mat_and_apparatus',
        'Apparatus': 'apparatus'
      };
      
      // Map period name back to ID
      const periodMap: Record<string, string> = {
        '1 Month': '1_month',
        '3 Month': '3_month',
        '3 Months - 24 Sessions': '3_months_24_sessions',
        '3 Months - 36 Sessions': '3_months_36_sessions',
        '6 Months': '6_months',
        '12 Months': '12_months',
        'Single Session': 'single_session'
      };
      
      return {
        membership: membershipMap[membershipName] || '',
        period: periodMap[periodName] || ''
      };
    }
    
    return { membership: '', period: '' };
  };

  useEffect(() => {
    setIsHydrated(true);
    
    // Only load from localStorage if not in edit mode
    if (!searchParams.get('id')) {
      const savedData = localStorage.getItem('pilatesReceiptDraft');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed);
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (isHydrated && !isEditMode) {
      localStorage.setItem('pilatesReceiptDraft', JSON.stringify(formData));
    }
  }, [formData, isHydrated, isEditMode]);

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
        setToastMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^[0-9+\s-]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapPaymentMethod = (paymentMode: string): 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other' => {
    const mode = paymentMode.toLowerCase();
    if (mode === 'cash') return 'cash';
    if (mode === 'card' || mode === 'credit card' || mode === 'debit card') return 'card';
    if (mode === 'upi') return 'upi';
    if (mode === 'bank transfer' || mode === 'neft' || mode === 'rtgs') return 'bank_transfer';
    return 'other';
  };

  const mapMembershipType = (period: string): 'monthly' | 'quarterly' | 'annual' | null => {
    if (!period) return null;
    const p = period.toLowerCase();
    if (p.includes('1 month') || p.includes('1_month')) return 'monthly';
    if (p.includes('3 months') || p.includes('3_months') || p.includes('24 sessions') || p.includes('36 sessions')) return 'quarterly';
    if (p.includes('6 months') || p.includes('6_months') || p.includes('12 months') || p.includes('12_months')) return 'annual';
    if (p.includes('Single Session') || p.includes('single_session') || p.includes('Single Session') || p.includes('single_session')) return 'annual';
    return null;
  };

  const getMembershipDisplayName = (membershipId: string): string => {
    const membershipTypes: Record<string, string> = {
      'mat': 'Mat',
      'mat_and_apparatus': 'Mat and Apparatus',
      'apparatus': 'Apparatus'
    };
    return membershipTypes[membershipId] || membershipId;
  };

  const getPeriodDisplayName = (periodId: string): string => {
    const periodOptions: Record<string, string> = {
      '1_month': '1 Month',
      '3_month': '3 Month',
      '3_months_24_sessions': '3 Months - 24 Sessions',
      '3_months_36_sessions': '3 Months - 36 Sessions',
      '6_months': '6 Months',
      '12_months': '12 Months',
      'single_session': 'Single Session'
    };
    return periodOptions[periodId] || periodId;
  };

  const mapStatus = (status: string): 'draft' | 'issued' | 'cancelled' | 'modified' => {
    const s = status.toLowerCase();
    if (s === 'paid') return 'issued';
    if (s === 'partial') return 'modified';
    if (s === 'cancelled') return 'cancelled';
    return 'draft';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setToastMessage('You must be logged in to save a receipt');
      setIsToastVisible(true);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const discountPercent = parseFloat(formData.discount) || 0;
      const amount = parseFloat(formData.amount) || 0;
      const discountAmount = (amount * discountPercent) / 100;
      const totalAmount = amount - discountAmount;

      if (isEditMode && editReceiptId) {
        // Build membership display string: "Mat and Apparatus (3 Months - 24 Sessions)"
        const membershipDisplayName = getMembershipDisplayName(formData.membership);
        const periodDisplayName = getPeriodDisplayName(formData.period);
        const descriptionText = membershipDisplayName && periodDisplayName 
          ? `${membershipDisplayName} (${periodDisplayName})`
          : membershipDisplayName || periodDisplayName || null;

        // Update existing receipt
        const updateData: UpdateReceipt = {
          receipt_status: mapStatus(formData.status),
          client_name: formData.clientName,
          client_phone: formData.phone,
          client_email: formData.email || null,
          client_address: formData.address || null,
          issue_date: formData.receiptDate,
          amount: amount,
          payment_method: mapPaymentMethod(formData.paymentMode),
          membership_type: mapMembershipType(formData.period),
          description: descriptionText,
          membership_start_date: formData.startDate || null,
          membership_end_date: formData.endDate || null,
          tax_amount: 0,
          total_amount: totalAmount,
          notes: formData.notes || null,
          updated_at: new Date().toISOString(),
        };

        await receiptsService.update(editReceiptId, updateData);
        
        // Clear local storage draft
        localStorage.removeItem('pilatesReceiptDraft');
        
        // Redirect with success message
        router.push('/receipt-listing-screen?success=Receipt updated successfully');
      } else {
        // Create new receipt
        const receiptNumber = await receiptsService.generateReceiptNumber(user.id).catch(() => `PIL-${Date.now()}`);
        
        // Build membership display string: "Mat and Apparatus (3 Months - 24 Sessions)"
        const membershipDisplayName = getMembershipDisplayName(formData.membership);
        const periodDisplayName = getPeriodDisplayName(formData.period);
        const descriptionText = membershipDisplayName && periodDisplayName 
          ? `${membershipDisplayName} (${periodDisplayName})`
          : membershipDisplayName || periodDisplayName || null;

        const receiptData: InsertReceipt = {
          user_id: user.id,
          receipt_type: 'pilates',
          receipt_number: receiptNumber,
          receipt_status: mapStatus(formData.status),
          client_name: formData.clientName,
          client_phone: formData.phone,
          client_email: formData.email || null,
          client_address: formData.address || null,
          issue_date: formData.receiptDate,
          amount: amount,
          payment_method: mapPaymentMethod(formData.paymentMode),
          membership_type: mapMembershipType(formData.period),
          description: descriptionText,
          membership_start_date: formData.startDate || null,
          membership_end_date: formData.endDate || null,
          tax_amount: 0,
          total_amount: totalAmount,
          notes: formData.notes || null,
        };

        await receiptsService.create(receiptData);
        
        // Clear local storage draft
        localStorage.removeItem('pilatesReceiptDraft');
        
        // Redirect with success message
        router.push('/receipt-listing-screen?success=Receipt created successfully');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMessage = err?.message || 'Failed to save receipt';
      setToastMessage(errorMessage);
      setIsToastVisible(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/receipt-listing-screen');
  };

  if (!isHydrated || isLoadingReceipt) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-clinical-lg p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Toast */}
          {isToastVisible && (
            <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4 flex items-center justify-between clinical-shadow animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-error" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-error">{toastMessage}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsToastVisible(false);
                  setToastMessage('');
                }}
                className="flex-shrink-0 ml-4 text-error/60 hover:text-error transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push(isEditMode ? '/receipt-listing-screen' : '/receipt-type-selection')}
              className="flex items-center space-x-2 text-text-secondary hover:text-text-primary therapeutic-transition"
            >
              <Icon name="ChevronLeftIcon" size={20} variant="outline" />
              <span className="text-sm font-medium">{isEditMode ? 'Back to Receipts' : 'Back to Receipt Type'}</span>
            </button>
          </div>

          <div className="bg-card rounded-lg shadow-clinical-lg p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-border">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-secondary to-success">
                <Icon name="UserGroupIcon" size={24} variant="outline" className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary">
                  {isEditMode ? 'Edit Pilates Receipt' : 'Pilates Receipt Form'}
                </h1>
                <p className="text-sm text-text-secondary">
                  {isEditMode 
                    ? `Editing receipt ${existingReceiptNumber}` 
                    : 'Create receipt for Pilates membership and sessions'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <ClientInformationSection
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
              />

              <PaymentDetailsSection
                formData={formData}
                onFieldChange={handleFieldChange}
              />

              <FormActions
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isEditMode={isEditMode}
              />
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg shadow-clinical-lg max-w-md w-full p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success/10">
              <Icon name="CheckCircleIcon" size={32} variant="solid" className="text-success" />
            </div>
            
            <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
              {isEditMode ? 'Receipt Updated Successfully!' : 'Receipt Generated Successfully!'}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              {isEditMode 
                ? 'Pilates receipt has been updated and saved to your records.'
                : 'Pilates membership receipt has been created and saved to your records.'}
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleSuccessClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-action text-white rounded-lg font-medium therapeutic-transition hover:shadow-clinical-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                View All Receipts
              </button>
              {!isEditMode && (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setFormData({
                      receiptDate: new Date().toISOString().split('T')[0],
                      membership: '',
                      period: '',
                      startDate: '',
                      endDate: '',
                      clientName: '',
                      email: '',
                      phone: '',
                      address: '',
                      amount: '',
                      discount: '',
                      paymentMode: '',
                      status: '',
                      notes: ''
                    });
                  }}
                  className="w-full px-6 py-3 bg-muted text-text-primary rounded-lg font-medium therapeutic-transition hover:bg-border focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Create Another Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
