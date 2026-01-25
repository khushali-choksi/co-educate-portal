'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentDetailsSectionProps {
  formData: {
    receiptDate: string;
    membership: string;
    period: string;
    startDate: string;
    endDate: string;
    amount: string;
    discount: string;
    paymentMode: string;
    status: string;
    notes: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

const PaymentDetailsSection = ({ formData, onFieldChange }: PaymentDetailsSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPaymentModeOpen, setIsPaymentModeOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const paymentModes = [
    { id: 'cash', name: 'Cash', icon: 'BanknotesIcon' },
    { id: 'upi', name: 'UPI', icon: 'DevicePhoneMobileIcon' },
    { id: 'card', name: 'Card', icon: 'CreditCardIcon' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'BuildingLibraryIcon' },
    { id: 'cheque', name: 'Cheque', icon: 'DocumentTextIcon' }
  ];

  const membershipTypes = [
    { id: 'mat', name: 'Mat', icon: 'Square2StackIcon' },
    { id: 'mat_and_apparatus', name: 'Mat and Apparatus', icon: 'CubeIcon' },
    { id: 'apparatus', name: 'Apparatus', icon: 'WrenchScrewdriverIcon' }
  ];

  const periodOptions = [
    { id: '1_month', name: '1 Month' },
    { id: '3_months_24_sessions', name: '3 Months - 24 Sessions' },
    { id: '3_months_36_sessions', name: '3 Months - 36 Sessions' },
    { id: '6_months', name: '6 Months' },
    { id: '12_months', name: '12 Months' }
  ];

  const statusOptions = [
    { id: 'paid', name: 'Paid', color: 'text-success' },
    { id: 'unpaid', name: 'Unpaid', color: 'text-destructive' }
  ];

  const selectedPaymentMode = paymentModes.find(mode => mode.id === formData.paymentMode);
  const selectedMembership = membershipTypes.find(type => type.id === formData.membership);
  const selectedPeriod = periodOptions.find(period => period.id === formData.period);
  const selectedStatus = statusOptions.find(status => status.id === formData.status);

  const formatIndianCurrency = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    if (!numValue) return '';
    
    const num = parseInt(numValue);
    return num.toLocaleString('en-IN');
  };

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    onFieldChange('amount', numValue);
  };

  const handleDiscountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    const discountValue = Math.min(parseInt(numValue) || 0, 100);
    onFieldChange('discount', discountValue.toString());
  };

  const calculateGrandTotal = () => {
    const amount = parseInt(formData.amount) || 0;
    const discount = parseInt(formData.discount) || 0;
    const discountAmount = (amount * discount) / 100;
    return amount - discountAmount;
  };

  if (!isHydrated) {
    return (
      <div className="bg-gradient-bg rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 bg-muted rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded animate-pulse"></div>
          <div className="h-20 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-bg rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-success">
          <Icon name="CurrencyRupeeIcon" size={20} variant="outline" className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold text-text-primary">Payment Details</h2>
          <p className="text-xs text-text-secondary">Configure payment information and terms</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="receiptDate" className="block text-sm font-medium text-text-primary mb-2">
              Receipt Date <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="receiptDate"
                value={formData.receiptDate}
                onChange={(e) => onFieldChange('receiptDate', e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-text-secondary" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Membership <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMembershipOpen(!isMembershipOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg text-left therapeutic-transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <div className="flex items-center space-x-2">
                  {selectedMembership ? (
                    <>
                      <Icon name={selectedMembership.icon as any} size={18} variant="outline" className="text-text-secondary" />
                      <span className="text-sm text-text-primary">{selectedMembership.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-text-secondary">Select membership</span>
                  )}
                </div>
                <Icon 
                  name={isMembershipOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                  size={20} 
                  variant="outline" 
                  className="text-text-secondary"
                />
              </button>

              {isMembershipOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMembershipOpen(false)}
                  />
                  <div className="absolute z-50 w-full mt-2 bg-card rounded-lg shadow-clinical-lg border border-border overflow-hidden">
                    {membershipTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          onFieldChange('membership', type.id);
                          setIsMembershipOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 therapeutic-transition ${
                          formData.membership === type.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-text-primary'
                        }`}
                      >
                        <Icon name={type.icon as any} size={18} variant="outline" />
                        <span className="text-sm font-medium">{type.name}</span>
                        {formData.membership === type.id && (
                          <Icon name="CheckIcon" size={18} variant="solid" className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {formData.membership && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Period <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg text-left therapeutic-transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <div className="flex items-center space-x-2">
                  {selectedPeriod ? (
                    <span className="text-sm text-text-primary">{selectedPeriod.name}</span>
                  ) : (
                    <span className="text-sm text-text-secondary">Select period</span>
                  )}
                </div>
                <Icon 
                  name={isPeriodOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                  size={20} 
                  variant="outline" 
                  className="text-text-secondary"
                />
              </button>

              {isPeriodOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsPeriodOpen(false)}
                  />
                  <div className="absolute z-50 w-full mt-2 bg-card rounded-lg shadow-clinical-lg border border-border overflow-hidden">
                    {periodOptions.map((period) => (
                      <button
                        key={period.id}
                        type="button"
                        onClick={() => {
                          onFieldChange('period', period.id);
                          setIsPeriodOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 therapeutic-transition ${
                          formData.period === period.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-text-primary'
                        }`}
                      >
                        <span className="text-sm font-medium">{period.name}</span>
                        {formData.period === period.id && (
                          <Icon name="CheckIcon" size={18} variant="solid" className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-text-primary mb-2">
              Start Date <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => onFieldChange('startDate', e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-text-secondary" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-2">
              End Date <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => onFieldChange('endDate', e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-text-secondary" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-2">
              Amount <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-text-primary font-medium">₹</span>
              </div>
              <input
                type="text"
                id="amount"
                value={formatIndianCurrency(formData.amount)}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                required
                className="w-full pl-8 pr-4 py-3 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-text-secondary">Enter membership amount in INR</p>
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-text-primary mb-2">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="text"
                id="discount"
                value={formData.discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-text-secondary font-medium">%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-text-secondary">Enter discount percentage (0-100)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Payment Mode <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPaymentModeOpen(!isPaymentModeOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg text-left therapeutic-transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <div className="flex items-center space-x-2">
                  {selectedPaymentMode ? (
                    <>
                      <Icon name={selectedPaymentMode.icon as any} size={18} variant="outline" className="text-text-secondary" />
                      <span className="text-sm text-text-primary">{selectedPaymentMode.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-text-secondary">Select payment mode</span>
                  )}
                </div>
                <Icon 
                  name={isPaymentModeOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                  size={20} 
                  variant="outline" 
                  className="text-text-secondary"
                />
              </button>

              {isPaymentModeOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsPaymentModeOpen(false)}
                  />
                  <div className="absolute z-50 w-full mt-2 bg-card rounded-lg shadow-clinical-lg border border-border overflow-hidden">
                    {paymentModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          onFieldChange('paymentMode', mode.id);
                          setIsPaymentModeOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 therapeutic-transition ${
                          formData.paymentMode === mode.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-text-primary'
                        }`}
                      >
                        <Icon name={mode.icon as any} size={18} variant="outline" />
                        <span className="text-sm font-medium">{mode.name}</span>
                        {formData.paymentMode === mode.id && (
                          <Icon name="CheckIcon" size={18} variant="solid" className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg text-left therapeutic-transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <div className="flex items-center space-x-2">
                  {selectedStatus ? (
                    <span className={`text-sm font-medium ${selectedStatus.color}`}>{selectedStatus.name}</span>
                  ) : (
                    <span className="text-sm text-text-secondary">Select status</span>
                  )}
                </div>
                <Icon 
                  name={isStatusOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
                  size={20} 
                  variant="outline" 
                  className="text-text-secondary"
                />
              </button>

              {isStatusOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsStatusOpen(false)}
                  />
                  <div className="absolute z-50 w-full mt-2 bg-card rounded-lg shadow-clinical-lg border border-border overflow-hidden">
                    {statusOptions.map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => {
                          onFieldChange('status', status.id);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 therapeutic-transition ${
                          formData.status === status.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-text-primary'
                        }`}
                      >
                        <span className={`text-sm font-medium ${formData.status === status.id ? '' : status.color}`}>{status.name}</span>
                        {formData.status === status.id && (
                          <Icon name="CheckIcon" size={18} variant="solid" className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {formData.amount && (
          <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-lg p-6 border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-action">
                  <Icon name="CurrencyRupeeIcon" size={20} variant="solid" className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Grand Total</p>
                  <p className="text-2xl font-heading font-bold text-text-primary">
                    ₹{calculateGrandTotal().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              {formData.discount && parseInt(formData.discount) > 0 && (
                <div className="text-right">
                  <p className="text-xs text-text-secondary">You saved</p>
                  <p className="text-lg font-semibold text-success">
                    ₹{((parseInt(formData.amount) * parseInt(formData.discount)) / 100).toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-primary mb-2">
            Additional Notes
          </label>
          <div className="relative">
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              placeholder="Add any special instructions or notes"
              rows={3}
              className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="absolute right-3 top-3 pointer-events-none">
              <Icon name="DocumentTextIcon" size={20} variant="outline" className="text-text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;