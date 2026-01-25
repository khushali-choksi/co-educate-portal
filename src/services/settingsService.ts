import { supabase } from '@/lib/supabase/client';
import { PracticeSetting, InsertPracticeSetting, UpdatePracticeSetting } from '@/types/supabase.types';

export const settingsService = {
  async get(userId: string): Promise<PracticeSetting | null> {
    const { data, error } = await supabase
      .from('practice_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(settings: InsertPracticeSetting): Promise<PracticeSetting> {
    const { data, error } = await supabase
      .from('practice_settings')
      .insert(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(userId: string, updates: UpdatePracticeSetting): Promise<PracticeSetting> {
    const { data, error } = await supabase
      .from('practice_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async upsert(settings: InsertPracticeSetting): Promise<PracticeSetting> {
    const { data, error } = await supabase
      .from('practice_settings')
      .upsert(settings, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};