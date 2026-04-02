import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type PlacedOrder, useCart } from "../context/CartContext";

type OrderStatus = "sent_to_counter" | "preparing" | "done";

function statusLabel(status: OrderStatus) {
  switch (status) {
    case "sent_to_counter":
      return "At Counter";
    case "preparing":
      return "Preparing";
    case "done":
      return "Ready";
    default:
      return status;
  }
}

function statusColor(status: OrderStatus) {
  switch (status) {
    case "sent_to_counter":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    placedOrders,
    setPlacedOrders,
    setLastBill,
  } = useCart();
  const [placing, setPlacing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const newOrder: PlacedOrder = {
        id: String(Date.now()),
        items: cartItems.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          categoryImage: i.categoryImage,
        })),
        total: totalPrice,
        status: "sent_to_counter",
        timestamp: Date.now(),
      };
      setPlacedOrders((prev) => [newOrder, ...prev]);
      setLastBill(newOrder);
      clearCart();
      setShowConfirm(false);
      toast.success("Order placed! Head to Pay Bill to pay.");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="font-display text-2xl font-bold text-gold text-center">
            Orders
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        {cartItems.length === 0 && placedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="orders.empty_state"
          >
            <ShoppingBag size={48} className="text-gold opacity-40" />
            <h3 className="font-display text-xl font-semibold text-muted-foreground">
              No Orders Yet
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              You haven't ordered anything yet. Place your first order.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/menu" })}
              className="bg-gold-gradient text-foreground font-bold px-6 py-3 rounded-full shadow-gold"
              data-ocid="orders.browse_menu.button"
            >
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <>
            {cartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-gold" />
                  Current Order
                </h2>
                <div
                  className="bg-card rounded-2xl shadow-card overflow-hidden"
                  data-ocid="orders.cart.list"
                >
                  <AnimatePresence>
                    {cartItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 border-b border-border last:border-0"
                        data-ocid={`orders.item.${i + 1}`}
                      >
                        <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.categoryImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gold font-bold">
                            ₹{item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-gold-gradient rounded-full px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-destructive"
                          data-ocid={`orders.delete_button.${i + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div className="p-4 bg-muted/50 flex items-center justify-between">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-gold text-lg">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                {!showConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="w-full mt-4 bg-gold-gradient text-foreground font-bold py-4 rounded-2xl shadow-gold flex items-center justify-center gap-2"
                    data-ocid="orders.place_order.button"
                  >
                    <ShoppingBag size={18} />
                    Place Order
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-card rounded-2xl shadow-card p-4 border border-gold"
                  >
                    <p className="font-display text-center font-semibold mb-1">
                      Confirm your order?
                    </p>
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      Total:{" "}
                      <span className="text-gold font-bold">₹{totalPrice}</span>
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 border border-border rounded-xl py-3 font-semibold text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="flex-1 bg-gold-gradient text-foreground font-bold py-3 rounded-xl shadow-gold disabled:opacity-60"
                        data-ocid="orders.confirm_order.button"
                      >
                        {placing ? "Placing..." : "Confirm & Send"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {placedOrders.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-gold" />
                  Order History
                </h2>
                {placedOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-2xl shadow-card p-4 mb-3"
                    data-ocid={`orders.history.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(order.status as OrderStatus)}`}
                      >
                        {statusLabel(order.status as OrderStatus)}
                      </span>
                    </div>
                    {order.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex justify-between text-sm py-0.5"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gold font-semibold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-gold">₹{order.total}</span>
                    </div>
                    {order.status === "done" && (
                      <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-semibold">
                        <CheckCircle2 size={14} />
                        Ready for pickup!
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
