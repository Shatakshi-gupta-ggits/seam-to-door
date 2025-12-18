import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number is too long')
  .regex(/^\+?[0-9]+$/, 'Please enter a valid phone number');

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const formatPhoneNumber = (value: string) => {
    // Add +91 prefix for Indian numbers if not present
    if (value && !value.startsWith('+')) {
      return '+91' + value.replace(/^0+/, '');
    }
    return value;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formattedPhone = formatPhoneNumber(phone);
    const result = phoneSchema.safeParse(formattedPhone);
    
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
        body: { phone: formattedPhone, action: 'send' }
      });

      if (fnError) throw fnError;

      if (data.success) {
        toast.success('OTP sent to your phone');
        setPhone(formattedPhone);
        setStep('otp');
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
        body: { phone, action: 'verify', otp }
      });

      if (fnError) throw fnError;

      if (data.success) {
        // Store verified phone in localStorage for the session
        localStorage.setItem('verified_phone', phone);
        toast.success('Phone verified successfully!');
        navigate('/booking');
      } else {
        setError(data.message || 'Invalid OTP');
        toast.error(data.message || 'Invalid or expired OTP');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      toast.error(err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setOtp('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
        body: { phone, action: 'send' }
      });

      if (fnError) throw fnError;

      if (data.success) {
        toast.success('New OTP sent to your phone');
      } else {
        throw new Error(data.error || 'Failed to resend OTP');
      }
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 group">
            <Scissors className="w-10 h-10 text-primary" />
            <span className="font-display font-bold text-2xl">
              Mr<span className="text-primary">Finisher</span>
            </span>
          </a>
        </div>

        {/* Auth Card */}
        <div className="bg-gradient-card border border-border rounded-2xl p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold text-center mb-2">
            {step === 'phone' ? 'Verify Your Phone' : 'Enter OTP'}
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            {step === 'phone' 
              ? 'Enter your phone number to receive a verification code'
              : `We sent a 6-digit code to ${phone}`
            }
          </p>

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`pl-10 ${error ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Indian numbers will be automatically prefixed with +91
                </p>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button 
                variant="gold" 
                className="w-full" 
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="text-center space-y-2">
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-primary hover:underline text-sm disabled:opacity-50"
                >
                  Resend OTP
                </button>
                <p className="text-muted-foreground">or</p>
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError('');
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Change phone number
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
