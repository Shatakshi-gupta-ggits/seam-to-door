import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "./CartDrawer";

const WHATSAPP_NUMBER = "919407826370";
const WHATSAPP_MESSAGE = "Hi! I'm interested in your alteration services. Can you help me?";

// WhatsApp SVG Icon for authentic look
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958C9.726 30.904 12.764 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.316 22.598c-.39 1.1-1.932 2.014-3.158 2.28-.84.178-1.936.32-5.628-1.21-4.724-1.956-7.764-6.758-8-7.072-.226-.314-1.9-2.532-1.9-4.83s1.2-3.43 1.626-3.9c.39-.43.918-.644 1.428-.644.172 0 .326.008.466.016.426.018.64.044.92.712.352.836 1.21 2.952 1.318 3.168.108.216.18.468.036.756-.136.288-.204.468-.408.72-.204.252-.43.562-.614.754-.204.216-.418.45-.18.884.238.434 1.058 1.746 2.272 2.83 1.562 1.394 2.878 1.826 3.286 2.032.408.206.646.172.884-.104.246-.284 1.054-1.226 1.336-1.648.28-.422.562-.352.948-.212.39.14 2.47 1.164 2.894 1.376.424.212.706.32.81.496.102.176.102 1.024-.288 2.124z"/>
  </svg>
);

export const FloatingButtons = () => {
  const { totalItems, totalAmount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    // Using direct URL that works in all browsers/iframes
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  return (
    <>
      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3">
        {/* WhatsApp Button with Chat Popup Style */}
        <div className="relative">
          {/* Chat Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium"
              >
                Chat with us!
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsAppClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center justify-center hover:shadow-[0_6px_30px_rgba(37,211,102,0.5)] transition-all duration-300"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon />
          </motion.button>
        </div>

        {/* Cart Button */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative bg-primary text-primary-foreground rounded-2xl shadow-gold px-4 py-3 flex items-center gap-2"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-charcoal text-primary text-xs font-bold rounded-full flex items-center justify-center border-2 border-primary">
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs opacity-90">Cart Total</p>
                <p className="font-display font-bold">₹{totalAmount}</p>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
