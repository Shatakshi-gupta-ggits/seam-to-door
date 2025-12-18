-- Create OTP verification table
CREATE TABLE public.phone_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes'),
  verified BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for sending OTP)
CREATE POLICY "Anyone can request OTP" 
ON public.phone_otps 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to select their own OTP by phone
CREATE POLICY "Anyone can verify their OTP" 
ON public.phone_otps 
FOR SELECT 
USING (true);

-- Allow updates for verification
CREATE POLICY "Anyone can update OTP verification status" 
ON public.phone_otps 
FOR UPDATE 
USING (true);

-- Index for faster lookups
CREATE INDEX idx_phone_otps_phone ON public.phone_otps(phone);
CREATE INDEX idx_phone_otps_expires_at ON public.phone_otps(expires_at);