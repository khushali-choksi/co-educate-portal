-- Location: supabase/migrations/20260121095315_healthcare_receipt_management.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete healthcare receipt management system
-- Dependencies: auth.users (Supabase provided)

-- ============================================================================
-- 1. TYPES AND ENUMS
-- ============================================================================

-- User role types
CREATE TYPE public.user_role AS ENUM ('admin', 'practitioner', 'staff');

-- Receipt types
CREATE TYPE public.receipt_type AS ENUM ('physiotherapy', 'pilates');

-- Receipt status
CREATE TYPE public.receipt_status AS ENUM ('draft', 'issued', 'cancelled', 'modified');

-- Payment method
CREATE TYPE public.payment_method AS ENUM ('cash', 'card', 'upi', 'bank_transfer', 'other');

-- Pilates membership types
CREATE TYPE public.membership_type AS ENUM ('monthly', 'quarterly', 'annual');

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- User profiles table (intermediary between auth.users and application)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'staff'::public.user_role,
    practice_name TEXT,
    credentials TEXT,
    registration_number TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Practice settings table
CREATE TABLE public.practice_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    practice_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    credentials TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    registration_number TEXT,
    receipt_prefix TEXT DEFAULT 'RCP',
    receipt_starting_number INTEGER DEFAULT 1,
    date_format TEXT DEFAULT 'DD/MM/YYYY',
    currency_format TEXT DEFAULT 'INR',
    tax_enabled BOOLEAN DEFAULT false,
    tax_percentage DECIMAL(5,2) DEFAULT 0.00,
    primary_language TEXT DEFAULT 'English',
    secondary_language TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    medical_history TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Receipts table (unified for both physiotherapy and pilates)
CREATE TABLE public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    receipt_number TEXT NOT NULL,
    receipt_type public.receipt_type NOT NULL,
    receipt_status public.receipt_status DEFAULT 'issued'::public.receipt_status,
    issue_date DATE NOT NULL,
    client_name TEXT NOT NULL,
    client_age INTEGER,
    client_phone TEXT NOT NULL,
    client_address TEXT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method public.payment_method NOT NULL,
    description TEXT,
    diagnosis TEXT,
    treatment_details TEXT,
    session_count INTEGER,
    membership_type public.membership_type,
    membership_start_date DATE,
    membership_end_date DATE,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_receipt_number_per_user UNIQUE(user_id, receipt_number)
);

-- Receipt change history table
CREATE TABLE public.receipt_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id UUID REFERENCES public.receipts(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    change_type TEXT NOT NULL,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    change_reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_practice_settings_user_id ON public.practice_settings(user_id);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_phone ON public.clients(phone);
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_client_id ON public.receipts(client_id);
CREATE INDEX idx_receipts_receipt_number ON public.receipts(receipt_number);
CREATE INDEX idx_receipts_receipt_type ON public.receipts(receipt_type);
CREATE INDEX idx_receipts_issue_date ON public.receipts(issue_date);
CREATE INDEX idx_receipts_status ON public.receipts(receipt_status);
CREATE INDEX idx_receipt_changes_receipt_id ON public.receipt_changes(receipt_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================================
-- 4. FUNCTIONS
-- ============================================================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'staff'::public.user_role)
    );
    RETURN NEW;
END;
$func$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- Function to generate next receipt number
CREATE OR REPLACE FUNCTION public.generate_receipt_number(p_user_id UUID)
RETURNS TEXT
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
DECLARE
    v_prefix TEXT;
    v_next_number INTEGER;
    v_receipt_number TEXT;
BEGIN
    -- Get settings for user
    SELECT receipt_prefix, receipt_starting_number
    INTO v_prefix, v_next_number
    FROM public.practice_settings
    WHERE user_id = p_user_id;
    
    -- If no settings found, use defaults
    IF v_prefix IS NULL THEN
        v_prefix := 'RCP';
        v_next_number := 1;
    END IF;
    
    -- Get the max receipt number for this user
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM '[0-9]+$') AS INTEGER)), v_next_number - 1) + 1
    INTO v_next_number
    FROM public.receipts
    WHERE user_id = p_user_id
    AND receipt_number ~ ('^' || v_prefix || '[0-9]+$');
    
    -- Generate receipt number
    v_receipt_number := v_prefix || LPAD(v_next_number::TEXT, 6, '0');
    
    RETURN v_receipt_number;
END;
$func$;

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

-- User profiles policies (Pattern 1: Core user table)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Practice settings policies (Pattern 2: Simple user ownership)
CREATE POLICY "users_manage_own_practice_settings"
ON public.practice_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Clients policies (Pattern 2: Simple user ownership)
CREATE POLICY "users_manage_own_clients"
ON public.clients
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Receipts policies (Pattern 2: Simple user ownership)
CREATE POLICY "users_manage_own_receipts"
ON public.receipts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Receipt changes policies (Pattern 2: Simple user ownership via receipt)
CREATE POLICY "users_view_own_receipt_changes"
ON public.receipt_changes
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.receipts r
        WHERE r.id = receipt_changes.receipt_id
        AND r.user_id = auth.uid()
    )
);

CREATE POLICY "users_create_receipt_changes"
ON public.receipt_changes
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.receipts r
        WHERE r.id = receipt_changes.receipt_id
        AND r.user_id = auth.uid()
    )
);

-- Audit logs policies (Pattern 2: Simple user ownership)
CREATE POLICY "users_view_own_audit_logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_create_audit_logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practice_settings_updated_at
    BEFORE UPDATE ON public.practice_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 8. MOCK DATA (FOR DEVELOPMENT)
-- ============================================================================

DO $$
DECLARE
    admin_user_id UUID := gen_random_uuid();
    practitioner_user_id UUID := gen_random_uuid();
    client1_id UUID := gen_random_uuid();
    client2_id UUID := gen_random_uuid();
    receipt1_id UUID := gen_random_uuid();
    receipt2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (
            admin_user_id, 
            '00000000-0000-0000-0000-000000000000', 
            'authenticated', 
            'authenticated',
            'admin@healthcare.com', 
            crypt('admin123', gen_salt('bf', 10)), 
            now(), 
            now(), 
            now(),
            '{"full_name": "Dr. Admin User", "role": "admin"}'::jsonb, 
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        ),
        (
            practitioner_user_id, 
            '00000000-0000-0000-0000-000000000000', 
            'authenticated', 
            'authenticated',
            'practitioner@healthcare.com', 
            crypt('practice123', gen_salt('bf', 10)), 
            now(), 
            now(), 
            now(),
            '{"full_name": "Dr. Sarah Johnson", "role": "practitioner"}'::jsonb, 
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        );

    -- Create practice settings for admin user
    INSERT INTO public.practice_settings (
        user_id, practice_name, doctor_name, credentials, address, city, state, 
        pincode, phone, email, registration_number, receipt_prefix, 
        receipt_starting_number, tax_enabled, tax_percentage
    ) VALUES (
        admin_user_id,
        'CoreEducate Healthcare',
        'Dr. Admin User',
        'PT, DPT, OCS',
        '123 Healthcare Avenue',
        'Mumbai',
        'Maharashtra',
        '400001',
        '+91-9876543210',
        'admin@healthcare.com',
        'REG-2024-001',
        'RCP',
        1,
        true,
        18.00
    );

    -- Create clients
    INSERT INTO public.clients (
        id, user_id, name, age, gender, phone, email, address, city, state, 
        pincode, medical_history, notes
    ) VALUES
        (
            client1_id,
            admin_user_id,
            'Rajesh Kumar',
            45,
            'Male',
            '+91-9876543211',
            'rajesh.kumar@example.com',
            '456 Wellness Street',
            'Mumbai',
            'Maharashtra',
            '400002',
            'Lower back pain, previous surgery 2 years ago',
            'Prefers morning sessions'
        ),
        (
            client2_id,
            admin_user_id,
            'Priya Sharma',
            32,
            'Female',
            '+91-9876543212',
            'priya.sharma@example.com',
            '789 Health Road',
            'Mumbai',
            'Maharashtra',
            '400003',
            'Chronic neck pain, desk job',
            'Requires gentle exercises'
        );

    -- Create receipts
    INSERT INTO public.receipts (
        id, user_id, client_id, receipt_number, receipt_type, receipt_status,
        issue_date, client_name, client_age, client_phone, client_address,
        amount, payment_method, diagnosis, treatment_details, session_count,
        tax_amount, total_amount, notes
    ) VALUES
        (
            receipt1_id,
            admin_user_id,
            client1_id,
            'RCP000001',
            'physiotherapy'::public.receipt_type,
            'issued'::public.receipt_status,
            CURRENT_DATE,
            'Rajesh Kumar',
            45,
            '+91-9876543211',
            '456 Wellness Street, Mumbai, Maharashtra - 400002',
            2500.00,
            'card'::public.payment_method,
            'Lower back pain with sciatica',
            'Manual therapy, therapeutic exercises, and pain management',
            10,
            450.00,
            2950.00,
            'Follow-up recommended after 10 sessions'
        ),
        (
            receipt2_id,
            admin_user_id,
            client2_id,
            'RCP000002',
            'pilates'::public.receipt_type,
            'issued'::public.receipt_status,
            CURRENT_DATE,
            'Priya Sharma',
            32,
            '+91-9876543212',
            '789 Health Road, Mumbai, Maharashtra - 400003',
            8000.00,
            'upi'::public.payment_method,
            null,
            'Monthly pilates membership with core strengthening focus',
            null,
            1440.00,
            9440.00,
            'Membership valid for 30 days'
        );

    -- Update pilates receipt with membership details
    UPDATE public.receipts
    SET 
        membership_type = 'monthly'::public.membership_type,
        membership_start_date = CURRENT_DATE,
        membership_end_date = CURRENT_DATE + INTERVAL '30 days'
    WHERE id = receipt2_id;

    -- Create audit log entries
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details) VALUES
        (admin_user_id, 'CREATE', 'receipt', receipt1_id, '{"type": "physiotherapy", "amount": 2950.00}'::jsonb),
        (admin_user_id, 'CREATE', 'receipt', receipt2_id, '{"type": "pilates", "amount": 9440.00}'::jsonb),
        (admin_user_id, 'CREATE', 'client', client1_id, '{"name": "Rajesh Kumar"}'::jsonb),
        (admin_user_id, 'CREATE', 'client', client2_id, '{"name": "Priya Sharma"}'::jsonb);

END $$;