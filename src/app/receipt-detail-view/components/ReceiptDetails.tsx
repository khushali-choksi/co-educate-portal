import Icon from '@/components/ui/AppIcon';

interface ReceiptDetailsProps {
  receiptType: 'Physiotherapy' | 'Pilates';
  receiptDate: string;
  receiptNumber: string;
  amount: number;
  baseAmount: number;
  discount: number;
  paymentMode: string;
  membershipType?: string;
  membershipPeriod?: string;
  sessionCount?: number;
  notes?: string;
}

const ReceiptDetails = ({
  receiptType,
  receiptDate,
  receiptNumber,
  amount,
  baseAmount,
  discount,
  paymentMode,
  membershipType,
  membershipPeriod,
  sessionCount,
  notes,
}: ReceiptDetailsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 clinical-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-action/10">
          <Icon name="DocumentTextIcon" size={20} variant="solid" className="text-brand-action" />
        </div>
        <h2 className="text-lg font-heading font-semibold text-text-primary">
          Receipt Details
        </h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-secondary">Receipt Number</p>
            <p className="text-sm font-medium text-text-primary font-mono">{receiptNumber}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-secondary">Receipt Date</p>
            <p className="text-sm font-medium text-text-primary">{receiptDate}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-secondary">Service Type</p>
            <p className="text-sm font-medium text-text-primary">{receiptType}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-secondary">Payment Mode</p>
            <p className="text-sm font-medium text-text-primary">{paymentMode}</p>
          </div>
        </div>

        {receiptType === 'Pilates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            {membershipType && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-secondary">Membership Type</p>
                <p className="text-sm font-medium text-text-primary">{membershipType}</p>
              </div>
            )}

            {membershipPeriod && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-secondary">Membership Period</p>
                <p className="text-sm font-medium text-text-primary">{membershipPeriod}</p>
              </div>
            )}

            {sessionCount && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-secondary">Session Count</p>
                <p className="text-sm font-medium text-text-primary">{sessionCount} Sessions</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="CurrencyRupeeIcon" size={18} variant="outline" className="text-text-secondary" />
              <span className="text-sm font-medium text-text-secondary">Real Amount</span>
            </div>
            <span className="text-lg font-semibold text-text-primary">
              {formatCurrency(baseAmount)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="TagIcon" size={18} variant="outline" className="text-success" />
                <span className="text-sm font-medium text-success">Discount</span>
              </div>
              <span className="text-lg font-semibold text-success">
                - {formatCurrency(discount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gradient-bg rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="CurrencyRupeeIcon" size={20} variant="solid" className="text-brand-primary" />
              <span className="text-sm font-medium text-text-secondary">Total Amount</span>
            </div>
            <span className="text-2xl font-heading font-bold text-text-primary">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {notes && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-secondary mb-2">Additional Notes</p>
            <p className="text-sm text-text-primary bg-muted p-3 rounded-md">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptDetails;