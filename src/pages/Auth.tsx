import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Shield, Sparkles, Clock, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import logo from "@/assets/logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading, signIn, signUp, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

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
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? 'Sign up to get started with Mr Finisher'
                  : 'Sign in to your account to continue'
                }
              </p>
            </div>

            {/* Auth Form */}
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
                variant="gold"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-6 text-center">
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