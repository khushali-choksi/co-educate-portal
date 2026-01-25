import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PilatesReceiptFormInteractive from './components/PilatesReceiptFormInteractive';

export const metadata: Metadata = {
  title: 'Pilates Receipt Form - CORE EDUCATE Portal',
  description: 'Generate professional Pilates class and membership receipts with automated calculations.',
};

export default function PilatesReceiptFormPage() {
  return (
    <ProtectedRoute>
      <Header />
      <PilatesReceiptFormInteractive />
    </ProtectedRoute>
  );
}