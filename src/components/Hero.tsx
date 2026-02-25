import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Clock, ChevronRight, Phone, MessageCircle, ChevronDown, ChevronUp, MapPin, Timer, Car, User, Users, Package } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroTailor from "@/assets/hero-tailor.jpg";
import { serviceCategories, ServiceItem } from "@/data/services";

const trustBadges = [
  { icon: Shield, label: "Verified Tailors" },
  { icon: Sparkles, label: "Hygiene Safe" },
  { icon: Clock, label: "48hr Delivery" },
];

export const Hero = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Get categories from service data
  const currentGenderServices = serviceCategories.find(cat => cat.id === selectedGender);
  const categories = currentGenderServices?.subcategories || [];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleQuickBook = () => {
    if (selectedServices.length > 0) {
      navigate(`/booking?services=${encodeURIComponent(selectedServices.join(','))}`);
    } else {
      navigate('/booking');
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleBookPickup = () => {
    if (selectedServices.length > 0) {
      navigate(`/booking?services=${encodeURIComponent(selectedServices.join(','))}`);
    } else {
      navigate('/booking');
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:+919407826370';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919407826370?text=Hi, I need alteration services in Jabalpur', '_blank');
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    setSelectedCategory(null);
    setSelectedGarment(null);
    setSelectedServices([]);
    setExpandedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedGarment(null);
    setExpandedCategory(expandedCategory === category ? null : category);
    setSelectedServices([]);
  };

  const handleGarmentSelect = (serviceId: string) => {
    setSelectedGarment(serviceId);
    setSelectedServices([]);
  };

  const getCurrentOptions = () => {
    if (!selectedGarment || !currentGenderServices) return [];

    // Find the service by ID
    let selectedService: ServiceItem | null = null;
    for (const subcategory of currentGenderServices.subcategories) {
      const service = subcategory.items.find(item => item.id === selectedGarment);
      if (service) {
        selectedService = service;
        break;
      }
    }

    if (!selectedService || !selectedService.variants) return [];

    return selectedService.variants.map(variant => ({
      label: `${variant.name} - ₹${variant.price}`,
      value: `${selectedService.id}-${variant.name}`
    }));
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Jabalpur's Trusted Cloth Fitting & Alteration Service</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Perfect fit,{" "}
              </motion.span>
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-gradient-gold inline-block"
              >
                every time
              </motion.span>
              <br />
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-muted-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal tracking-wide"
              >
                — we come to you.
              </motion.span>
            </motion.h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto lg:mx-0">
              Door-to-door pickup & delivery in Jabalpur. Pant hems, shirt fitting, kurti, blazer & ethnic wear alterations by expert tailors.
            </p>

            <p className="text-sm text-primary font-medium mb-8 max-w-xl mx-auto lg:mx-0 flex items-center justify-center lg:justify-start gap-4 flex-wrap">
              <span className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                <Car className="w-4 h-4" />
                <strong>FREE</strong> Pickup & Delivery
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Serving Jabalpur
              </span>
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                24-48 hrs turnaround
              </span>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="gold" size="xl" className="group relative overflow-hidden" onClick={handleBookPickup}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  Book Pickup
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Call & WhatsApp Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleCall}
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWhatsApp}
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <badge.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Image & Booking Widget */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Hero Image Background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <motion.img
                src={heroTailor}
                alt="Professional tailor at work"
                className="w-full h-full object-cover opacity-20"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="600"
                height="800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/50 to-card/30" />
            </div>

            <div className="relative mx-auto max-w-md z-10">
              {/* Phone Frame */}
              <div className="relative bg-gradient-card rounded-3xl p-1 shadow-lift gold-border">
                <div className="bg-card rounded-[22px] p-6 space-y-5">
                  {/* Widget Header */}
                  <div className="text-center">
                    <h3 className="font-display text-xl font-semibold mb-1">Quick Book</h3>
                    <p className="text-sm text-muted-foreground">Select garments & book pickup</p>
                  </div>

                  {/* Gender Selection */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleGenderSelect('male')}
                      className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${selectedGender === 'male'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-foreground hover:bg-muted/80 hover:text-foreground'
                        }`}
                    >
                      <User className="w-5 h-5" />
                      <span>Male</span>
                    </button>
                    <button
                      onClick={() => handleGenderSelect('female')}
                      className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${selectedGender === 'female'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-foreground hover:bg-muted/80 hover:text-foreground'
                        }`}
                    >
                      <Users className="w-5 h-5" />
                      <span>Female</span>
                    </button>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Select Category:</p>
                    <div className="space-y-2">
                      {categories.map((subcategory) => (
                        <div key={subcategory.name} className="space-y-2">
                          <button
                            onClick={() => handleCategorySelect(subcategory.name)}
                            className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-between ${selectedCategory === subcategory.name
                              ? 'bg-primary/10 border border-primary/30 text-foreground'
                              : 'bg-muted text-foreground hover:bg-muted/80 hover:text-foreground'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <Package className="w-5 h-5 text-foreground" />
                              <span className="text-sm font-semibold text-foreground">{subcategory.name}</span>
                            </div>
                            {expandedCategory === subcategory.name ? (
                              <ChevronUp className="w-4 h-4 text-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-foreground" />
                            )}
                          </button>

                          {/* Garment Options (Expanded) */}
                          {expandedCategory === subcategory.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-8 pr-2 space-y-2"
                            >
                              {subcategory.items.map((service) => (
                                <button
                                  key={service.id}
                                  onClick={() => handleGarmentSelect(service.id)}
                                  className={`w-full py-2 px-3 rounded text-left text-sm transition-all ${selectedGarment === service.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                  {service.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specific Alterations */}
                  {selectedGarment && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-sm font-medium text-foreground">Select Alterations:</p>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {getCurrentOptions().map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedServices.includes(option.value)}
                                onChange={() => handleServiceToggle(option.value)}
                                className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                              />
                              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {option.label}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {selectedServices.length > 0 && (
                    <div className="text-xs text-primary text-center">
                      {selectedServices.length} alteration{selectedServices.length > 1 ? 's' : ''} selected
                    </div>
                  )}

                  <Button
                    variant="gold"
                    className="w-full"
                    size="lg"
                    onClick={handleQuickBook}
                    disabled={selectedServices.length === 0}
                  >
                    {selectedServices.length === 0 ? "Select Alterations" : `Book ${selectedServices.length} Alteration${selectedServices.length > 1 ? 's' : ''}`}
                  </Button>

                  {/* ETA Preview */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Estimated pickup</span>
                    <span className="text-sm text-primary font-medium">Within 2 hours</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-primary/20 backdrop-blur-sm rounded-xl p-3 gold-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-foreground">Serving Jabalpur</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-card rounded-xl p-3 gold-border shadow-card"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground">24-48 hrs delivery</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};