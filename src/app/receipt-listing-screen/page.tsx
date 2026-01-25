import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ReceiptListingInteractive from './components/ReceiptListingInteractive';

export const metadata: Metadata = {
  title: 'Receipt Management - CORE EDUCATE Portal',
  description: 'Comprehensive receipt listing and management interface for physiotherapy and Pilates services with advanced filtering and bulk operations.',
};

export default function ReceiptListingPage() {
  return (
    <ProtectedRoute>
      <Header />
      <ReceiptListingInteractive />
    </ProtectedRoute>
  );
}