import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, User, ArrowRight, Shield, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession, useUser } from '@descope/react-sdk';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import logo from '@/assets/logo.png';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('descope_user', JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
        userId: user.userId
      }));
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google login for now - replace with actual implementation
      toast.info('Google login will be implemented soon. Please use email for now.');

      // For demo purposes, simulate successful login after 2 seconds
      setTimeout(() => {
        const demoUser = {
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+91-9876543210',
          userId: 'demo-user-id'
        };

        localStorage.setItem('descope_user', JSON.stringify(demoUser));
        toast.success('Welcome! You are now signed in.');
        navigate('/home');
      }, 2000);

    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setIsLoading(true);
    try {
      // Simulate email auth for now
      setTimeout(() => {
        const demoUser = {
          name: 'Email User',
          email: 'user@example.com',
          phone: '+91-9876543210',
          userId: 'email-user-id'
        };

        localStorage.setItem('descope_user', JSON.stringify(demoUser));
        toast.success('Welcome! You are now signed in.');
        navigate('/home');
      }, 1500);

    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const trustBadges = [
    { icon: Shield, label: "Secure Login" },
    { icon: Sparkles, label: "Quick Setup" },
    { icon: Clock, label: "Instant Access" },
  ];

  if (isSessionLoading) {
    return (
      <div className="min-h-screen auth-gradient flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-gradient auth-container flex items-center justify-center p-4">
      <SEO
        title="Login - Mr Finisher"
        description="Sign in to Mr Finisher to book alterations, track orders, and manage your profile."
        keywords="login, sign in, alteration booking, Jabalpur tailoring"
        canonicalUrl="/auth"
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <motion.img
                src={logo}
                alt="Mr Finisher Logo"
                className="w-12 h-12"
                whileHover={{ scale: 1.1, rotate: 45 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <badge.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{badge.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
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
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2">
              <motion.img
                src={logo}
                alt="Mr Finisher Logo"
                className="w-10 h-10"
                whileHover={{ scale: 1.1, rotate: 45 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <span className="font-display font-bold text-2xl">
                Mr<span className="text-primary">Finisher</span>
              </span>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-muted-foreground">
                {authMode === 'signin'
                  ? 'Sign in to your account to continue'
                  : 'Create your account in seconds'
                }
              </p>
            </div>

            {/* Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm mb-6 group"
              variant="outline"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium"
                disabled={isLoading}
                onClick={handleEmailAuth}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Toggle Auth Mode */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-xs mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
