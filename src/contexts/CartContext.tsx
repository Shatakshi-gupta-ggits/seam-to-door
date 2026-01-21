import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { ServiceItem, getMinPrice } from "@/data/services";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
  isLoading: boolean;
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage or Supabase on init
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;

          if (data && data.length > 0) {
            // Transform database cart items to local format
            const cartItems: CartItem[] = data.map(item => ({
              id: item.service_id,
              name: item.notes?.split('|')[0] || 'Service',
              price: parseFloat(item.notes?.split('|')[1] || '0'),
              quantity: item.quantity,
              image: item.notes?.split('|')[2] || '',
              category: item.notes?.split('|')[3] || '',
            }));
            setItems(cartItems);
          } else {
            // Check if there's local cart to sync
            const localCart = localStorage.getItem("cart_items");
            if (localCart) {
              const localItems = JSON.parse(localCart);
              if (localItems.length > 0) {
                // Sync local cart to database
                await syncCartToDatabase(localItems, user.id);
                setItems(localItems);
              }
            }
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          // Fallback to localStorage
          const saved = localStorage.getItem("cart_items");
          if (saved) setItems(JSON.parse(saved));
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not authenticated, use localStorage
        const saved = localStorage.getItem("cart_items");
        if (saved) setItems(JSON.parse(saved));
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  const syncCartToDatabase = async (cartItems: CartItem[], userId: string) => {
    try {
      // Clear existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      // Insert new items
      if (cartItems.length > 0) {
        const dbItems = cartItems.map(item => ({
          user_id: userId,
          service_id: item.id,
          quantity: item.quantity,
          notes: `${item.name}|${item.price}|${item.image}|${item.category}`,
        }));

        await supabase
          .from('cart_items')
          .insert(dbItems);
      }
    } catch (error) {
      console.error('Error syncing cart to database:', error);
    }
  };

  const persistCart = useCallback(async (newItems: CartItem[]) => {
    // Always save to localStorage
    localStorage.setItem("cart_items", JSON.stringify(newItems));
    setItems(newItems);

    // If authenticated, also sync to database
    if (isAuthenticated && user) {
      await syncCartToDatabase(newItems, user.id);
    }
  }, [isAuthenticated, user]);

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

      // Persist asynchronously
      persistCart(newItems);
      return newItems;
    });
  }, [persistCart]);

  const removeFromCart = useCallback((serviceId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== serviceId);
      persistCart(newItems);
      toast.info("Item removed from cart");
      return newItems;
    });
  }, [persistCart]);

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === serviceId ? { ...item, quantity } : item
      );
      persistCart(newItems);
      return newItems;
    });
  }, [persistCart]);

  const clearCart = useCallback(async () => {
    localStorage.removeItem("cart_items");
    setItems([]);
    
    if (isAuthenticated && user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error clearing cart from database:', error);
      }
    }
  }, [isAuthenticated, user]);

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
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
