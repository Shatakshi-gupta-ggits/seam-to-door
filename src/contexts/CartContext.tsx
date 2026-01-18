import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { ServiceItem, getMinPrice } from "@/data/services";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isInCart: (serviceId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem("cart_items");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  const persistCart = useCallback((newItems: CartItem[]) => {
    localStorage.setItem("cart_items", JSON.stringify(newItems));
    setItems(newItems);
  }, []);

  const addToCart = useCallback((service: ServiceItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      let newItems: CartItem[];

      if (existing) {
        newItems = prev.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success(`Added another ${service.name} to cart`);
      } else {
        const newItem: CartItem = {
          id: service.id,
          name: service.name,
          price: getMinPrice(service),
          quantity: 1,
          image: service.image,
          category: service.category,
        };
        newItems = [...prev, newItem];
        toast.success(`${service.name} added to cart`);
      }

      localStorage.setItem("cart_items", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((serviceId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== serviceId);
      localStorage.setItem("cart_items", JSON.stringify(newItems));
      toast.info("Item removed from cart");
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === serviceId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart_items", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem("cart_items");
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const isInCart = useCallback(
    (serviceId: string) => items.some((item) => item.id === serviceId),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
