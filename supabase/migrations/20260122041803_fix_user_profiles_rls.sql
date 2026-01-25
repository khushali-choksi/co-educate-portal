-- Fix RLS policies for user_profiles to allow profile creation during signup
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON user_profiles;

-- Create separate policies for different operations
-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile (optional, for account deletion)
CREATE POLICY "Users can delete own profile"
ON user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);