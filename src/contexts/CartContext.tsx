import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { ServiceItem, ServiceVariant, getMinPrice } from "@/data/services";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const noop = () => {};

const FALLBACK_CART_CONTEXT = {
  items: [],
  addToCart: noop,
  removeFromCart: noop,
  updateQuantity: noop,
  clearCart: noop,
  totalItems: 0,
  totalAmount: 0,
  isInCart: () => false,
  getItemQuantity: () => 0,
  isLoading: false,
} as const;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  variantName?: string; // Add variant support
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: ServiceItem, variant?: ServiceVariant) => void;
  removeFromCart: (serviceId: string, variantName?: string) => void;
  updateQuantity: (serviceId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isInCart: (serviceId: string, variant?: ServiceVariant) => boolean;
  getItemQuantity: (serviceId: string, variant?: ServiceVariant) => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);

  // IMPORTANT: Do not hard-crash the entire app if the provider is missing.
  // This prevents blank screens; we'll log loudly so we can still diagnose.
  if (!context) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error(
        "useCart was called without a CartProvider. Falling back to empty cart.",
        { pathname: window.location?.pathname }
      );
    }
    return FALLBACK_CART_CONTEXT;
  }

  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState<{ user: any; isAuthenticated: boolean }>({ user: null, isAuthenticated: false });

  // Listen to auth state changes directly from Supabase to avoid circular dependency
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthState({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user
      });
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const { user, isAuthenticated } = authState;

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

  const addToCart = useCallback((service: ServiceItem, variant?: ServiceVariant) => {
    setItems((prev) => {
      const cartItemId = variant ? `${service.id}-${variant.name}` : service.id;
      const existing = prev.find((item) => item.id === cartItemId);
      let newItems: CartItem[];

      const itemName = variant ? `${service.name} - ${variant.name}` : service.name;
      const itemPrice = variant ? variant.price : getMinPrice(service);

      if (existing) {
        newItems = prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success(`Added another ${itemName} to cart`);
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          name: itemName,
          price: itemPrice,
          quantity: 1,
          image: service.image,
          category: service.category,
          variantName: variant?.name,
        };
        newItems = [...prev, newItem];
        toast.success(`${itemName} added to cart`);
      }

      // Persist asynchronously
      persistCart(newItems);
      return newItems;
    });
  }, [persistCart]);

  const removeFromCart = useCallback((serviceId: string, variantName?: string) => {
    setItems((prev) => {
      const cartItemId = variantName ? `${serviceId}-${variantName}` : serviceId;
      const newItems = prev.filter((item) => item.id !== cartItemId);
      persistCart(newItems);
      toast.info("Item removed from cart");
      return newItems;
    });
  }, [persistCart]);

  const updateQuantity = useCallback((serviceId: string, quantity: number, variantName?: string) => {
    if (quantity < 1) return;

    setItems((prev) => {
      const cartItemId = variantName ? `${serviceId}-${variantName}` : serviceId;
      const newItems = prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
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
    (serviceId: string, variant?: ServiceVariant) => {
      const cartItemId = variant ? `${serviceId}-${variant.name}` : serviceId;
      return items.some((item) => item.id === cartItemId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (serviceId: string, variant?: ServiceVariant) => {
      const cartItemId = variant ? `${serviceId}-${variant.name}` : serviceId;
      const item = items.find((item) => item.id === cartItemId);
      return item?.quantity || 0;
    },
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
        getItemQuantity,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
