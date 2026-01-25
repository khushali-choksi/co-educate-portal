import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import FilterInteractive from './components/FilterInteractive';

export const metadata: Metadata = {
  title: 'Search Receipts - CORE EDUCATE Portal',
  description: 'Advanced receipt search and filtering interface with saved filter presets for quick access.',
};

export default function FilterInterfacePage() {
  return (
    <ProtectedRoute>
      <Header />
      <FilterInteractive />
    </ProtectedRoute>
  );
}