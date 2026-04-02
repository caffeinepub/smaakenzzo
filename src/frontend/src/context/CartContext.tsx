import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryImage: string;
}

export interface PlacedOrder {
  id: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    categoryImage: string;
  }[];
  total: number;
  status: "sent_to_counter" | "preparing" | "done";
  timestamp: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  placedOrders: PlacedOrder[];
  setPlacedOrders: React.Dispatch<React.SetStateAction<PlacedOrder[]>>;
  lastBill: PlacedOrder | null;
  setLastBill: React.Dispatch<React.SetStateAction<PlacedOrder | null>>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("smaakenzzo_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem("smaakenzzo_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastBill, setLastBill] = useState<PlacedOrder | null>(() => {
    try {
      const saved = localStorage.getItem("smaakenzzo_last_bill");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("smaakenzzo_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("smaakenzzo_orders", JSON.stringify(placedOrders));
  }, [placedOrders]);

  useEffect(() => {
    localStorage.setItem("smaakenzzo_last_bill", JSON.stringify(lastBill));
  }, [lastBill]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        placedOrders,
        setPlacedOrders,
        lastBill,
        setLastBill,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
