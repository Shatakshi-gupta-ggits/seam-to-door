import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import service images
import servicePants from "@/assets/service-pants.jpg";
import serviceShirt from "@/assets/service-shirt.jpg";
import serviceDress from "@/assets/service-dress.jpg";
import serviceKurti from "@/assets/service-kurti.jpg";
import serviceBlazer from "@/assets/service-blazer.jpg";
import serviceEthnic from "@/assets/service-ethnic.jpg";

// Import icon images
import pantIcon from "@/assets/pant.png";
import shirtIcon from "@/assets/shirt.png";
import dressIcon from "@/assets/dress.png";
import kurtiIcon from "@/assets/kurti.png";
import blazerIcon from "@/assets/blazer.png";
import ethnicIcon from "@/assets/ethnic.png";

const iconMap: Record<string, string> = {
  'Pant Alteration': pantIcon,
  'Shirt Alteration': shirtIcon,
  'Dress Alteration': dressIcon,
  'Kurti Alteration': kurtiIcon,
  'Blazer Alteration': blazerIcon,
  'Ethnic Jacket Alteration': ethnicIcon,
};

const imageMap: Record<string, string> = {
  'Pant Alteration': servicePants,
  'Shirt Alteration': serviceShirt,
  'Dress Alteration': serviceDress,
  'Kurti Alteration': serviceKurti,
  'Blazer Alteration': serviceBlazer,
  'Ethnic Jacket Alteration': serviceEthnic,
};

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
  const [services, setServices] = useState<Service[]>([]);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (!error && data) {
        setServices(data);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    // Update addedToCart based on cart items
    const cartServiceIds = new Set(items.map(item => item.service_id));
    setAddedToCart(cartServiceIds);
  }, [items]);

  const handleAddToCart = async (serviceId: string) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    await addToCart(serviceId);
    setAddedToCart(prev => new Set(prev).add(serviceId));
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
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Expert Alterations for{" "}
            <span className="text-gradient-gold">Every Garment</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From everyday wear to special occasions, our verified tailors handle it all with precision and care.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const isInCart = addedToCart.has(service.id);
            const icon = iconMap[service.name] || pantIcon;
            const image = imageMap[service.name] || servicePants;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  rotateY: 5,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold perspective-1000"
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    src={image}
                    alt={service.name}
                    className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/70 to-card/50" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 mb-4 relative"
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    />
                    <img
                      src={icon}
                      alt={`${service.name} icon`}
                      className="relative z-10 w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <p className="text-2xl font-display font-bold text-primary">
                        ₹{service.price}
                      </p>
                    </div>
                    <Button
                      variant={isInCart ? "outline" : "goldOutline"}
                      size="sm"
                      onClick={() => handleAddToCart(service.id)}
                      disabled={isInCart}
                      className={isInCart ? "border-green-500 text-green-500" : ""}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rotate-45" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
