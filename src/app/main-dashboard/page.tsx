import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'Main Dashboard - CORE EDUCATE Portal',
  description: 'Central command center for managing physiotherapy and Pilates practice with quick access to receipts, client management, and administrative functions.',
};

export default function MainDashboardPage() {
  return (
    <ProtectedRoute>
      <Header />
      <DashboardInteractive />
    </ProtectedRoute>
  );
}