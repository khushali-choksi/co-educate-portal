import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: Error | null }>;
}

export interface AuthResponse {
  error: Error | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'practitioner' | 'staff';
  practice_name?: string;
  credentials?: string;
  registration_number?: string;
  phone?: string;
  is_active: boolean;
}