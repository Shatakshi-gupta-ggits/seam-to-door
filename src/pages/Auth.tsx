import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Shield, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { Descope } from '@descope/react-sdk';
import { useDescopeAuth } from "@/hooks/useDescopeAuth";
import SEO from "@/components/SEO";
import logo from "@/assets/logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading, descopeUser } = useDescopeAuth();

  useEffect(() => {
    if (isAuthenticated && !isSessionLoading) {
      toast.success(`Welcome ${descopeUser?.name || 'back'}!`);
      navigate('/home');
    }
  }, [isAuthenticated, isSessionLoading, navigate, descopeUser]);

  const handleDescopeSuccess = (e: any) => {
    console.log('Descope success:', e.detail.user);
    toast.success(`Welcome ${e.detail.user.name || 'back'}!`);
    navigate('/home');
  };

  const handleDescopeError = (err: any) => {
    console.error('Descope error:', err);
    toast.error('Authentication failed. Please try again.');
  };

  const trustBadges = [
    { icon: Shield, label: "Secure Login" },
    { icon: Sparkles, label: "Quick Setup" },
    { icon: Clock, label: "Instant Access" },
  ];

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl p-6 border border-border">
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
          <div className="bg-gradient-card rounded-3xl p-8 shadow-lift border border-border">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                Welcome to Mr Finisher
              </h2>
              <p className="text-muted-foreground">
                Sign in with Google or create an account to get started
              </p>
            </div>

            {/* Descope Authentication Flow */}
            <div className="space-y-4">
              <Descope
                flowId="sign-up-or-in"
                theme="light"
                onSuccess={handleDescopeSuccess}
                onError={handleDescopeError}
                style={{
                  width: '100%',
                  minHeight: '400px'
                }}
              />
            </div>

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
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;