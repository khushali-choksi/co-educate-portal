import Icon from '@/components/ui/AppIcon';

interface ReceiptHeaderProps {
  receiptNumber: string;
  receiptType: 'Physiotherapy' | 'Pilates';
  status: 'Paid' | 'Pending' | 'Overdue';
  onEdit: () => void;
  onDownloadPDF: () => void;
  onWhatsApp: () => void;
  onPrint: () => void;
  onBack: () => void;
}

const ReceiptHeader = ({
  receiptNumber,
  receiptType,
  status,
  onEdit,
  onDownloadPDF,
  onWhatsApp,
  onPrint,
  onBack,
}: ReceiptHeaderProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Paid':
        return 'bg-success text-success-foreground';
      case 'Pending':
        return 'bg-warning text-warning-foreground';
      case 'Overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = () => {
    return receiptType === 'Physiotherapy' ?'bg-brand-primary text-brand-primary-foreground' :'bg-brand-secondary text-brand-secondary-foreground';
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="w-full px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-md text-text-secondary hover:text-text-primary hover:bg-muted therapeutic-transition focus-ring"
              aria-label="Go back to receipt listing"
            >
              <Icon name="ArrowLeftIcon" size={20} variant="outline" />
            </button>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-heading font-semibold text-text-primary">
                  Receipt #{receiptNumber}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
                  {receiptType}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {status}
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                View and manage receipt details, download PDF, or share via WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-text-primary hover:bg-muted/80 therapeutic-transition focus-ring"
              aria-label="Edit receipt"
            >
              <Icon name="PencilIcon" size={18} variant="outline" />
              <span className="text-sm font-medium">Edit</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-text-primary hover:bg-muted/80 therapeutic-transition focus-ring"
              aria-label="Print receipt"
            >
              <Icon name="PrinterIcon" size={18} variant="outline" />
              <span className="text-sm font-medium hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 therapeutic-transition focus-ring"
              aria-label="Share via WhatsApp"
            >
              <Icon name="ChatBubbleLeftRightIcon" size={18} variant="solid" />
              <span className="text-sm font-medium hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={onDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 therapeutic-transition focus-ring"
              aria-label="Download PDF"
            >
              <Icon name="ArrowDownTrayIcon" size={18} variant="solid" />
              <span className="text-sm font-medium">Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptHeader;