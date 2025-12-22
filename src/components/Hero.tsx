import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Clock, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroTailor from "@/assets/hero-tailor.jpg";

const trustBadges = [
  { icon: Shield, label: "Verified Tailors" },
  { icon: Sparkles, label: "Hygiene Safe" },
  { icon: Clock, label: "48hr Delivery" },
];

const serviceOptions = [
  { label: "Select Garment Type", value: "" },
  { label: "Pant Alteration", value: "Pant Alteration" },
  { label: "Shirt Alteration", value: "Shirt Alteration" },
  { label: "Kurti Alteration", value: "Kurti Alteration" },
  { label: "Blazer Alteration", value: "Blazer Alteration" },
  { label: "Dress Alteration", value: "Dress Alteration" },
  { label: "Ethnic Jacket Alteration", value: "Ethnic Jacket Alteration" },
];

export const Hero = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleQuickBook = () => {
    if (selectedService) {
      navigate(`/booking?service=${encodeURIComponent(selectedService)}`);
    } else {
      navigate('/booking');
    }
  };

  const handleBookPickup = () => {
    navigate('/booking');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919407826370';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919407826370?text=Hi, I need alteration services in Jabalpur', '_blank');
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Enhanced Background Elements */}
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
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className={`absolute w-2 h-2 bg-primary/30 rounded-full`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}
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
              <span className="text-sm text-primary font-medium">Jabalpur's Trusted Alteration Service</span>
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
              >
                — we come to you.
              </motion.span>
            </motion.h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto lg:mx-0">
              Door-to-door pickup & delivery in Jabalpur. Pant hems, shirt fitting, kurti, blazer & ethnic wear alterations by expert tailors.
            </p>

            <p className="text-sm text-primary font-medium mb-8 max-w-xl mx-auto lg:mx-0">
              📍 Serving all areas in Jabalpur • ⏱️ 24-48 hours delivery • 🚗 Free pickup & delivery
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
                    <p className="text-sm text-muted-foreground">Select your garment & book pickup</p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <Button variant="gold" className="w-full" size="lg" onClick={handleQuickBook}>
                      Book Pickup Now
                    </Button>
                  </div>

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
