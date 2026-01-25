'use client';

import { useState, useEffect } from 'react';

interface PaymentDetailsSectionProps {
  formData: {
    receiptDate: string;
    membership: string;
    startDate: string;
    endDate: string;
    consultationFee: string;
    discountPercentage: string;
    paymentMode: string;
    status: string;
    notes: string;
  };
  errors: {
    receiptDate?: string;
    startDate?: string;
    endDate?: string;
    consultationFee?: string;
    paymentMode?: string;
    status?: string;
  };
  totalAmount: number;
  onFieldChange: (field: string, value: string) => void;
}

export default function PaymentDetailsSection({ 
  formData, 
  errors, 
  totalAmount, 
  onFieldChange 
}: PaymentDetailsSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formatCurrency = (value: string): string => {
    if (!value) return '₹0';
    const num = parseFloat(value);
    if (isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
            <div className="w-5 h-5 bg-secondary/20 rounded"></div>
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Payment Details</h2>
            <p className="text-sm text-text-secondary">Configure service charges and payment information</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
            <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8 clinical-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
          <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary">Payment Details</h2>
          <p className="text-sm text-text-secondary">Configure service charges and payment information</p>
        </div>
      </div>

      <fieldset className="space-y-6">
        <legend className="sr-only">Payment and Service Information</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="receiptDate" className="block text-sm font-medium text-text-primary mb-2">
              Receipt Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              id="receiptDate"
              value={formData.receiptDate}
              onChange={(e) => onFieldChange('receiptDate', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.receiptDate ? 'border-destructive' : 'border-input'
              } bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
              required
              aria-invalid={!!errors.receiptDate}
              aria-describedby={errors.receiptDate ? 'receiptDate-error' : undefined}
            />
            {errors.receiptDate && (
              <p id="receiptDate-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.receiptDate}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="membership" className="block text-sm font-medium text-text-primary mb-2">
              Membership
            </label>
            <input
              type="text"
              id="membership"
              value={formData.membership}
              onChange={(e) => onFieldChange('membership', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition"
              placeholder="Enter membership details"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-text-primary mb-2">
              Start Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => onFieldChange('startDate', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.startDate ? 'border-destructive' : 'border-input'
              } bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
              required
              aria-invalid={!!errors.startDate}
              aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            />
            {errors.startDate && (
              <p id="startDate-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.startDate}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-2">
              End Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => onFieldChange('endDate', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.endDate ? 'border-destructive' : 'border-input'
              } bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
              required
              aria-invalid={!!errors.endDate}
              aria-describedby={errors.endDate ? 'endDate-error' : undefined}
            />
            {errors.endDate && (
              <p id="endDate-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.endDate}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="consultationFee" className="block text-sm font-medium text-text-primary mb-2">
              Consultation Fee <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">₹</span>
              <input
                type="number"
                id="consultationFee"
                value={formData.consultationFee}
                onChange={(e) => onFieldChange('consultationFee', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.consultationFee ? 'border-destructive' : 'border-input'
                } bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
                placeholder="0"
                min="0"
                step="1"
                required
                aria-invalid={!!errors.consultationFee}
                aria-describedby={errors.consultationFee ? 'consultationFee-error' : undefined}
              />
            </div>
            {errors.consultationFee && (
              <p id="consultationFee-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.consultationFee}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-text-primary mb-2">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                id="discountPercentage"
                value={formData.discountPercentage}
                onChange={(e) => onFieldChange('discountPercentage', e.target.value)}
                className="w-full px-4 pr-10 py-3 rounded-lg border border-input bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">%</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">Enter discount as a percentage (0-100)</p>
          </div>
        </div>

        <div className="bg-gradient-bg border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Total Amount</span>
            <span className="text-2xl font-heading font-bold text-text-primary">{formatCurrency(totalAmount.toString())}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-text-primary mb-2">
              Payment Mode <span className="text-destructive">*</span>
            </label>
            <select
              id="paymentMode"
              value={formData.paymentMode}
              onChange={(e) => onFieldChange('paymentMode', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.paymentMode ? 'border-destructive' : 'border-input'
              } bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
              required
              aria-invalid={!!errors.paymentMode}
              aria-describedby={errors.paymentMode ? 'paymentMode-error' : undefined}
            >
              <option value="">Select payment mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Debit/Credit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cheque">Cheque</option>
            </select>
            {errors.paymentMode && (
              <p id="paymentMode-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.paymentMode}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
              Status <span className="text-destructive">*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => onFieldChange('status', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.status ? 'border-destructive' : 'border-input'
              } bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
              required
              aria-invalid={!!errors.status}
              aria-describedby={errors.status ? 'status-error' : undefined}
            >
              <option value="">Select status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            {errors.status && (
              <p id="status-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.status}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-primary mb-2">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition resize-none"
            placeholder="Any additional information or special instructions"
          />
        </div>
      </fieldset>
    </div>
  );
}