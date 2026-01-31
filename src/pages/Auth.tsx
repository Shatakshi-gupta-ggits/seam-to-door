import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield, Sparkles, Clock, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Descope, useSession, useUser } from '@descope/react-sdk';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import SEO from "@/components/SEO";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = 'main' | 'email' | 'phone';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading, signIn, signUp, user } = useAuth();
  const { isAuthenticated: isDescopeAuth, isSessionLoading: descopeLoading } = useSession();
  const { user: descopeUser } = useUser();
  
  const [authMode, setAuthMode] = useState<AuthMode>('main');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Email form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Phone OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Handle Descope authentication success
  useEffect(() => {
    if (isDescopeAuth && descopeUser && !descopeLoading) {
      const email = descopeUser.email || '';
      const name = descopeUser.name || '';
      
      toast.success(`Welcome ${name || email.split('@')[0]}!`);
      navigate('/home');
      
      // Sync user to Supabase profiles in background
      const syncProfile = async () => {
        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
          
          if (!existingProfile) {
            await supabase.from('profiles').insert({
              user_id: descopeUser.userId || `descope_${Date.now()}`,
              email: email,
              full_name: name,
            });
          }
        } catch (error) {
          console.error('Profile sync error:', error);
        }
      };
      
      setTimeout(syncProfile, 100);
    }
  }, [isDescopeAuth, descopeUser, descopeLoading, navigate]);

  // Handle Supabase authentication
  useEffect(() => {
    if (isAuthenticated && !isSessionLoading) {
      toast.success(`Welcome ${user?.email?.split('@')[0] || 'back'}!`);
      navigate('/home');
    }
  }, [isAuthenticated, isSessionLoading, navigate, user]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          toast.error(error.message || 'Sign up failed');
        } else {
          toast.success('Account created! Please check your email to verify.');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message || 'Sign in failed');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP functions
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setOtpLoading(true);
    
    try {
      // Format phone number with country code
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Generate a random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in Supabase for verification (expires in 5 minutes)
      const { error: insertError } = await supabase
        .from('phone_otps')
        .insert({
          phone: formattedPhone,
          otp_code: generatedOtp,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        });

      if (insertError) throw insertError;

      // For demo purposes, show OTP in toast (in production, integrate with SMS provider)
      toast.success(`OTP sent! (Demo: ${generatedOtp})`);
      setOtpSent(true);
      
    } catch (error: any) {
      console.error('OTP send error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Verify OTP from database
      const { data: otpRecord, error: fetchError } = await supabase
        .from('phone_otps')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('otp_code', otpCode)
        .eq('verified', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpRecord) {
        toast.error('Invalid or expired OTP. Please try again.');
        return;
      }

      // Mark OTP as verified
      await supabase
        .from('phone_otps')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      // Check if profile exists with this phone
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .single();

      if (existingProfile) {
        // Profile exists, update it
        await supabase
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', existingProfile.id);
        
        toast.success('Welcome back!');
      } else {
        // Create new profile for phone user
        await supabase.from('profiles').insert({
          user_id: `phone_${formattedPhone.replace(/\+/g, '')}`,
          phone: formattedPhone,
          full_name: '',
        });
        
        toast.success('Account created successfully!');
      }

      // Store auth state in localStorage for phone users
      localStorage.setItem('phone_auth', JSON.stringify({
        phone: formattedPhone,
        authenticated: true,
        timestamp: Date.now()
      }));

      navigate('/home');
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleDescopeSuccess = () => {
    // Handled by useEffect
  };

  const handleDescopeError = () => {
    toast.error('Google sign in failed. Please try again.');
  };

  const goBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setOtpCode('');
    } else {
      setAuthMode('main');
      setIsSignUp(false);
    }
  };

  // Show loader during auth check
  if (isSessionLoading || descopeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO
        title="Login - Mr Finisher"
        description="Sign in to Mr Finisher to book alterations, track orders, and manage your profile."
        keywords="login, sign in, alteration booking, Jabalpur tailoring"
        canonicalUrl="/auth"
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <img src={logo} alt="Mr Finisher Logo" className="w-12 h-12" loading="eager" />
              <span className="font-display font-bold text-3xl">
                Mr<span className="text-primary">Finisher</span>
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Perfect fit,{" "}
              <span className="text-gradient-gold">every time</span>
              <br />
              — we come to you.
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Join thousands of satisfied customers in Jabalpur who trust us for their alteration needs.
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm">Secure Login</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm">Quick Setup</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">Instant Access</span>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <p className="text-sm text-muted-foreground mb-2">✨ What you get:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Free pickup & delivery in Jabalpur
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  24-48 hours turnaround time
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Expert tailors & quality guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2">
              <img src={logo} alt="Mr Finisher Logo" className="w-10 h-10" loading="eager" />
              <span className="font-display font-bold text-2xl">
                Mr<span className="text-primary">Finisher</span>
              </span>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            
            {/* Main Auth Options */}
            {authMode === 'main' && (
              <>
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-bold mb-2">Welcome to Mr Finisher</h2>
                  <p className="text-muted-foreground">Choose how you'd like to continue</p>
                </div>

                <div className="space-y-4">
                  {/* Descope Google Sign In */}
                  <div className="descope-container [&_*]:!font-body">
                    <Descope
                      flowId="sign-up-or-in"
                      theme="dark"
                      onSuccess={handleDescopeSuccess}
                      onError={handleDescopeError}
                    />
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  {/* Phone OTP Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setAuthMode('phone')}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Phone Number (OTP)
                  </Button>

                  {/* Email Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setAuthMode('email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Continue with Email
                  </Button>
                </div>
              </>
            )}

            {/* Phone OTP Flow */}
            {authMode === 'phone' && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mb-4"
                  onClick={goBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <div className="text-center mb-6">
                  <Phone className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-xl font-semibold">
                    {otpSent ? 'Enter OTP' : 'Sign in with Phone'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {otpSent 
                      ? `We've sent a code to +91 ${phoneNumber}`
                      : 'We will send you a one-time password'
                    }
                  </p>
                </div>

                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="9876543210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="pl-12"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleSendOTP}
                      disabled={otpLoading || phoneNumber.length < 10}
                    >
                      {otpLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Send OTP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otpCode}
                        onChange={setOtpCode}
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

                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otpCode.length !== 6}
                    >
                      {otpLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Verify & Continue
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Email Form */}
            {authMode === 'email' && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mb-4"
                  onClick={goBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <div className="text-center mb-6">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-xl font-semibold">
                    {isSignUp ? 'Create Account' : 'Sign In with Email'}
                  </h3>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="pl-10"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
