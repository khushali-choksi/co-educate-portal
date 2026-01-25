'use client';

import { useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ReceiptData {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  receiptTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  receiptType: 'physiotherapy' | 'pilates';
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMode: string;
  paymentStatus: string;
  sessionDetails?: string;
  membershipType?: string;
  membershipPeriod?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

interface PracticeData {
  practiceName: string;
  doctorName: string;
  credentials: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  registrationNumber: string;
  gstin?: string;
}

interface ReceiptPDFTemplateProps {
  receiptData: ReceiptData;
  practiceData: PracticeData;
  onDownload: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onBack: () => void;
}

const ReceiptPDFTemplate = ({ 
  receiptData, 
  practiceData,
  onDownload, 
  onPrint, 
  onWhatsApp, 
  onBack 
}: ReceiptPDFTemplateProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Convert number to words for Indian currency
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' And ' + convertLessThanThousand(n % 100) : '');
    };
    
    const intPart = Math.floor(num);
    const decimalPart = Math.round((num - intPart) * 100);
    
    let result = '';
    let tempNum = intPart;
    
    if (tempNum >= 10000000) {
      result += convertLessThanThousand(Math.floor(tempNum / 10000000)) + ' Crore ';
      tempNum = tempNum % 10000000;
    }
    
    if (tempNum >= 100000) {
      result += convertLessThanThousand(Math.floor(tempNum / 100000)) + ' Lakh ';
      tempNum = tempNum % 100000;
    }
    
    if (tempNum >= 1000) {
      result += convertLessThanThousand(Math.floor(tempNum / 1000)) + ' Thousand ';
      tempNum = tempNum % 1000;
    }
    
    if (tempNum > 0) {
      result += convertLessThanThousand(tempNum);
    }
    
    result = result.trim() + ' Rupees';
    
    if (decimalPart > 0) {
      result += ' And ' + convertLessThanThousand(decimalPart) + ' Paise';
    }
    
    return result + ' Only';
  };

  // Get service description
  const getServiceDescription = (): string => {
    // sessionDetails now contains the membership/description text from the form
    if (receiptData.sessionDetails) {
      return receiptData.sessionDetails;
    }
    // Fallback for older receipts without sessionDetails
    if (receiptData.receiptType === 'physiotherapy') {
      return 'Physiotherapy Treatment Session';
    }
    // For pilates, try to construct from membershipType and membershipPeriod
    if (receiptData.membershipType && receiptData.membershipPeriod) {
      return `${receiptData.membershipType} (${receiptData.membershipPeriod})`;
    }
    return 'Pilates Session';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Action Bar - Hidden in Print */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg shadow-clinical print:hidden">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-muted rounded-md therapeutic-transition"
        >
          <Icon name="ArrowLeftIcon" size={20} variant="outline" />
          <span>Back to Receipts</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onPrint}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-muted text-text-primary hover:bg-border rounded-md therapeutic-transition"
          >
            <Icon name="PrinterIcon" size={20} variant="outline" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={onWhatsApp}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-success text-success-foreground hover:bg-success/90 rounded-md therapeutic-transition shadow-clinical"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} variant="solid" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md therapeutic-transition shadow-clinical"
          >
            <Icon name="ArrowDownTrayIcon" size={20} variant="solid" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Receipt Template - A4 Size */}
      <div 
        ref={receiptRef}
        id="receipt-template"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '10mm 15mm',
          backgroundColor: '#ffffff',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '10px',
          lineHeight: '1.4',
          color: '#333333',
          boxSizing: 'border-box',
          margin: '0 auto',
        }}
      >
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: '2px solid #d1d5db'
        }}>
          {/* Logo */}
          <div style={{ marginRight: '10px', flexShrink: 0 }}>
            <img 
              src="/logo.jpeg" 
              alt="Core Educate Logo"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
              }}
            />
            </div>

          {/* Company Details */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B4513', margin: '0 0 3px 0', letterSpacing: '0.5px' }}>
              CORE EDUCATE
            </h1>
            <p style={{ fontSize: '8px', color: '#4b5563', margin: '1px 0' }}>
              PHYSIOTHERAPY CLINIC AND PILATES STUDIO
            </p>
            <p style={{ fontSize: '7px', color: '#4b5563', margin: '2px 0' }}>
              Ground Floor, Raj Empire-A, Lunsikui Road, Navsari-396445, Gujarat, India
            </p>
          </div>

          {/* Doctor Details - Right Side */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#1f2937', fontSize: '9px' }}>Dr. Khushali Choksi</p>
            <p style={{ margin: '1px 0', fontSize: '7px', color: '#4b5563' }}>MPT (MUSCULOSKELETAL SCIENCE), MIAP,</p>
            <p style={{ margin: '1px 0', fontSize: '7px', color: '#4b5563' }}>CERTIFIED PILATES INSTRUCTOR</p>
            <p style={{ margin: '3px 0 1px 0', fontSize: '7px', color: '#4b5563' }}>📞 98799 73439</p>
            <p style={{ margin: '1px 0', fontSize: '7px', color: '#4b5563' }}>87992 83930</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '7px', color: '#4b5563' }}><strong>Reg No. L-41870</strong></p>
          </div>
            </div>

        {/* Client Info & Invoice Info Grid */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {/* Client Information */}
          <div style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px' }}>
            <h3 style={{ fontSize: '9px', fontWeight: 'bold', color: '#374151', margin: '0 0 5px 0', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', paddingBottom: '3px' }}>
              Client Details
            </h3>
            <p style={{ margin: '2px 0', fontSize: '8px' }}><strong>Name:</strong> {receiptData.clientName}</p>
            <p style={{ margin: '2px 0', fontSize: '8px' }}><strong>Address:</strong> {receiptData.clientAddress || 'N/A'}</p>
            <p style={{ margin: '2px 0', fontSize: '8px' }}><strong>Phone:</strong> {receiptData.clientPhone}</p>
          </div>

          {/* Invoice Information */}
          <div style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px' }}>
            <h3 style={{ fontSize: '9px', fontWeight: 'bold', color: '#374151', margin: '0 0 5px 0', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', paddingBottom: '3px' }}>
              Invoice Details
            </h3>
            <p style={{ margin: '2px 0', fontSize: '8px' }}><strong>Invoice Number:</strong> {receiptData.receiptNumber}</p>
            <p style={{ margin: '2px 0', fontSize: '8px' }}><strong>Invoice Date:</strong> {receiptData.receiptDate}</p>
            <p style={{ margin: '2px 0', fontSize: '8px' }}><strong>Invoice Time:</strong> {receiptData.receiptTime}</p>
            <p style={{ margin: '2px 0', fontSize: '8px' }}>
              <strong>Payment Status:</strong>{' '}
              <span style={{
                fontWeight: 'bold',
                color: receiptData.paymentStatus === 'Paid' ? '#166534' : '#92400e'
              }}>
                {receiptData.paymentStatus}
              </span>
            </p>
          </div>
          </div>

        {/* Service/Membership Details Table */}
        <div style={{ marginBottom: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'center', fontWeight: 'bold', width: '40px' }}>Qty</th>
                <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
                {receiptData.startDate && <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'center', fontWeight: 'bold', width: '70px' }}>Start Date</th>}
                {receiptData.endDate && <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'center', fontWeight: 'bold', width: '70px' }}>End Date</th>}
                <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'right', fontWeight: 'bold', width: '80px' }}>Amount</th>
                <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'right', fontWeight: 'bold', width: '70px' }}>Discount</th>
                <th style={{ border: '1px solid #d1d5db', padding: '6px 4px', textAlign: 'right', fontWeight: 'bold', width: '80px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', textAlign: 'center', verticalAlign: 'top' }}>1</td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', verticalAlign: 'top' }}>
                  <span style={{ color: '#1f2937', fontSize: '9px', fontWeight: 'bold' }}>{getServiceDescription()}</span>
                  {receiptData.notes && (
                    <span style={{ fontSize: '8px', color: '#6b7280', fontStyle: 'italic' }}>
                      <br />{receiptData.notes}
                    </span>
                  )}
                </td>
                {receiptData.startDate && <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', textAlign: 'center', verticalAlign: 'top' }}>{receiptData.startDate}</td>}
                {receiptData.endDate && <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', textAlign: 'center', verticalAlign: 'top' }}>{receiptData.endDate}</td>}
                <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', textAlign: 'right', verticalAlign: 'top' }}>{formatCurrency(receiptData.amount)}</td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', textAlign: 'right', verticalAlign: 'top', color: receiptData.amount > receiptData.totalAmount ? '#dc2626' : '#374151' }}>
                  {receiptData.amount > receiptData.totalAmount ? `-${formatCurrency(receiptData.amount - receiptData.totalAmount)}` : formatCurrency(0)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px 4px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold', color: '#059669' }}>{formatCurrency(receiptData.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Details Table */}
        <div style={{ marginBottom: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th colSpan={4} style={{ backgroundColor: '#1f2937', color: '#ffffff', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>
                  Payment Details
                </th>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Receipt No.</th>
                <th style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Service</th>
                <th style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Mode of Payment</th>
                <th style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center' }}>{receiptData.receiptNumber}</td>
                <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center' }}>
                  {getServiceDescription()}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{receiptData.paymentMode}</td>
                <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(receiptData.totalAmount)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td colSpan={3} style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>{formatCurrency(receiptData.totalAmount)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>Paid</td>
                <td style={{ border: '1px solid #d1d5db', padding: '6px', textAlign: 'right', fontWeight: 'bold', color: '#166534' }}>{formatCurrency(receiptData.paymentStatus === 'Paid' ? receiptData.totalAmount : 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Amount in Words */}
        <table style={{ width: '100%', marginBottom: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ backgroundColor: '#e0f2fe' }}>
              <td style={{ padding: '10px 12px', border: '2px solid #0284c7', fontSize: '9px' }}>
                <strong style={{ color: '#0369a1' }}>Total Amount In Words:</strong>{' '}
                <span style={{ fontStyle: 'italic', color: '#374151' }}>{numberToWords(receiptData.totalAmount)}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Collected By */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '9px' }}>Collected by:</p>
          <p style={{ margin: '0', fontWeight: 'bold', color: '#1f2937', fontSize: '10px' }}>Dr. Khushali Choksi</p>
          <p style={{ margin: '2px 0', color: '#6b7280', fontSize: '9px' }}>MPT (MUSCULOSKELETAL SCIENCE), MIAP, CERTIFIED PILATES INSTRUCTOR</p>
          <p style={{ margin: '2px 0', color: '#6b7280', fontSize: '9px' }}>Reg. No: L-41870</p>
        </div>

        {/* Terms & Conditions */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginBottom: '8px' }}>
          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#374151', margin: '0 0 6px 0' }}>Terms & Conditions:</p>
          <p style={{ fontSize: '8px', color: '#6b7280', margin: '0 0 3px 0' }}>1. Membership rates can be revised by the management.</p>
          <p style={{ fontSize: '8px', color: '#6b7280', margin: '0 0 3px 0' }}>2. No membership is refundable.</p>
          <p style={{ fontSize: '8px', color: '#6b7280', margin: '0 0 3px 0' }}>3. This receipt is valid for the services mentioned above only.</p>
          <p style={{ fontSize: '8px', color: '#6b7280', margin: '0 0 3px 0' }}>4. Please carry this receipt for all future reference and appointments.</p>
          {receiptData.receiptType === 'physiotherapy' && (
            <p style={{ fontSize: '8px', color: '#6b7280', margin: '0 0 3px 0' }}>5. A buffer period of 7 days will be acceptable from the end date.</p>
          )}
          <p style={{ fontSize: '8px', color: '#6b7280', margin: '0' }}>{receiptData.receiptType === 'physiotherapy' ? '6' : '5'}. For any queries, please contact us at the provided contact information.</p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 2px 0', fontSize: '8px', color: '#9ca3af' }}>Thank you for choosing CORE EDUCATE for your wellness journey!</p>
          <p style={{ margin: '0', fontSize: '8px', color: '#9ca3af' }}>This is a computer-generated receipt and does not require a physical signature.</p>
        </div>
      </div>

      {/* Info Box - Hidden in Print */}
      <div className="mt-6 bg-card p-4 rounded-lg shadow-clinical print:hidden">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-brand-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Receipt Generated Successfully</p>
            <p>You can download this receipt as PDF, print it, or share it directly via WhatsApp with your client.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPDFTemplate;
