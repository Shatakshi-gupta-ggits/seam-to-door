import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Locate, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  avatar_url: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isSessionLoading, descopeUser, isDescopeAuth } = useAuth();
  const { items: cartItems, totalAmount, isLoading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false); // Changed from true to false for faster initial render
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    avatar_url: ''
  });

  // Memoize authentication check to prevent unnecessary re-renders
  const authenticationStatus = useMemo(() => {
    if (isSessionLoading) return 'loading';
    if (!isAuthenticated && !isDescopeAuth) return 'unauthenticated';
    return 'authenticated';
  }, [isAuthenticated, isDescopeAuth, isSessionLoading]);

  // Early redirect for unauthenticated users
  useEffect(() => {
    if (authenticationStatus === 'unauthenticated') {
      navigate('/auth');
      return;
    }
  }, [authenticationStatus, navigate]);

  // Initialize profile data immediately when user is available
  useEffect(() => {
    if (authenticationStatus === 'authenticated' && (user || descopeUser)) {
      initializeProfile();
    }
  }, [authenticationStatus, user, descopeUser]);

  const initializeProfile = async () => {
    // Use available user data immediately for faster UI
    const currentUser = user || descopeUser;
    const userEmail = currentUser?.email || '';
    const userName = currentUser?.user_metadata?.full_name || currentUser?.name || '';

    // Set initial profile data immediately
    setProfile(prev => ({
      ...prev,
      email: userEmail,
      full_name: userName
    }));

    // Then fetch additional data in background
    if (user?.id) {
      fetchProfileData(user.id);
    } else if (descopeUser) {
      // For Descope users, try to find existing profile
      fetchDescopeProfile(userEmail);
    }
  };

  const fetchProfileData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(prev => ({
          ...prev,
          full_name: data.full_name || prev.full_name,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          avatar_url: data.avatar_url || ''
        }));
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Don't show error toast for profile fetch failures
    }
  };

  const fetchDescopeProfile = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (data) {
        setProfile(prev => ({
          ...prev,
          full_name: data.full_name || prev.full_name,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          avatar_url: data.avatar_url || ''
        }));
      }
    } catch (error: any) {
      console.error('Error fetching Descope profile:', error);
      // Don't show error toast for profile fetch failures
    }
  };

  const handleSave = async () => {
    const currentUser = user || descopeUser;
    if (!currentUser) return;
    
    setSaving(true);
    try {
      const userId = user?.id || `descope_${descopeUser?.userId || Date.now()}`;
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      toast.success('Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    
    // Use a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      setLocating(false);
      toast.error('Location request timed out. Please try again.');
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        try {
          const { latitude, longitude } = position.coords;
          
          // Use a faster, more reliable geocoding service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: AbortSignal.timeout(10000) } // 10 second timeout
          );
          
          if (!response.ok) throw new Error('Geocoding failed');
          
          const data = await response.json();

          if (data) {
            setProfile(prev => ({
              ...prev,
              address: [data.locality, data.localityInfo?.administrative?.[3]?.name].filter(Boolean).join(', ') || data.locality || '',
              city: data.city || data.locality || '',
              state: data.principalSubdivision || '',
              pincode: data.postcode || ''
            }));
            toast.success('Location fetched successfully!');
          }
        } catch (error) {
          console.error('Error getting address:', error);
          toast.error('Failed to get address from location');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location. Please enable location access.');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 } // Use cached location if available
    );
  };

  // Show loading only during authentication check, not profile data fetch
  if (authenticationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is being redirected
  if (authenticationStatus === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="My Profile"
        description="Manage your profile, contact details, and delivery address for Mister Finisher alteration services."
        keywords="profile, account settings, delivery address, contact details"
        canonicalUrl="/profile"
      />
      
      {/* Header */}
      <div className="bg-gradient-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-2xl font-bold">My Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="grid gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-lg">Address</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUseCurrentLocation}
                      disabled={locating}
                    >
                      {locating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Locate className="w-4 h-4 mr-2" />
                      )}
                      Use Current Location
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="address"
                          placeholder="Enter your street address"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={profile.state}
                          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="w-1/2">
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="Pincode"
                          value={profile.pincode}
                          onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-border">
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Profile
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Saved Cart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-card border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Your Saved Cart</h3>
              </div>

              {cartLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground text-sm">Your cart is empty</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate('/home')}
                  >
                    Browse Services
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-sm text-primary">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-display font-bold text-lg">₹{totalAmount}</span>
                    </div>
                    <Button
                      variant="gold"
                      className="w-full"
                      onClick={() => navigate('/booking')}
                    >
                      Proceed to Book
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
