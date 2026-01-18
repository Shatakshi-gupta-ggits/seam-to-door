import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
interface OrderItem {
  id: string;
  service_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  pickup_address: string;
  pickup_date: string;
  expected_delivery: string;
  delivered_at: string | null;
  created_at: string;
  invoice_url: string | null;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-500', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/20 text-blue-500', icon: CheckCircle },
  pickup_scheduled: { label: 'Pickup Scheduled', color: 'bg-purple-500/20 text-purple-500', icon: MapPin },
  picked_up: { label: 'Picked Up', color: 'bg-indigo-500/20 text-indigo-500', icon: Package },
  in_progress: { label: 'In Progress', color: 'bg-orange-500/20 text-orange-500', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/20 text-cyan-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-500', icon: Clock },
};

const Bookings = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Supabase calls removed - database no longer in use
    setLoading(false);
  };

  const handleFasterDelivery = (orderId: string, orderNumber: string) => {
    toast.success(`Express delivery requested for ${orderNumber}! Additional ₹50 will be added.`, {
      description: 'Our team will contact you shortly to confirm.'
    });
  };

  const getStatusSteps = (status: string) => {
    const allSteps = ['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'in_progress', 'shipped', 'delivered'];
    const currentIndex = allSteps.indexOf(status);
    return allSteps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="My Bookings"
        description="Track your alteration orders with Mister Finisher. View order status, expected delivery, and request faster delivery."
        keywords="order tracking, alteration status, booking history, Jabalpur tailoring"
        canonicalUrl="/bookings"
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
            <h1 className="font-display text-2xl font-bold">My Bookings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by booking your first alteration service
            </p>
            <Button variant="gold" onClick={() => navigate('/home')}>
              Explore Services
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedOrder === order.id;
              const steps = getStatusSteps(order.status);
              const canRequestFaster = ['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'in_progress'].includes(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-card border border-border rounded-2xl overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Booking</p>
                        <p className="font-display font-semibold text-lg">{order.order_number}</p>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Booking Date</p>
                        <p className="font-medium">
                          {format(new Date(order.created_at), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Items</p>
                        <p className="font-medium">{order.order_items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium text-primary">₹{order.total_amount}</p>
                      </div>
                      {order.expected_delivery && (
                        <div>
                          <p className="text-muted-foreground">Expected Delivery</p>
                          <p className="font-medium">
                            {format(new Date(order.expected_delivery), 'dd MMM yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      {/* Tracking Progress */}
                      <div className="p-6 bg-card/50">
                        <h4 className="font-semibold mb-4">Booking Tracking</h4>
                        <div className="flex items-center justify-between relative">
                          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                          {steps.slice(0, 5).map((step, idx) => {
                            const stepInfo = statusConfig[step.step];
                            return (
                              <div key={step.step} className="relative z-10 flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step.completed
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-border text-muted-foreground'
                                  }`}
                                >
                                  {step.completed ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <span className="text-xs">{idx + 1}</span>
                                  )}
                                </div>
                                <span className="text-xs mt-2 text-center max-w-[60px]">
                                  {stepInfo?.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <h4 className="font-semibold mb-4">Items</h4>
                        <div className="space-y-3">
                          {order.order_items?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                              <div>
                                <p className="font-medium">{item.service_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold">₹{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Faster Delivery Button */}
                      {canRequestFaster && (
                        <div className="p-6 border-t border-border">
                          <Button 
                            variant="gold" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFasterDelivery(order.id, order.order_number);
                            }}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Get Faster Delivery (+₹50)
                          </Button>
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            Priority processing for quick turnaround
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
