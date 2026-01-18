import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { Descope, useSession, useUser } from '@descope/react-sdk';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Store user info in localStorage for easy access
      localStorage.setItem('descope_user', JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
        userId: user.userId
      }));
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSuccess = (e: CustomEvent) => {
    console.log('Login successful:', e.detail.user.name, e.detail.user.email);
    toast.success('Welcome! You are now signed in.');
    // Store user info
    localStorage.setItem('descope_user', JSON.stringify({
      name: e.detail.user.name,
      email: e.detail.user.email,
      phone: e.detail.user.phone,
      userId: e.detail.user.userId
    }));
    navigate('/home');
  };

  const handleError = (err: CustomEvent) => {
    console.error('Auth error:', err);
    toast.error('Authentication failed. Please try again.');
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO 
        title="Login"
        description="Sign in to Mister Finisher to book alterations, track orders, and manage your profile."
        keywords="login, sign in, alteration booking, Jabalpur tailoring"
        canonicalUrl="/auth"
      />
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
        <div className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card">
          <h1 className="font-display text-2xl font-bold text-center mb-2">
            Welcome
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Sign in or create an account to continue
          </p>

          {/* Descope Flow */}
          <div className="descope-container">
            <Descope
              flowId="sign-up-or-in"
              theme="light"
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
