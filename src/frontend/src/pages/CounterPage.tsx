import { CheckCircle2, ChefHat, Clock, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type OrderStatus = "sent_to_counter" | "preparing" | "done";

interface PlacedOrder {
  id: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    categoryImage: string;
  }[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

function statusLabel(status: OrderStatus) {
  switch (status) {
    case "sent_to_counter":
      return "New Order";
    case "preparing":
      return "Preparing";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function statusColor(status: OrderStatus) {
  switch (status) {
    case "sent_to_counter":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "preparing":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "done":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function CounterPage() {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(() => {
    setRefreshing(true);
    try {
      const saved = localStorage.getItem("smaakenzzo_orders");
      const all: PlacedOrder[] = saved ? JSON.parse(saved) : [];
      setOrders(all.filter((o) => o.status !== "done"));
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    try {
      const saved = localStorage.getItem("smaakenzzo_orders");
      const all: PlacedOrder[] = saved ? JSON.parse(saved) : [];
      const updated = all.map((o) => (o.id === id ? { ...o, status } : o));
      localStorage.setItem("smaakenzzo_orders", JSON.stringify(updated));
      fetchOrders();
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-nav-gradient shadow-md">
        <div className="max-w-[600px] mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-white">
              Counter View
            </h1>
            <p className="text-white/70 text-xs">Smaakenzzo Staff Dashboard</p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={refreshing}
            className="p-2 bg-white/20 rounded-full text-white"
            data-ocid="counter.refresh.button"
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-4 pt-4 pb-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="counter.empty_state"
          >
            <ChefHat size={48} className="text-gold opacity-30" />
            <h3 className="font-display text-xl font-semibold text-muted-foreground">
              No Pending Orders
            </h3>
            <p className="text-sm text-muted-foreground">
              All orders are up to date!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl shadow-card p-4 mb-4 border border-border"
                data-ocid={`counter.order.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base">Order</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColor(order.status)}`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="mb-3">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between py-1 text-sm border-b border-border last:border-0"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-gold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold mb-4 pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-gold">₹{order.total}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === "sent_to_counter" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="flex-1 bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1"
                      data-ocid={`counter.preparing.button.${i + 1}`}
                    >
                      <ChefHat size={16} />
                      Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "done")}
                      className="flex-1 bg-orange-500 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1"
                      data-ocid={`counter.ready.button.${i + 1}`}
                    >
                      <Clock size={16} />
                      Mark Ready
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "done")}
                    className="flex-1 bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1"
                    data-ocid={`counter.paid.button.${i + 1}`}
                  >
                    <CheckCircle2 size={16} />
                    Mark Done
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
