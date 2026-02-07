import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Check, Clock, Truck } from "lucide-react";
import { serviceCategories, ServiceItem, getMinPrice } from "@/data/services";
import { useCart } from "@/contexts/CartContext";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState<string>("male");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentCategory = serviceCategories.find(c => c.id === selectedCategory);

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  return (
    <section ref={ref} id="services" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
            Our Services
          </span>
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-3">
            Expert Alterations for{" "}
            <span className="text-gradient-gold">Every Garment</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-4">
            Professional doorstep tailoring & alteration service in Jabalpur. 
            Pickup and delivery for men, women & kids clothing.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="w-3.5 h-3.5 text-primary" />
              Free Pickup & Delivery
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              24-72 Hours Delivery
            </span>
          </div>
        </motion.div>

        {/* Image Carousel */}
        <ServicesCarousel />

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-2 md:gap-4 mb-8"
        >
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-gold"
                  : "bg-card border border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <span className="text-lg md:text-xl">{category.icon}</span>
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
                <div key={subcategory.name} className="mb-8 md:mb-12">
                  {/* Subcategory Header */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: subIndex * 0.1 }}
                    className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6"
                  >
                    <span className="text-xl md:text-2xl">{subcategory.icon}</span>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
                      {subcategory.name}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </motion.div>

                  {/* Services Grid */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5"
                  >
                    {subcategory.items.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onClick={() => handleServiceClick(service)}
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

interface ServiceCardProps {
  service: ServiceItem;
  onClick: () => void;
}

const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const minPrice = getMinPrice(service);
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(service.id);
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-card rounded-xl md:rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold cursor-pointer"
    >
      {/* Service Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        <img
          src={service.image}
          alt={`${service.name} alteration service`}
          className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* In Cart Badge */}
        {inCart && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
            <Check className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        {/* Service Name */}
        <h4 className="font-display text-sm md:text-base font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {service.name}
        </h4>
        
        {/* Variants count */}
        {service.variants && service.variants.length > 1 && (
          <p className="text-[10px] md:text-xs text-muted-foreground mb-2">
            {service.variants.length} alteration options
          </p>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] md:text-[10px] text-muted-foreground block">Starting from</span>
            <p className="text-base md:text-xl font-display font-bold text-primary transition-colors">
              ₹{minPrice}
            </p>
          </div>
          <Button
            variant="gold"
            size="sm"
            className="text-[10px] md:text-xs px-2.5 md:px-4 py-1 h-7 md:h-9"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ShoppingCart className="w-3 h-3 mr-0.5" />
            View Options
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
