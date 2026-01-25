import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PhysiotherapyFormInteractive from './components/PhysiotherapyFormInteractive';

export const metadata: Metadata = {
  title: 'Physiotherapy Receipt Form - CORE EDUCATE Portal',
  description: 'Create detailed physiotherapy treatment receipts with auto-save functionality and client management.',
};

export default function PhysiotherapyReceiptFormPage() {
  return (
    <ProtectedRoute>
      <Header />
      <PhysiotherapyFormInteractive />
    </ProtectedRoute>
  );
}