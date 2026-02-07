import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CalendarDays,
  Clock,
  Link2,
  CheckCircle,
  Loader2,
  Plus,
  Minus,
  ShoppingCart,
  Download,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import SEO from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { serviceCategories, ServiceItem, ServiceVariant, getMinPrice } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const allTimeSlots = [
  { time: "09:00 AM", hour: 9, minute: 0 },
  { time: "09:30 AM", hour: 9, minute: 30 },
  { time: "10:00 AM", hour: 10, minute: 0 },
  { time: "10:30 AM", hour: 10, minute: 30 },
  { time: "11:00 AM", hour: 11, minute: 0 },
  { time: "11:30 AM", hour: 11, minute: 30 },
  { time: "12:00 PM", hour: 12, minute: 0 },
  { time: "12:30 PM", hour: 12, minute: 30 },
  { time: "01:00 PM", hour: 13, minute: 0 },
  { time: "01:30 PM", hour: 13, minute: 30 },
  { time: "02:00 PM", hour: 14, minute: 0 },
  { time: "02:30 PM", hour: 14, minute: 30 },
  { time: "03:00 PM", hour: 15, minute: 0 },
  { time: "03:30 PM", hour: 15, minute: 30 },
  { time: "04:00 PM", hour: 16, minute: 0 },
  { time: "04:30 PM", hour: 16, minute: 30 },
  { time: "05:00 PM", hour: 17, minute: 0 },
  { time: "05:30 PM", hour: 17, minute: 30 },
  { time: "06:00 PM", hour: 18, minute: 0 },
  { time: "06:30 PM", hour: 18, minute: 30 },
  { time: "07:00 PM", hour: 19, minute: 0 },
];

// Helper to get available time slots based on selected date
const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
  if (!selectedDate) return allTimeSlots.map(s => s.time);
  
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDay = new Date(selectedDate);
  selectedDay.setHours(0, 0, 0, 0);
  
  // If not today, all slots available
  if (selectedDay.getTime() !== today.getTime()) {
    return allTimeSlots.map(s => s.time);
  }
  
  // For today, only show slots at least 1 hour from now
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const minSlotHour = currentHour + 1; // At least 1 hour gap
  
  return allTimeSlots
    .filter(slot => {
      if (slot.hour > minSlotHour) return true;
      if (slot.hour === minSlotHour && slot.minute >= currentMinute) return true;
      return false;
    })
    .map(s => s.time);
};

const jabalpurPlaces = [
  "Vijay Nagar",
  "Damoh Naka",
  "Bilehri",
  "Napier Town",
  "Civil Lines",
  "Gwarighat",
  "Adhartal",
  "Madan Mahal",
  "Wright Town",
  "Garha",
  "Tilwara",
  "Katanga",
  "Ranjhi",
  "Gorakhpur",
  "Shakti Nagar",
  "Khamaria",
  "Jabalpur Cantt",
  "Gol Bazar",
  "Sadar",
  "Russel Chowk",
];

interface Service {
  id: string;
  name: string;
  price: number;
  category?: string;
  subcategory?: string;
  variants?: ServiceVariant[];
}

interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: ServiceVariant;
  customDescription?: string; // For custom alteration services
}

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get("service") || "";
  const preSelectedServices = searchParams.get("services") || "";
  
  const { user, isAuthenticated, descopeUser, isDescopeAuth } = useAuth();

  const { items: cartItems, updateQuantity: updateCartQuantity, removeFromCart, clearCart, totalAmount: cartTotal } = useCart();

  const [state, handleSubmit] = useForm("xjknnzow");
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    'male': true, // Open male category by default
    'female': true // Open female category by default
  });
  const [expandedSubcategories, setExpandedSubcategories] = useState<{[key: string]: boolean}>({});
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    houseNumber: "",
    streetArea: "",
    place: "",
    pincode: "",
    phone1: "",
    phone2: "",
    mapLink: "",
  });

  // Autofill form with saved profile data for returning customers
  useEffect(() => {
    const loadProfileData = async () => {
      if (profileLoaded) return;
      
      let userId: string | null = null;
      
      // Get user ID from either Supabase auth or Descope
      if (user?.id) {
        userId = user.id;
      } else if (isDescopeAuth && descopeUser?.userId) {
        userId = `descope_${descopeUser.userId}`;
      }
      
      if (!userId) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            customerName: profile.full_name || prev.customerName,
            phone1: profile.phone || prev.phone1,
            streetArea: profile.address || prev.streetArea,
            place: profile.city || prev.place,
            pincode: profile.pincode || prev.pincode,
          }));
        }
        
        setProfileLoaded(true);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    
    loadProfileData();
  }, [user, isDescopeAuth, descopeUser, profileLoaded]);

  // Initialize with cart items on mount
  useEffect(() => {
    if (!hasInitialized && cartItems.length > 0) {
      const cartServices: SelectedService[] = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      setSelectedServices(cartServices);
      setHasInitialized(true);
    }
  }, [cartItems, hasInitialized]);

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      // Get all services from the comprehensive service data
      const allServices: ServiceItem[] = [];
      serviceCategories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          allServices.push(...subcategory.items);
        });
      });

      if (cancelled) return;
      setServices(allServices);

      // Pre-select services if provided in URL (only if user hasn't selected anything yet and no cart items)
      if (selectedServices.length === 0 && cartItems.length === 0) {
        const servicesToPreselect: SelectedService[] = [];

        // Handle multiple services from Hero component (services parameter)
        if (preSelectedServices) {
          const serviceNames = preSelectedServices.split(',').map(name => name.trim());
          serviceNames.forEach(serviceName => {
            const service = allServices.find((s) => s.name === serviceName);
            if (service) {
              servicesToPreselect.push({ 
                id: service.id, 
                name: service.name, 
                price: getMinPrice(service), 
                quantity: 1 
              });
            }
          });
        }
        // Handle single service (service parameter) - for backward compatibility
        else if (preSelectedService) {
          const service = allServices.find((s) => s.name === preSelectedService);
          if (service) {
            servicesToPreselect.push({ 
              id: service.id, 
              name: service.name, 
              price: getMinPrice(service), 
              quantity: 1 
            });
          }
        }

        if (servicesToPreselect.length > 0) {
          setSelectedServices(servicesToPreselect);
        }
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedService, preSelectedServices]);

  const totalAmount = useMemo(
    () => selectedServices.reduce((sum, s) => {
      // Exclude custom alteration services from total (price will be determined by call)
      if (s.id === 'custom-alteration') return sum;
      return sum + s.price * s.quantity;
    }, 0),
    [selectedServices],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: ServiceItem, variant?: ServiceVariant) => {
    setSelectedServices((prev) => {
      // Check if already selected with same variant - if so, remove
      const existingWithSameVariant = prev.find(
        (s) => s.id === service.id && s.selectedVariant?.name === variant?.name
      );
      if (existingWithSameVariant) {
        return prev.filter((s) => !(s.id === service.id && s.selectedVariant?.name === variant?.name));
      }
      
      // Remove any existing variants of this service first
      let newList = prev.filter((s) => s.id !== service.id);
      
      // Handle mutual exclusivity for fitting options
      // If selecting "Full Fitting", uncheck "Length", "Waist", "Length + Waist" variants
      // If selecting "Length", "Waist", or "Length + Waist", uncheck "Full Fitting"
      if (variant) {
        const variantName = variant.name.toLowerCase();
        const isFullFitting = variantName.includes('full fitting');
        const isLengthOrWaist = variantName.includes('length') || variantName.includes('waist');
        
        if (isFullFitting || isLengthOrWaist) {
          // Remove conflicting variants from the same service
          newList = newList.filter((s) => {
            if (s.id !== service.id) return true;
            const selVariant = s.selectedVariant?.name?.toLowerCase() || '';
            if (isFullFitting) {
              // Remove length/waist variants
              return !(selVariant.includes('length') || selVariant.includes('waist'));
            } else {
              // Remove full fitting variant
              return !selVariant.includes('full fitting');
            }
          });
        }
      }
      
      const price = variant ? variant.price : getMinPrice(service);
      return [...newList, { 
        id: service.id, 
        name: service.name, 
        price, 
        quantity: 1,
        selectedVariant: variant,
        customDescription: service.id === 'custom-alteration' ? '' : undefined
      }];
    });
  };

  const updateCustomDescription = (serviceId: string, description: string) => {
    setSelectedServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        return { ...s, customDescription: description };
      })
    );
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategoryExpansion = (subcategoryKey: string) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryKey]: !prev[subcategoryKey]
    }));
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    setSelectedServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        return { ...s, quantity: Math.max(1, s.quantity + delta) };
      }),
    );
  };

  const removeService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    removeFromCart(serviceId);
  };

  const generateInvoicePDF = useCallback(() => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(139, 92, 42); // Primary gold color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Mister Finisher", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Jabalpur's Trusted Alteration Service", pageWidth / 2, 30, { align: "center" });
    
    // Invoice title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING INVOICE", pageWidth / 2, 55, { align: "center" });
    
    // Order number and date
    const orderNumber = `MRF-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${orderNumber}`, 20, 65);
    doc.text(`Date: ${format(new Date(), "PPP")}`, pageWidth - 20, 65, { align: "right" });
    
    // Divider
    doc.setDrawColor(139, 92, 42);
    doc.setLineWidth(0.5);
    doc.line(20, 70, pageWidth - 20, 70);
    
    let yPos = 85;
    
    // Customer Information Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 42);
    doc.text("CUSTOMER INFORMATION", 20, yPos);
    yPos += 8;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${formData.customerName}`, 20, yPos);
    yPos += 12;
    
    // Pickup Address Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 42);
    doc.text("PICKUP ADDRESS", 20, yPos);
    yPos += 8;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`House/Flat: ${formData.houseNumber}`, 20, yPos);
    yPos += 6;
    doc.text(`Street/Area: ${formData.streetArea}`, 20, yPos);
    yPos += 6;
    doc.text(`Place: ${formData.place}`, 20, yPos);
    yPos += 6;
    doc.text(`Pincode: ${formData.pincode}`, 20, yPos);
    yPos += 12;
    
    // Contact Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 42);
    doc.text("CONTACT DETAILS", 20, yPos);
    yPos += 8;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Primary Phone: ${formData.phone1}`, 20, yPos);
    yPos += 6;
    if (formData.phone2) {
      doc.text(`Alternate Phone: ${formData.phone2}`, 20, yPos);
      yPos += 6;
    }
    if (formData.mapLink) {
      doc.text(`Map Link: ${formData.mapLink}`, 20, yPos);
      yPos += 6;
    }
    yPos += 6;
    
    // Pickup Schedule
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 42);
    doc.text("PICKUP SCHEDULE", 20, yPos);
    yPos += 8;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date ? format(date, "PPP") : "Not selected"}`, 20, yPos);
    yPos += 6;
    doc.text(`Time: ${time || "Not selected"}`, 20, yPos);
    yPos += 15;
    
    // Services Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 42);
    doc.text("SELECTED SERVICES", 20, yPos);
    yPos += 10;
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Service", 25, yPos);
    doc.text("Qty", 110, yPos);
    doc.text("Price", 135, yPos);
    doc.text("Total", 165, yPos);
    yPos += 10;
    
    // Table Rows
    doc.setFont("helvetica", "normal");
    selectedServices.forEach((service) => {
      const lineTotal = service.price * service.quantity;
      const serviceName = service.selectedVariant 
        ? `${service.name} (${service.selectedVariant.name})`
        : service.name;
      doc.text(serviceName, 25, yPos);
      doc.text(service.quantity.toString(), 110, yPos);
      doc.text(`₹${service.price}`, 135, yPos);
      doc.text(`₹${lineTotal}`, 165, yPos);
      yPos += 8;
    });
    
    // Divider before total
    yPos += 5;
    doc.setDrawColor(139, 92, 42);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
    
    // Total Amount
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL AMOUNT:", 25, yPos);
    doc.setTextColor(139, 92, 42);
    doc.text(`₹${totalAmount}`, 165, yPos);
    yPos += 20;
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing Mister Finisher!", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text("We will contact you shortly to confirm your pickup.", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text("For queries, call: +91 98765 43210", pageWidth / 2, yPos, { align: "center" });
    
    // Save PDF
    doc.save(`MisterFinisher-Invoice-${orderNumber}.pdf`);
  }, [formData, date, time, selectedServices, totalAmount]);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate custom alteration descriptions
    const customServices = selectedServices.filter(s => s.id === 'custom-alteration');
    const missingDescriptions = customServices.filter(s => !s.customDescription?.trim());
    
    if (missingDescriptions.length > 0) {
      alert('Please provide description for custom alteration services.');
      return;
    }

    const formElement = e.currentTarget;
    const formDataToSubmit = new FormData(formElement);

    if (date) formDataToSubmit.set("pickup_date", format(date, "PPP"));
    if (time) formDataToSubmit.set("pickup_time", time);

    // Add services info
    const servicesText = selectedServices
      .map((s) => {
        const serviceName = s.selectedVariant 
          ? `${s.name} (${s.selectedVariant.name})`
          : s.name;
        
        let serviceInfo = '';
        if (s.id === 'custom-alteration') {
          serviceInfo = `${serviceName} - Price on call\nCustomer Requirements: ${s.customDescription || 'Not specified'}`;
        } else {
          serviceInfo = `${serviceName} (Qty: ${s.quantity}) - ₹${s.price * s.quantity}`;
        }
        
        return serviceInfo;
      })
      .join("\n\n");
    
    formDataToSubmit.set("services_details", servicesText);
    
    // Add custom descriptions separately for backend processing
    if (customServices.length > 0) {
      const customDescriptions = customServices
        .map(s => `Custom Alteration: ${s.customDescription || 'No description provided'}`)
        .join('\n');
      formDataToSubmit.set("custom_alteration_details", customDescriptions);
    }
    formDataToSubmit.set("total_items_count", selectedServices.reduce((acc, curr) => acc + curr.quantity, 0).toString());
    formDataToSubmit.set("total_amount", `₹${totalAmount}`);
    formDataToSubmit.set("place", formData.place);
    formDataToSubmit.set("customer_name", formData.customerName);

    await handleSubmit(formDataToSubmit);
    
    // Clear cart on successful submission
    if (!state.errors) {
      clearCart();
    }
  };

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-card border border-border rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-4">
            Thank you for your booking. We'll contact you shortly to confirm your pickup.
          </p>
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={generateInvoicePDF}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice (PDF)
            </Button>
            <Button variant="gold" onClick={() => navigate("/home")} className="w-full">
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Book Pickup"
        description="Schedule a free pickup for your clothing alterations. Select services, choose pickup time, and we'll collect from your doorstep in Jabalpur."
        keywords="book alteration, schedule pickup, free pickup, clothing alterations Jabalpur"
        canonicalUrl="/booking"
        ogType="service"
      />
      {/* Header */}
      <div className="bg-gradient-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-xl font-bold">Book Pickup</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-card border border-border rounded-2xl p-6 md:p-8"
        >
          <form onSubmit={onFormSubmit} className="space-y-6">
            {/* Cart Items Section */}
            {selectedServices.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-lg">Your Selected Services</h3>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {selectedServices.reduce((sum, s) => sum + s.quantity, 0)} items
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedServices.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{service.name}</p>
                            {service.selectedVariant && (
                              <p className="text-xs text-muted-foreground">
                                {service.selectedVariant.name}
                              </p>
                            )}
                            <p className="text-sm text-primary font-medium">
                              {service.id === 'custom-alteration' ? 'Price on call' : `₹${service.price} each`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {service.id !== 'custom-alteration' && (
                            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(service.id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold text-sm">{service.quantity}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(service.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeService(service.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Custom description field for custom alteration service */}
                      {service.id === 'custom-alteration' && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <Label htmlFor={`custom-desc-${service.id}`} className="text-xs font-medium text-muted-foreground">
                            Describe your alteration requirements *
                          </Label>
                          <Textarea
                            id={`custom-desc-${service.id}`}
                            placeholder="e.g., Uniform fitting, special garment alterations, etc. Please provide detailed requirements..."
                            value={service.customDescription || ''}
                            onChange={(e) => updateCustomDescription(service.id, e.target.value)}
                            className="mt-1 min-h-[80px] text-sm"
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Our team will call you to discuss pricing and timeline based on your requirements.
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-primary">
                          {service.id === 'custom-alteration' ? 'Price on call' : `₹${service.price * service.quantity}`}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                  </div>
                  {selectedServices.some(s => s.id === 'custom-alteration') && (
                    <p className="text-xs text-muted-foreground mt-2">
                      * Custom alteration pricing will be discussed over call
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Add More Services */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Add More Services</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Choose from our comprehensive alteration services. Select categories to explore options.
              </p>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {serviceCategories.map((category) => (
                  <div key={category.id} className="border border-border rounded-xl overflow-hidden">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-card/50 cursor-pointer hover:bg-card/70 transition-colors"
                      onClick={() => toggleCategoryExpansion(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <h4 className="font-semibold text-lg">{category.name}</h4>
                      </div>
                      {expandedCategories[category.id] ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Category Content */}
                    {expandedCategories[category.id] && (
                      <div className="border-t border-border">
                        {category.subcategories.map((subcategory) => {
                          const subcategoryKey = `${category.id}-${subcategory.name}`;
                          return (
                            <div key={subcategoryKey} className="border-b border-border last:border-b-0">
                              {/* Subcategory Header */}
                              <div
                                className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => toggleSubcategoryExpansion(subcategoryKey)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{subcategory.icon}</span>
                                  <h5 className="font-medium">{subcategory.name}</h5>
                                  <span className="text-xs text-muted-foreground">
                                    ({subcategory.items.length} items)
                                  </span>
                                </div>
                                {expandedSubcategories[subcategoryKey] ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>

                              {/* Services in Subcategory */}
                              {expandedSubcategories[subcategoryKey] && (
                                <div className="p-3 space-y-3">
                                  {subcategory.items
                                    .filter(service => !selectedServices.some(sel => sel.id === service.id))
                                    .map((service) => (
                                      <div
                                        key={service.id}
                                        className="border border-border rounded-lg p-3 hover:border-primary/50 transition-all"
                                      >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                          <div className="min-w-0 flex-1">
                                            <p className="font-semibold truncate">{service.name}</p>
                                            <p className="text-xs text-muted-foreground mb-1">{service.description}</p>
                                            <p className="text-xs text-muted-foreground">⏱️ {service.time}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-medium text-primary">
                                              {service.variants && service.variants.length > 0 
                                                ? `From ₹${getMinPrice(service)}`
                                                : `₹${service.price}`
                                              }
                                            </p>
                                          </div>
                                        </div>

                                        {/* Service Variants */}
                                        {service.variants && service.variants.length > 0 ? (
                                          <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground">Choose alteration type:</p>
                                            <div className="grid gap-2">
                                              {service.variants.map((variant) => (
                                                <Button
                                                  key={variant.name}
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  className="justify-between h-auto p-2"
                                                  onClick={() => toggleService(service, variant)}
                                                >
                                                  <span className="text-xs">{variant.name}</span>
                                                  <span className="text-xs font-semibold text-primary">₹{variant.price}</span>
                                                </Button>
                                              ))}
                                            </div>
                                          </div>
                                        ) : (
                                          <Button
                                            type="button"
                                            variant="goldOutline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => toggleService(service)}
                                          >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add Service - ₹{service.price}
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Customer Information</h3>
              </div>

              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Enter your full name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="mt-1.5"
                />
                <ValidationError prefix="Customer Name" field="customerName" errors={state.errors} />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Pickup Address</h3>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="houseNumber">House / Flat Number *</Label>
                  <Input
                    id="houseNumber"
                    name="houseNumber"
                    placeholder="e.g., 42-A, Flat 301"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    required
                    className="mt-1.5"
                  />
                  <ValidationError prefix="House Number" field="houseNumber" errors={state.errors} />
                </div>

                <div>
                  <Label htmlFor="streetArea">Street / Area / Colony *</Label>
                  <Textarea
                    id="streetArea"
                    name="streetArea"
                    placeholder="e.g., Near XYZ Hospital, ABC Colony"
                    value={formData.streetArea}
                    onChange={handleInputChange}
                    required
                    className="mt-1.5 min-h-[80px]"
                  />
                  <ValidationError prefix="Street/Area" field="streetArea" errors={state.errors} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="place">Place (Jabalpur Area) *</Label>
                    <select
                      id="place"
                      name="place"
                      value={formData.place}
                      onChange={(e) => setFormData((prev) => ({ ...prev, place: e.target.value }))}
                      required
                      className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="" disabled>
                        Select area
                      </option>
                      {jabalpurPlaces.map((place) => (
                        <option key={place} value={place}>
                          {place}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="e.g., 482001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="mt-1.5"
                    />
                    <ValidationError prefix="Pincode" field="pincode" errors={state.errors} />
                  </div>
                </div>
              </div>
            </div>

            {/* Phones */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Contact Numbers</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone1">Primary Phone *</Label>
                  <Input
                    id="phone1"
                    name="phone1"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    required
                    className="mt-1.5"
                  />
                  <ValidationError prefix="Primary Phone" field="phone1" errors={state.errors} />
                </div>

                <div>
                  <Label htmlFor="phone2">Alternate Phone (Optional)</Label>
                  <Input
                    id="phone2"
                    name="phone2"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                  <ValidationError prefix="Alternate Phone" field="phone2" errors={state.errors} />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Pickup Date & Time</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Date *</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1.5",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(d) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return d < today;
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Select Time *</Label>
                  <select
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="" disabled>
                      Select time slot
                    </option>
                    {getAvailableTimeSlots(date).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {date && new Date(date).toDateString() === new Date().toDateString() 
                      ? "Same-day slots available (1hr minimum from now)"
                      : "Choose a convenient pickup time"}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Link */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Share Location (Optional)</h3>
              </div>

              <div>
                <Label htmlFor="mapLink">Google Maps Link</Label>
                <Input
                  id="mapLink"
                  name="mapLink"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">Share your exact location for faster pickup</p>
              </div>
            </div>

            {/* Final Total */}
            {selectedServices.length > 0 && (
              <div className="bg-card border border-primary rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Services:</span>
                  <span className="text-sm">
                    {selectedServices.map((s) => {
                      const serviceName = s.selectedVariant 
                        ? `${s.name} (${s.selectedVariant.name})`
                        : s.name;
                      return `${serviceName} x${s.quantity}`;
                    }).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-bold text-lg">Total Payable:</span>
                  <span className="text-3xl font-bold text-primary">₹{totalAmount}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={state.submitting || !date || !time || selectedServices.length === 0 || !formData.place || !formData.customerName}
            >
              {state.submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Confirm Pickup - ₹{totalAmount}</>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
