import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ReceiptDetailInteractive from './components/ReceiptDetailInteractive';

export const metadata: Metadata = {
  title: 'Receipt Details - CORE EDUCATE Portal',
  description: 'Detailed view of individual receipts with full client information, payment history, and related records.',
};

export default function ReceiptDetailViewPage() {
  return (
    <ProtectedRoute>
      <Header />
      <ReceiptDetailInteractive />
    </ProtectedRoute>
  );
}