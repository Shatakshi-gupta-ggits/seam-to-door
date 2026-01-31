import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield, Sparkles, Clock, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Descope, useSession, useUser } from '@descope/react-sdk';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading, signIn, signUp, user } = useAuth();
  const { isAuthenticated: isDescopeAuth, isSessionLoading: descopeLoading } = useSession();
  const { user: descopeUser } = useUser();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Handle Descope authentication success - optimized
  useEffect(() => {
    if (isDescopeAuth && descopeUser && !descopeLoading) {
      const email = descopeUser.email || '';
      const name = descopeUser.name || '';
      
      // Navigate immediately for better UX
      toast.success(`Welcome ${name || email.split('@')[0]}!`);
      navigate('/home');
      
      // Sync user to Supabase profiles in background (non-blocking)
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleDescopeSuccess = () => {
    // Handled by useEffect above
  };

  const handleDescopeError = () => {
    toast.error('Google sign in failed. Please try again.');
  };

  // Show minimal loader during auth check - reduce loading time
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
        {/* Left Side - Branding (Hidden on mobile for faster LCP) */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <img
                src={logo}
                alt="Mr Finisher Logo"
                className="w-12 h-12"
                loading="eager"
              />
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

            {/* Trust Badges */}
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
              <img
                src={logo}
                alt="Mr Finisher Logo"
                className="w-10 h-10"
                loading="eager"
              />
              <span className="font-display font-bold text-2xl">
                Mr<span className="text-primary">Finisher</span>
              </span>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold mb-2">
                Welcome to Mr Finisher
              </h2>
              <p className="text-muted-foreground">
                Sign in with Google to get started
              </p>
            </div>

            {/* Descope Google Sign In */}
            {!showEmailForm && (
              <div className="space-y-4">
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
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Continue with Email
                </Button>
              </div>
            )}

            {/* Email Form */}
            {showEmailForm && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mb-4"
                  onClick={() => setShowEmailForm(false)}
                >
                  ← Back to Google Sign In
                </Button>

                <div className="text-center mb-6">
                  <h3 className="font-display text-lg font-semibold">
                    {isSignUp ? 'Create Account' : 'Sign In with Email'}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Button>
                </form>

                {/* Toggle Sign Up/Sign In */}
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
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
