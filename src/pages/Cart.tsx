import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Cart = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'qr'>('upi');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Select all items by default
    setSelectedItems(new Set(items.map(item => item.id)));
  }, [items]);

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const selectedTotal = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + (item.service?.price || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select items to checkout');
      return;
    }

    setCheckingOut(true);

    try {
      // Get user profile for address
      const { data: profile } = await supabase
        .from('profiles')
        .select('address, city, state, pincode')
        .eq('user_id', user?.id)
        .maybeSingle();

      const pickupAddress = profile
        ? [profile.address, profile.city, profile.state, profile.pincode].filter(Boolean).join(', ')
        : 'Address not set';

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id as string,
          order_number: `MRF-${Date.now()}`,
          total_amount: selectedTotal,
          payment_method: paymentMethod,
          payment_status: 'completed',
          pickup_address: pickupAddress,
          expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed' as const
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const selectedItemsList = items.filter(item => selectedItems.has(item.id));
      const orderItems = selectedItemsList.map(item => ({
        order_id: order.id,
        service_id: item.service_id,
        service_name: item.service?.name || 'Unknown Service',
        quantity: item.quantity,
        price: item.service?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Remove checked out items from cart
      for (const itemId of selectedItems) {
        await removeFromCart(itemId);
      }

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setCheckingOut(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="font-display text-2xl font-bold">My Cart</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some services to get started
            </p>
            <Button variant="gold" onClick={() => navigate('/home')}>
              Explore Services
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-gradient-card border border-border rounded-xl p-4 flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.size === items.length}
                  onCheckedChange={selectAll}
                />
                <span className="font-medium">
                  Select All ({items.length} items)
                </span>
              </div>

              {/* Items List */}
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-card border border-border rounded-xl p-4"
                >
                  <div className="flex gap-4">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    
                    <div className="w-20 h-20 rounded-lg bg-card overflow-hidden flex-shrink-0">
                      {item.service?.image_url ? (
                        <img
                          src={item.service.image_url}
                          alt={item.service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.service?.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.service?.description}
                      </p>
                      <p className="font-display font-bold text-primary text-lg">
                        ₹{item.service?.price}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Checkout Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Items</span>
                    <span>{selectedItems.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{selectedTotal}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'upi', label: 'UPI Payment' },
                      { id: 'qr', label: 'Scan QR Code' },
                      { id: 'netbanking', label: 'Net Banking' }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground'
                          }`}
                        >
                          {paymentMethod === method.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="gold"
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0 || checkingOut}
                >
                  {checkingOut ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {checkingOut ? 'Processing...' : `Pay ₹${selectedTotal}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
