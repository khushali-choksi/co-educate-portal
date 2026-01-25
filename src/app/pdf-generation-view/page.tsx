import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PDFGenerationInteractive from './components/PDFGenerationInteractive';

export const metadata: Metadata = {
  title: 'Generate PDF - CORE EDUCATE Portal',
  description: 'Professional PDF receipt generation with print-optimized layout and branding.',
};

export default function PDFGenerationViewPage() {
  return (
    <ProtectedRoute>
      <Header />
      <PDFGenerationInteractive />
    </ProtectedRoute>
  );
}