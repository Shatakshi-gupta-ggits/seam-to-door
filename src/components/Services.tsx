import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serviceCategories, ServiceItem, ServiceCategory } from "@/data/services";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState<string>("male");
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentCategory = serviceCategories.find(c => c.id === selectedCategory);

  const handleBookNow = (serviceName: string) => {
    navigate(`/booking?service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <section ref={ref} id="services" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Expert Alterations for{" "}
            <span className="text-gradient-gold">Every Garment</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            Professional doorstep tailoring & alteration service in Jabalpur. 
            We provide pickup and delivery for men, women & kids clothing.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Truck className="w-4 h-4 text-primary" />
              Free Pickup & Delivery
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              24-72 Hours Delivery
            </span>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-10"
        >
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-gold"
                  : "bg-card border border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Subcategories and Services */}
        <AnimatePresence mode="wait">
          {currentCategory && (
            <motion.div
              key={currentCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {currentCategory.subcategories.map((subcategory, subIndex) => (
                <div key={subcategory.name} className="mb-12">
                  {/* Subcategory Header */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: subIndex * 0.1 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <span className="text-2xl">{subcategory.icon}</span>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {subcategory.name}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </motion.div>

                  {/* Services Grid */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {subcategory.items.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isHovered={hoveredService === service.id}
                        onHover={() => setHoveredService(service.id)}
                        onLeave={() => setHoveredService(null)}
                        onBook={() => handleBookNow(service.name)}
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: ServiceItem;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onBook: () => void;
}

const ServiceCard = ({ service, isHovered, onHover, onLeave, onBook }: ServiceCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold"
    >
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Image */}
        <motion.div
          className="w-16 h-16 mx-auto mb-3 relative"
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.4 }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1.3 }}
            transition={{ duration: 0.3 }}
          />
          <img
            src={service.image}
            alt={`${service.name} alteration service`}
            className="relative z-10 w-full h-full object-contain"
          />
        </motion.div>

        {/* Service Name */}
        <h4 className="font-display text-base font-semibold text-center mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {service.name}
        </h4>
        
        {/* Description */}
        <p className="text-muted-foreground text-xs text-center mb-3 line-clamp-2">
          {service.description}
        </p>
        
        {/* Time */}
        <div className="flex items-center justify-center gap-1 mb-3 text-xs">
          <Clock className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">{service.time}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground">From</span>
            <p className="text-lg font-display font-bold text-primary">
              ₹{service.price}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="gold"
              size="sm"
              onClick={onBook}
              className="text-xs px-3 py-1 h-8"
            >
              Book
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
