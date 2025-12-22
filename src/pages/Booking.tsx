import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { ArrowLeft, MapPin, Phone, CalendarDays, Clock, Link2, CheckCircle, Loader2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM'
];

const jabalpurPlaces = [
  'Vijay Nagar',
  'Damoh Naka',
  'Bilehri',
  'Napier Town',
  'Civil Lines',
  'Gwarighat',
  'Adhartal',
  'Madan Mahal',
  'Wright Town',
  'Garha',
  'Tilwara',
  'Katanga',
  'Ranjhi',
  'Gorakhpur',
  'Shakti Nagar',
  'Khamaria',
  'Jabalpur Cantt',
  'Gol Bazar',
  'Sadar',
  'Russel Chowk'
];

interface Service {
  id: string;
  name: string;
  price: number;
}

interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service') || '';
  const [state, handleSubmit] = useForm("xjknnzow");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [formData, setFormData] = useState({
    houseNumber: '',
    streetArea: '',
    place: '',
    pincode: '',
    phone1: '',
    phone2: '',
    mapLink: '',
  });

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price')
        .eq('is_active', true);

      if (!error && data) {
        setServices(data);
        
        // Pre-select service if provided in URL
        if (preSelectedService) {
          const service = data.find(s => s.name === preSelectedService);
          if (service) {
            setSelectedServices([{ ...service, quantity: 1 }]);
          }
        }
      }
    };

    fetchServices();
  }, [preSelectedService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.id === service.id);
      if (existing) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    setSelectedServices(prev => 
      prev.map(s => {
        if (s.id === serviceId) {
          const newQuantity = Math.max(1, s.quantity + delta);
          return { ...s, quantity: newQuantity };
        }
        return s;
      })
    );
  };

  const totalAmount = selectedServices.reduce((sum, s) => sum + (s.price * s.quantity), 0);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formElement = e.currentTarget;
    const formDataToSubmit = new FormData(formElement);
    
    if (date) {
      formDataToSubmit.set('pickup_date', format(date, 'PPP'));
    }
    if (time) {
      formDataToSubmit.set('pickup_time', time);
    }
    
    // Add services info
    const servicesText = selectedServices.map(s => `${s.name} x${s.quantity} = ₹${s.price * s.quantity}`).join(', ');
    formDataToSubmit.set('services', servicesText);
    formDataToSubmit.set('total_amount', `₹${totalAmount}`);
    formDataToSubmit.set('place', formData.place);
    
    await handleSubmit(formDataToSubmit);
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
          <Button variant="gold" onClick={() => navigate('/home')} className="w-full">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
            >
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
            
            {/* Service Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Select Services</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Choose one or more services. You can select Pant + Shirt together or any combination.
              </p>

              <div className="grid gap-3">
                {services.map((service) => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  const selectedItem = selectedServices.find(s => s.id === service.id);
                  
                  return (
                    <div 
                      key={service.id}
                      className={cn(
                        "border rounded-xl p-4 transition-all cursor-pointer",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}
                      onClick={() => toggleService(service)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleService(service)}
                          />
                          <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-primary font-medium">₹{service.price} per item</p>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(service.id, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{selectedItem?.quantity || 1}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(service.id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Amount Display */}
              {selectedServices.length > 0 && (
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Selected Items:</span>
                    <span className="text-sm">{selectedServices.reduce((sum, s) => sum + s.quantity, 0)} items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Address Section */}
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
                    <Label>Place (Jabalpur Area) *</Label>
                    <Select 
                      value={formData.place} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, place: value }))}
                      required
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {jabalpurPlaces.map((place) => (
                          <SelectItem key={place} value={place}>
                            {place}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            {/* Phone Numbers Section */}
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

            {/* Date & Time Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Pickup Date & Time</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1.5",
                          !date && "text-muted-foreground"
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
                        onSelect={setDate}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Select Time *</Label>
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Map Link Section (Optional) */}
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
                <p className="text-xs text-muted-foreground mt-1">
                  Share your exact location for faster pickup
                </p>
              </div>
            </div>

            {/* Final Total & Submit */}
            {selectedServices.length > 0 && (
              <div className="bg-card border border-primary rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Services:</span>
                  <span className="text-sm">{selectedServices.map(s => `${s.name} x${s.quantity}`).join(', ')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-bold text-lg">Total Payable:</span>
                  <span className="text-3xl font-bold text-primary">₹{totalAmount}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={state.submitting || !date || !time || selectedServices.length === 0 || !formData.place}
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
