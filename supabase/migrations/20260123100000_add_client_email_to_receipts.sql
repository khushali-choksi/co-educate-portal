-- Add client_email column to receipts table
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS client_email TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.receipts.client_email IS 'Client email address for receipt communication';
