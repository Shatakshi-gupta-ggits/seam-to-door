import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceItem, ServiceVariant } from "@/data/services";
import { useCart } from "@/contexts/CartContext";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal = ({ service, isOpen, onClose }: ServiceDetailModalProps) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  if (!service) return null;

  const handleAddVariant = (variant: ServiceVariant) => {
    addToCart(service, variant);
  };

  const handleAddBase = () => {
    addToCart(service);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-card border border-border rounded-2xl shadow-lift z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header with Image */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-contain p-6"
                />
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Service Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/90 to-transparent p-4 pt-8">
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  {service.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    {service.time}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <p className="text-muted-foreground mb-6">{service.description}</p>
              
              {/* Alteration Options */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground mb-3">
                  Alteration Options
                </h4>
                
                {service.variants && service.variants.length > 0 ? (
                  service.variants.map((variant, index) => {
                    const variantInCart = isInCart(service.id, variant);
                    const quantity = getItemQuantity(service.id, variant);
                    
                    return (
                      <motion.div
                        key={variant.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 md:p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{variant.name}</p>
                          <p className="text-lg font-display font-bold text-primary">
                            ₹{variant.price}
                          </p>
                        </div>
                        
                        <Button
                          variant={variantInCart ? "goldOutline" : "gold"}
                          size="sm"
                          onClick={() => handleAddVariant(variant)}
                          className="gap-1.5"
                        >
                          {variantInCart ? (
                            <>
                              <Plus className="w-4 h-4" />
                              Add ({quantity})
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add
                            </>
                          )}
                        </Button>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 md:p-4 bg-secondary/50 rounded-xl border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">Standard Alteration</p>
                      <p className="text-lg font-display font-bold text-primary">
                        ₹{service.price}
                      </p>
                    </div>
                    
                    <Button
                      variant={isInCart(service.id) ? "goldOutline" : "gold"}
                      size="sm"
                      onClick={handleAddBase}
                      className="gap-1.5"
                    >
                      {isInCart(service.id) ? (
                        <>
                          <Plus className="w-4 h-4" />
                          Add More
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
