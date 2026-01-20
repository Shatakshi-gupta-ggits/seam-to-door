import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "./CartDrawer";

const WHATSAPP_NUMBER = "919876543210"; // Replace with actual number
const WHATSAPP_MESSAGE = "Hi! I'm interested in your alteration services. Can you help me?";

export const FloatingButtons = () => {
  const { totalItems, totalAmount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsAppClick}
          className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" fill="white" />
        </motion.button>

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
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-background text-primary text-xs font-bold rounded-full flex items-center justify-center border-2 border-primary">
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
