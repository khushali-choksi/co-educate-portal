'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Receipt {
  id: string;
  receiptNo: string;
  clientName: string;
  type: 'Physiotherapy' | 'Pilates';
  amount: string;
  date: string;
  time: string;
  status: 'Paid' | 'Unpaid';
}

interface RecentActivityProps {
  receipts: Receipt[];
}

const RecentActivity = ({ receipts }: RecentActivityProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useState(() => {
    setIsHydrated(true);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-success/10 text-success border-success/20';
      case 'Unpaid':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-text-secondary border-border';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Physiotherapy' ?'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :'bg-secondary/10 text-secondary border-secondary/20';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-text-primary">Recent Activity</h2>
        <Link 
          href="/receipt-listing-screen"
          className="flex items-center space-x-1 text-sm font-medium text-brand-primary hover:text-brand-action therapeutic-transition"
        >
          <span>View All</span>
          <Icon name="ArrowRightIcon" size={16} variant="outline" />
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-clinical border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-bg border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Receipt No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-heading font-semibold text-text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gradient-bg therapeutic-transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-text-primary">
                      {receipt.receiptNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-text-primary">
                      {receipt.clientName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(receipt.type)}`}>
                      {receipt.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-text-primary">
                      {receipt.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-text-primary">{receipt.date}</span>
                      <span className="text-xs text-text-secondary">{receipt.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(receipt.status)}`}>
                      {receipt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/receipt-detail-view?id=${receipt.id}`}
                        className="p-2 rounded-lg text-brand-primary hover:bg-brand-primary/10 therapeutic-transition"
                        title="View Receipt"
                      >
                        <Icon name="EyeIcon" size={18} variant="outline" />
                      </Link>
                      <Link
                        href={`/pdf-generation-view?id=${receipt.id}`}
                        className="p-2 rounded-lg text-secondary hover:bg-secondary/10 therapeutic-transition"
                        title="Download PDF"
                      >
                        <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {receipts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Icon name="DocumentTextIcon" size={32} variant="outline" className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">No Recent Activity</h3>
            <p className="text-sm text-text-secondary text-center mb-6">
              Start by creating your first receipt to see activity here
            </p>
            <Link
              href="/receipt-type-selection"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-action therapeutic-transition shadow-clinical"
            >
              <Icon name="PlusCircleIcon" size={20} variant="solid" />
              <span>Add Receipt</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;