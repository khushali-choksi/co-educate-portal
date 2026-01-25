import { supabase } from '@/lib/supabase/client';

interface DashboardStats {
  todayReceipts: number;
  todayAmount: number;
  monthReceipts: number;
  monthAmount: number;
  pendingPayments: number;
  totalClients: number;
}

interface RecentReceipt {
  id: string;
  receipt_number: string;
  client_name: string;
  receipt_type: string;
  total_amount: number;
  issue_date: string;
  created_at: string;
  receipt_status: string;
}

export const dashboardService = {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

      const [todayData, monthData, clientsData] = await Promise.all([
        supabase
          .from('receipts')
          .select('total_amount')
          .eq('user_id', userId)
          .eq('issue_date', today),
        
        supabase
          .from('receipts')
          .select('total_amount')
          .eq('user_id', userId)
          .gte('issue_date', startOfMonthStr),
        
        supabase
          .from('clients')
          .select('id')
          .eq('user_id', userId)
          .eq('is_active', true)
      ]);

      const todayReceipts = todayData?.data || [];
      const monthReceipts = monthData?.data || [];
      const clients = clientsData?.data || [];

      const todayAmount = todayReceipts.reduce((sum, r) => sum + (r?.total_amount || 0), 0);
      const monthAmount = monthReceipts.reduce((sum, r) => sum + (r?.total_amount || 0), 0);

      const pendingData = await supabase
        .from('receipts')
        .select('id')
        .eq('user_id', userId)
        .in('receipt_status', ['draft', 'modified']);

      const pendingPayments = pendingData?.data?.length || 0;

      return {
        todayReceipts: todayReceipts.length,
        todayAmount,
        monthReceipts: monthReceipts.length,
        monthAmount,
        pendingPayments,
        totalClients: clients.length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        todayReceipts: 0,
        todayAmount: 0,
        monthReceipts: 0,
        monthAmount: 0,
        pendingPayments: 0,
        totalClients: 0
      };
    }
  },

  async getRecentReceipts(userId: string, limit: number = 5): Promise<RecentReceipt[]> {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('id, receipt_number, client_name, receipt_type, total_amount, issue_date, created_at, receipt_status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent receipts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent receipts:', error);
      return [];
    }
  }
};