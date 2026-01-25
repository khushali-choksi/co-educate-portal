import { supabase } from '@/lib/supabase/client';
import { Receipt, InsertReceipt, UpdateReceipt } from '@/types/supabase.types';

export const receiptsService = {
  async getAll(userId: string): Promise<Receipt[]> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Receipt | null> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(receipt: InsertReceipt): Promise<Receipt> {
    const { data, error } = await supabase
      .from('receipts')
      .insert(receipt)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: UpdateReceipt): Promise<Receipt> {
    const { data, error } = await supabase
      .from('receipts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async deleteBulk(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('receipts')
      .delete()
      .in('id', ids);

    if (error) throw error;
  },

  async filterReceipts(
    userId: string,
    filters: {
      searchQuery?: string;
      receiptType?: string;
      paymentStatus?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<Receipt[]> {
    let query = supabase
      .from('receipts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.searchQuery) {
      query = query.or(
        `client_name.ilike.%${filters.searchQuery}%,receipt_number.ilike.%${filters.searchQuery}%`
      );
    }

    if (filters.receiptType && filters.receiptType !== 'all') {
      query = query.eq('receipt_type', filters.receiptType.toLowerCase());
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      const statusMap: Record<string, string> = {
        Paid: 'issued',
        Pending: 'draft',
        Partial: 'modified',
      };
      query = query.eq('receipt_status', statusMap[filters.paymentStatus] || 'draft');
    }

    if (filters.dateFrom) {
      query = query.gte('issue_date', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('issue_date', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async generateReceiptNumber(userId: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('generate_receipt_number', { p_user_id: userId });

    if (error) throw error;
    return data;
  },

  async getRecentActivity(userId: string, limit: number = 5): Promise<Receipt[]> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getStats(userId: string) {
    const { data, error } = await supabase
      .from('receipts')
      .select('total_amount, receipt_type, receipt_status')
      .eq('user_id', userId);

    if (error) throw error;

    const receipts = data || [];
    const totalRevenue = receipts.reduce((sum, r) => sum + (r?.total_amount || 0), 0);
    const activeClients = new Set(receipts.map(r => r.client_name)).size;
    const physiotherapyCount = receipts.filter(r => r?.receipt_type === 'physiotherapy').length;
    const pilatesCount = receipts.filter(r => r?.receipt_type === 'pilates').length;

    return {
      totalReceipts: receipts.length,
      totalRevenue,
      activeClients,
      physiotherapyCount,
      pilatesCount,
    };
  },
};