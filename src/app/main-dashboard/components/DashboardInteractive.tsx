'use client';

import { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import WelcomeBanner from './WelcomeBanner';
import { dashboardService } from '@/services/dashboardService';
import { settingsService } from '@/services/settingsService';
import { useAuth } from '@/contexts/AuthContext';

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

interface DashboardStats {
  todayReceipts: number;
  todayAmount: string;
  monthReceipts: number;
  monthAmount: string;
  pendingPayments: number;
  totalClients: number;
}

const DashboardInteractive = () => {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [practiceName, setPracticeName] = useState<string>('CORE EDUCATE');
  const [stats, setStats] = useState<DashboardStats>({
    todayReceipts: 0,
    todayAmount: '₹0',
    monthReceipts: 0,
    monthAmount: '₹0',
    pendingPayments: 0,
    totalClients: 0
  });
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (user?.id && isHydrated) {
      loadDashboardData();
    }
  }, [user?.id, isHydrated]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError('');

      const [statsData, receiptsData, settingsData] = await Promise.all([
        dashboardService.getDashboardStats(user.id),
        dashboardService.getRecentReceipts(user.id, 5),
        settingsService.get(user.id).catch(() => null)
      ]);

      // Set practice name from settings
      if (settingsData?.practice_name) {
        setPracticeName(settingsData.practice_name.toUpperCase());
      }

      setStats({
        todayReceipts: statsData.todayReceipts,
        todayAmount: `₹${statsData.todayAmount.toLocaleString('en-IN')}`,
        monthReceipts: statsData.monthReceipts,
        monthAmount: `₹${statsData.monthAmount.toLocaleString('en-IN')}`,
        pendingPayments: statsData.pendingPayments,
        totalClients: statsData.totalClients
      });

      const mappedReceipts: Receipt[] = receiptsData.map(r => {
        const statusMap: Record<string, 'Paid' | 'Unpaid'> = {
          issued: 'Paid',
          draft: 'Unpaid',
          modified: 'Unpaid',
          cancelled: 'Unpaid'
        };

        const date = new Date(r.issue_date);
        const createdDate = new Date(r.created_at);
        
        return {
          id: r.id,
          receiptNo: r.receipt_number,
          clientName: r.client_name,
          type: r.receipt_type === 'physiotherapy' ? 'Physiotherapy' : 'Pilates',
          amount: `₹${r.total_amount.toLocaleString('en-IN')}`,
          date: date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          time: createdDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          status: statusMap[r.receipt_status] || 'Unpaid'
        };
      });

      setRecentReceipts(mappedReceipts);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-24 pb-12 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-64 bg-gradient-bg rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-24 pb-12 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={loadDashboardData}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <WelcomeBanner 
            userName="Dr. Khushali Choksi"
            userRole="Practitioner"
            practiceName={practiceName}
          />

          <DashboardStats stats={stats} />

          <QuickActions />

          <RecentActivity receipts={recentReceipts} />
        </div>
      </div>
    </div>
  );
};

export default DashboardInteractive;