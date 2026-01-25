'use client';

import { useAuth } from '@/contexts/AuthContext';
import { receiptsService } from '@/services/receiptsService';
import { settingsService } from '@/services/settingsService';
import html2pdf from 'html2pdf.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReceiptPDFTemplate from './ReceiptPDFTemplate';

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

const PDFGenerationInteractive = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [practiceData, setPracticeData] = useState<PracticeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [autoShareTriggered, setAutoShareTriggered] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load receipt and practice data from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!isHydrated || authLoading) return;

    const receiptId = searchParams?.get('id');
    
      if (!receiptId) {
        setError('No receipt ID provided');
        setIsLoading(false);
        return;
      }

      if (!user?.id) {
        setError('Please log in to view receipt');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load receipt data
        const receipt = await receiptsService.getById(receiptId);
        
        if (!receipt) {
          setError('Receipt not found');
          setIsLoading(false);
          return;
        }

        // Transform to UI format
        const createdDate = new Date(receipt.created_at);
        const transformedReceipt: ReceiptData = {
          id: receipt.id,
          receiptNumber: receipt.receipt_number,
          receiptDate: formatDateForDisplay(receipt.issue_date),
          receiptTime: createdDate.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          clientName: receipt.client_name,
          clientEmail: '', 
          clientPhone: receipt.client_phone,
          clientAddress: receipt.client_address || '',
          receiptType: receipt.receipt_type as 'physiotherapy' | 'pilates',
          amount: receipt.amount,
          taxAmount: receipt.tax_amount || 0,
          totalAmount: receipt.total_amount,
          paymentMode: mapPaymentMethodToDisplay(receipt.payment_method),
          paymentStatus: mapStatusToDisplay(receipt.receipt_status),
          sessionDetails: receipt.description || undefined,
          membershipType: receipt.membership_type ? capitalizeFirst(receipt.membership_type) : undefined,
          membershipPeriod: getMembershipPeriodText(receipt.membership_type),
          startDate: receipt.membership_start_date ? formatDateForDisplay(receipt.membership_start_date) : undefined,
          endDate: receipt.membership_end_date ? formatDateForDisplay(receipt.membership_end_date) : undefined,
          notes: receipt.notes || undefined,
          createdAt: receipt.created_at,
        };

        setReceiptData(transformedReceipt);

        // Load practice settings
        try {
          const settings = await settingsService.get(user.id);
          if (settings) {
            setPracticeData({
              practiceName: settings.practice_name,
              doctorName: settings.doctor_name,
              credentials: settings.credentials || 'BPT, MPT',
              address: settings.address,
              city: settings.city,
              state: settings.state,
              pincode: settings.pincode,
              phone: settings.phone,
              email: settings.email,
              registrationNumber: settings.registration_number || '',
              gstin: undefined,
            });
      } else {
            // Default practice data
            setPracticeData({
              practiceName: 'CORE EDUCATE',
              doctorName: 'Dr. Khushali Choksi',
              credentials: 'MPT (MUSCULOSKELETAL SCIENCE), MIAP, CERTIFIED PILATES INSTRUCTOR',
              address: 'Ground Floor, Raj Empire-A, Lunsikui Road',
              city: 'Navsari',
              state: 'Gujarat',
              pincode: '396445',
              phone: '98799 73439 / 87992 83930',
              email: 'info@coreeducate.com',
              registrationNumber: 'L-41870',
            });
          }
        } catch (settingsErr) {
          // Use default settings if can't load
          setPracticeData({
            practiceName: 'CORE EDUCATE',
            doctorName: 'Dr. Khushali Choksi',
            credentials: 'MPT (MUSCULOSKELETAL SCIENCE), MIAP, CERTIFIED PILATES INSTRUCTOR',
            address: 'Ground Floor, Raj Empire-A, Lunsikui Road',
            city: 'Navsari',
            state: 'Gujarat',
            pincode: '396445',
            phone: '98799 73439 / 87992 83930',
            email: 'info@coreeducate.com',
            registrationNumber: 'L-41870',
          });
        }

      } catch (err: any) {
        setError(err?.message || 'Failed to load receipt');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isHydrated, authLoading, user, searchParams]);

  const formatDateForDisplay = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const mapPaymentMethodToDisplay = (method: string | null): string => {
    switch (method) {
      case 'cash': return 'CASH';
      case 'card': return 'CARD';
      case 'upi': return 'UPI';
      case 'bank_transfer': return 'BANK TRANSFER';
      default: return 'CASH';
    }
  };

  const mapStatusToDisplay = (status: string): string => {
    switch (status) {
      case 'issued': return 'Paid';
      case 'draft': return 'Pending';
      case 'modified': return 'Partial';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getMembershipPeriodText = (type: string | null): string | undefined => {
    switch (type) {
      case 'monthly': return '1 Month';
      case 'quarterly': return '3 Months';
      case 'annual': return '12 Months';
      default: return undefined;
    }
  };

  const handleDownloadPDF = async () => {
    if (!isHydrated || !receiptData) return;

    setIsGenerating(true);
    
    try {
      const element = document.getElementById('receipt-template');
      if (element) {
        const opt = {
          margin: 0,
          filename: `Receipt_${receiptData.receiptNumber}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
          },
          jsPDF: { 
            unit: 'mm' as const, 
            format: 'a4' as const, 
            orientation: 'portrait' as const
          },
          pagebreak: { mode: 'avoid-all', before: [], after: [], avoid: ['tr', 'td', 'div', 'table'] }
        };

        // Generate PDF and manipulate to single page
        const pdfInstance = html2pdf().set(opt).from(element).toPdf();
        await pdfInstance.get('pdf').then((pdf: any) => {
          // Remove all pages except the first one
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = totalPages; i > 1; i--) {
            pdf.deletePage(i);
          }
        });
        await pdfInstance.save();
        
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!isHydrated) return;
    window.print();
  };

  const formatPhoneForWhatsApp = (phone: string): string => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/[^0-9]/g, '');
    
    // If number starts with 0, remove it and add 91 (India code)
    if (cleaned.startsWith('0')) {
      cleaned = '91' + cleaned.substring(1);
    }
    
    // If number is 10 digits (Indian mobile without country code), add 91
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    // If number starts with +, it's already been cleaned, just ensure no +
    return cleaned;
  };

  // Format client name for filename (lowercase, replace spaces with underscores)
  const formatNameForFilename = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_'); // Replace spaces with underscores
  };

  const handleWhatsApp = async () => {
    if (!isHydrated || !receiptData) return;

    setIsGenerating(true);
    
    try {
      const element = document.getElementById('receipt-template');
      if (!element) {
        throw new Error('Receipt template not found');
      }

      // Create filename: clientname_receipt_number.pdf
      const clientNameForFile = formatNameForFilename(receiptData.clientName);
      const filename = `${clientNameForFile}_receipt_${receiptData.receiptNumber}.pdf`;

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const
        },
        pagebreak: { mode: 'avoid-all', before: [], after: [], avoid: ['tr', 'td', 'div', 'table'] }
      };

      // Generate PDF as blob
      const pdfInstance = html2pdf().set(opt).from(element).toPdf();
      
      await pdfInstance.get('pdf').then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = totalPages; i > 1; i--) {
          pdf.deletePage(i);
        }
      });

      const pdfBlob = await pdfInstance.output('blob');

      // Step 1: Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setPdfDownloaded(true);

      // Step 2: Open WhatsApp chat with the client's number
      const message = `Hello ${receiptData.clientName},

Your receipt from ${practiceData?.practiceName || 'CORE EDUCATE'} has been generated.

📄 Receipt Details:
• Receipt No: ${receiptData.receiptNumber}
• Date: ${receiptData.receiptDate}
• Amount: ₹${receiptData.totalAmount.toLocaleString('en-IN')}
• Status: ${receiptData.paymentStatus}

Please find the PDF receipt attached.

Thank you for choosing ${practiceData?.practiceName || 'CORE EDUCATE'}!

Best regards,
${'Dr. Khushali Choksi'}`;

      const phoneNumber = formatPhoneForWhatsApp(receiptData.clientPhone);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Small delay to ensure PDF download starts, then open WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-trigger WhatsApp share if share=whatsapp parameter is present
  useEffect(() => {
    if (receiptData && practiceData && !isLoading && !autoShareTriggered) {
      const shareAction = searchParams?.get('share');
      if (shareAction === 'whatsapp') {
        setAutoShareTriggered(true);
        // Small delay to ensure component is fully ready
        setTimeout(() => {
          handleWhatsApp();
        }, 500);
      }
    }
  }, [receiptData, practiceData, isLoading, searchParams, autoShareTriggered]);

  const handleBack = () => {
    router.push('/receipt-listing-screen');
  };

  if (!isHydrated || isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-clinical-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-text-primary">Loading receipt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-clinical-lg p-8 max-w-md w-full text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-error" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-lg font-medium text-text-primary">Error</p>
            <p className="text-text-secondary">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 therapeutic-transition"
            >
              Back to Receipts
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!receiptData || !practiceData) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-clinical-lg p-8 max-w-md w-full text-center">
          <p className="text-lg font-medium text-text-primary">Receipt not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 therapeutic-transition"
          >
            Back to Receipts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg py-8 px-4 sm:px-6 lg:px-8 pt-20">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-clinical-lg animate-fade-in">
          <p className="font-medium">PDF generated successfully!</p>
        </div>
      )}

      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-clinical-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium text-text-primary">Generating PDF...</p>
              <p className="text-sm text-text-secondary text-center">Please wait while we prepare your receipt</p>
            </div>
          </div>
        </div>
      )}

      <ReceiptPDFTemplate
        receiptData={receiptData}
        practiceData={practiceData}
        onDownload={handleDownloadPDF}
        onPrint={handlePrint}
        onWhatsApp={handleWhatsApp}
        onBack={handleBack}
      />
    </div>
  );
};

export default PDFGenerationInteractive;
