'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientInfoSection from './ClientInfoSection';
import PaymentDetailsSection from './PaymentDetailsSection';
import FormActions from './FormActions';
import AutoSaveIndicator from './AutoSaveIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { receiptsService } from '@/services/receiptsService';
import { InsertReceipt, UpdateReceipt } from '@/types/supabase.types';

interface FormData {
  clientName: string;
  email: string;
  phone: string;
  address: string;
  receiptDate: string;
  membership: string;
  startDate: string;
  endDate: string;
  consultationFee: string;
  discountPercentage: string;
  paymentMode: string;
  status: string;
  notes: string;
}

interface FormErrors {
  clientName?: string;
  email?: string;
  phone?: string;
  address?: string;
  receiptDate?: string;
  startDate?: string;
  endDate?: string;
  consultationFee?: string;
  paymentMode?: string;
  status?: string;
}

export default function PhysiotherapyFormInteractive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editReceiptId, setEditReceiptId] = useState<string | null>(null);
  const [existingReceiptNumber, setExistingReceiptNumber] = useState<string | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    email: '',
    phone: '',
    address: '',
    receiptDate: '',
    membership: '',
    startDate: '',
    endDate: '',
    consultationFee: '',
    discountPercentage: '',
    paymentMode: '',
    status: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

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
            setFormData({
              clientName: receipt.client_name || '',
              email: receipt.client_email || '',
              phone: receipt.client_phone || '',
              address: receipt.client_address || '',
              receiptDate: receipt.issue_date || '',
              membership: receipt.description || '',
              startDate: receipt.membership_start_date || '',
              endDate: receipt.membership_end_date || '',
              consultationFee: receipt.amount?.toString() || '',
              discountPercentage: receipt.amount && receipt.total_amount 
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

  useEffect(() => {
    setIsHydrated(true);
    
    // Only load from localStorage if not in edit mode
    if (!searchParams.get('id')) {
      const savedData = localStorage.getItem('physiotherapy_form_draft');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed);
        } catch (e) {
          console.error('Failed to parse saved form data');
        }
      }

      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, receiptDate: today, startDate: today, endDate: today }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isHydrated || isEditMode) return;

    const autoSaveTimer = setTimeout(() => {
      localStorage.setItem('physiotherapy_form_draft', JSON.stringify(formData));
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      setLastSaved(timeString);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
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
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.receiptDate) {
      newErrors.receiptDate = 'Receipt date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.consultationFee || parseFloat(formData.consultationFee) <= 0) {
      newErrors.consultationFee = 'Consultation fee must be greater than 0';
    }

    if (!formData.paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
    }

    if (!formData.status) {
      newErrors.status = 'Payment status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = (): number => {
    const consultation = parseFloat(formData.consultationFee) || 0;
    const discountPercent = parseFloat(formData.discountPercentage) || 0;
    
    const discountAmount = (consultation * discountPercent) / 100;
    return Math.max(0, consultation - discountAmount);
  };

  const handleSave = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem('physiotherapy_receipt_draft', JSON.stringify({
        ...formData,
        totalAmount: calculateTotal(),
        status: 'draft',
        createdAt: new Date().toISOString(),
      }));
      
      setIsSaving(false);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }, 1000);
  };

  const mapPaymentMethod = (paymentMode: string): 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other' => {
    const mode = paymentMode.toLowerCase();
    if (mode === 'cash') return 'cash';
    if (mode === 'card' || mode === 'credit card' || mode === 'debit card') return 'card';
    if (mode === 'upi') return 'upi';
    if (mode === 'bank transfer' || mode === 'neft' || mode === 'rtgs') return 'bank_transfer';
    return 'other';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const totalAmount = calculateTotal();

      if (isEditMode && editReceiptId) {
        // Update existing receipt
        const updateData: UpdateReceipt = {
          receipt_status: mapStatus(formData.status),
          client_name: formData.clientName,
          client_phone: formData.phone,
          client_email: formData.email || null,
          client_address: formData.address || null,
          issue_date: formData.receiptDate,
          amount: parseFloat(formData.consultationFee) || 0,
          payment_method: mapPaymentMethod(formData.paymentMode),
          description: formData.membership || null,
          membership_start_date: formData.startDate || null,
          membership_end_date: formData.endDate || null,
          tax_amount: 0,
          total_amount: totalAmount,
          notes: formData.notes || null,
          updated_at: new Date().toISOString(),
        };

        await receiptsService.update(editReceiptId, updateData);
        
        // Clear local storage draft
        localStorage.removeItem('physiotherapy_form_draft');
        
        // Redirect with success message
        router.push('/receipt-listing-screen?success=Receipt updated successfully');
      } else {
        // Create new receipt
        const receiptNumber = await receiptsService.generateReceiptNumber(user.id).catch(() => `PHY-${Date.now()}`);
        
        const receiptData: InsertReceipt = {
          user_id: user.id,
          receipt_type: 'physiotherapy',
          receipt_number: receiptNumber,
          receipt_status: mapStatus(formData.status),
          client_name: formData.clientName,
          client_phone: formData.phone,
          client_email: formData.email || null,
          client_address: formData.address || null,
          issue_date: formData.receiptDate,
          amount: parseFloat(formData.consultationFee) || 0,
          payment_method: mapPaymentMethod(formData.paymentMode),
          description: formData.membership || null,
          membership_start_date: formData.startDate || null,
          membership_end_date: formData.endDate || null,
          tax_amount: 0,
          total_amount: totalAmount,
          notes: formData.notes || null,
        };

        await receiptsService.create(receiptData);
        
        // Clear local storage draft
        localStorage.removeItem('physiotherapy_form_draft');
        
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

  if (!isHydrated || isLoadingReceipt) {
    return (
      <div className="min-h-screen bg-gradient-bg pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="h-20 bg-card/50 rounded-xl animate-pulse mb-8"></div>
          <div className="space-y-6">
            <div className="h-96 bg-card/50 rounded-xl animate-pulse"></div>
            <div className="h-96 bg-card/50 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Error Toast Notification */}
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

        {showSuccessMessage && (
          <div className="mb-6 bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3 clinical-shadow animate-fade-in">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-success">Draft saved successfully!</p>
              <p className="text-xs text-success/80 mt-1">Your form data has been saved and can be accessed later.</p>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border p-6 lg:p-8 mb-6 clinical-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text-primary mb-2">
                {isEditMode ? 'Edit Physiotherapy Receipt' : 'Physiotherapy Receipt Form'}
              </h1>
              <p className="text-text-secondary">
                {isEditMode 
                  ? `Editing receipt ${existingReceiptNumber}` 
                  : 'Complete the form below to generate a professional physiotherapy service receipt'}
              </p>
            </div>
            {!isEditMode && <AutoSaveIndicator lastSaved={lastSaved} />}
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <ClientInfoSection
            formData={{
              clientName: formData.clientName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
            }}
            errors={{
              clientName: errors.clientName,
              email: errors.email,
              phone: errors.phone,
              address: errors.address,
            }}
            onFieldChange={handleFieldChange}
          />

          <PaymentDetailsSection
            formData={{
              receiptDate: formData.receiptDate,
              membership: formData.membership,
              startDate: formData.startDate,
              endDate: formData.endDate,
              consultationFee: formData.consultationFee,
              discountPercentage: formData.discountPercentage,
              paymentMode: formData.paymentMode,
              status: formData.status,
              notes: formData.notes,
            }}
            errors={{
              receiptDate: errors.receiptDate,
              startDate: errors.startDate,
              endDate: errors.endDate,
              consultationFee: errors.consultationFee,
              paymentMode: errors.paymentMode,
              status: errors.status,
            }}
            totalAmount={calculateTotal()}
            onFieldChange={handleFieldChange}
          />

          <div className="bg-card rounded-xl border border-border p-6 lg:p-8 clinical-shadow">
            <FormActions
              onSave={handleSave}
              onSaveAndSend={handleSubmit}
              isSaving={isSaving || isSubmitting}
              isEditMode={isEditMode}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
