import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';

export type SupabaseClient = ReturnType<typeof createBrowserClient<Database>>;

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

// Specific table types
export type UserProfile = Tables<'user_profiles'>;
export type PracticeSetting = Tables<'practice_settings'>;
export type Client = Tables<'clients'>;
export type Receipt = Tables<'receipts'>;
export type ReceiptChange = Tables<'receipt_changes'>;
export type AuditLog = Tables<'audit_logs'>;

export type InsertUserProfile = InsertTables<'user_profiles'>;
export type InsertPracticeSetting = InsertTables<'practice_settings'>;
export type InsertClient = InsertTables<'clients'>;
export type InsertReceipt = InsertTables<'receipts'>;
export type InsertReceiptChange = InsertTables<'receipt_changes'>;
export type InsertAuditLog = InsertTables<'audit_logs'>;

export type UpdateUserProfile = UpdateTables<'user_profiles'>;
export type UpdatePracticeSetting = UpdateTables<'practice_settings'>;
export type UpdateClient = UpdateTables<'clients'>;
export type UpdateReceipt = UpdateTables<'receipts'>;