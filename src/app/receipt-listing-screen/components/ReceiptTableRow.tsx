'use client';

import Icon from '@/components/ui/AppIcon';

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

interface ReceiptTableRowProps {
  receipt: Receipt;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView: (receipt: Receipt) => void;
  onDownloadPDF: (receipt: Receipt) => void;
  onWhatsApp: (receipt: Receipt) => void;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receipt: Receipt) => void;
}

export default function ReceiptTableRow({
  receipt,
  isSelected,
  onSelect,
  onView,
  onDownloadPDF,
  onWhatsApp,
  onEdit,
  onDelete,
}: ReceiptTableRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-success/10 text-success border-success/20';
      case 'Unpaid':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Physiotherapy' ?'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20';
  };

  return (
    <tr className="border-b border-border hover:bg-muted/50 therapeutic-transition">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(receipt.id)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
          aria-label={`Select receipt ${receipt.receiptNumber}`}
        />
      </td>
      <td className="px-4 py-4">
        <span className="text-sm font-mono font-medium text-text-primary">
          {receipt.receiptNumber}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {receipt.clientName}
          </span>
          <span className="text-xs text-text-secondary mt-0.5">
            {receipt.email}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getTypeColor(
            receipt.type
          )}`}
        >
          {receipt.type}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-text-primary">
          ₹{receipt.amount.toLocaleString('en-IN')}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-text-secondary">{receipt.date}</span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
            receipt.paymentStatus
          )}`}
        >
          {receipt.paymentStatus}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(receipt)}
            className="p-2 rounded-md text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 therapeutic-transition"
            aria-label="View receipt"
            title="View Receipt"
          >
            <Icon name="EyeIcon" size={18} variant="outline" />
          </button>
          <button
            onClick={() => onDownloadPDF(receipt)}
            className="p-2 rounded-md text-text-secondary hover:text-brand-action hover:bg-brand-action/10 therapeutic-transition"
            aria-label="Download PDF"
            title="Download PDF"
          >
            <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
          </button>
          {/* <button
            onClick={() => onWhatsApp(receipt)}
            className="p-2 rounded-md text-text-secondary hover:text-success hover:bg-success/10 therapeutic-transition"
            aria-label="Share via WhatsApp"
            title="Share via WhatsApp"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={18} variant="outline" />
          </button> */}
          <button
            onClick={() => onEdit(receipt)}
            className="p-2 rounded-md text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 therapeutic-transition"
            aria-label="Edit receipt"
            title="Edit Receipt"
          >
            <Icon name="PencilIcon" size={18} variant="outline" />
          </button>
          <button
            onClick={() => onDelete(receipt)}
            className="p-2 rounded-md text-text-secondary hover:text-destructive hover:bg-destructive/10 therapeutic-transition"
            aria-label="Delete receipt"
            title="Delete Receipt"
          >
            <Icon name="TrashIcon" size={18} variant="outline" />
          </button>
        </div>
      </td>
    </tr>
  );
}