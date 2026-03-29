import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceItem, ServiceVariant } from "@/data/services";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal = ({ service, isOpen, onClose }: ServiceDetailModalProps) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Image */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Service Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/95 to-transparent p-4 pt-8">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>{service.time}</span>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              
              {/* Alteration Options */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground text-sm">
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
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{variant.name}</p>
                          <p className="text-base font-display font-bold text-primary">
                            ₹{variant.price}
                          </p>
                        </div>
                        
                        <Button
                          variant={variantInCart ? "goldOutline" : "gold"}
                          size="sm"
                          onClick={() => handleAddVariant(variant)}
                          className="gap-1 text-xs px-3 py-1.5 h-auto"
                        >
                          {variantInCart ? (
                            <>
                              <Plus className="w-3 h-3" />
                              Add ({quantity})
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3" />
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
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">Standard Alteration</p>
                      <p className="text-base font-display font-bold text-primary">
                        ₹{service.price}
                      </p>
                    </div>
                    
                    <Button
                      variant={isInCart(service.id) ? "goldOutline" : "gold"}
                      size="sm"
                      onClick={handleAddBase}
                      className="gap-1 text-xs px-3 py-1.5 h-auto"
                    >
                      {isInCart(service.id) ? (
                        <>
                          <Plus className="w-3 h-3" />
                          Add More
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3" />
                          Add
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
