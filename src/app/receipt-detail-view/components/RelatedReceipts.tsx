import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface RelatedReceipt {
  id: string;
  receiptNumber: string;
  receiptType: 'Physiotherapy' | 'Pilates';
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface RelatedReceiptsProps {
  receipts: RelatedReceipt[];
  clientName: string;
}

const RelatedReceipts = ({ receipts, clientName }: RelatedReceiptsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-success/10 text-success border-success/20';
      case 'Pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Physiotherapy' ?'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 clinical-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-secondary/10">
          <Icon name="DocumentDuplicateIcon" size={20} variant="solid" className="text-brand-secondary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            Related Receipts
          </h2>
          <p className="text-xs text-text-secondary">Other receipts for {clientName}</p>
        </div>
      </div>

      <div className="space-y-3">
        {receipts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="InformationCircleIcon" size={48} variant="outline" className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No other receipts found for this client</p>
          </div>
        ) : (
          receipts.map((receipt) => (
            <Link
              key={receipt.id}
              href={`/receipt-detail-view?id=${receipt.id}`}
              className="block p-4 bg-gradient-bg rounded-lg border border-border hover:border-brand-primary therapeutic-transition card-elevation"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary font-mono mb-1">
                    #{receipt.receiptNumber}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(receipt.receiptType)}`}>
                      {receipt.receiptType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(receipt.status)}`}>
                      {receipt.status}
                    </span>
                  </div>
                </div>
                <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-text-secondary" />
              </div>

              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{receipt.date}</span>
                <span className="font-medium text-text-primary">{formatCurrency(receipt.amount)}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {receipts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href="/receipt-listing-screen"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-muted text-text-primary hover:bg-muted/80 therapeutic-transition focus-ring"
          >
            <span className="text-sm font-medium">View All Receipts</span>
            <Icon name="ArrowRightIcon" size={16} variant="outline" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedReceipts;