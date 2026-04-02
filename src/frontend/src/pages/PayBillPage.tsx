import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, Receipt } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";

const UPI_PLATFORMS = [
  {
    name: "PhonePe",
    color: "#5f259f",
    textColor: "white",
    icon: "/assets/generated/phonepe-icon.png",
    emoji: "📲",
    scheme: (amount: number) =>
      `intent://pay?pa=smaakenzzo@ybl&pn=Smaakenzzo&am=${amount}&cu=INR&tn=Smaakenzzo+Order#Intent;scheme=upi;package=com.phonepe.app;end`,
  },
  {
    name: "Google Pay",
    color: "#FFFFFF",
    textColor: "#202124",
    icon: "/assets/generated/gpay-icon.png",
    emoji: "🟢",
    scheme: (amount: number) =>
      `intent://upi/pay?pa=smaakenzzo@okicici&pn=Smaakenzzo&am=${amount}&cu=INR&tn=Smaakenzzo+Order#Intent;scheme=tez;package=com.google.android.apps.nbu.paisa.user;end`,
  },
  {
    name: "Paytm",
    color: "#00B9F1",
    textColor: "white",
    icon: "/assets/generated/paytm-icon.png",
    emoji: "💰",
    scheme: (amount: number) =>
      `intent://pay?pa=smaakenzzo@paytm&pn=Smaakenzzo&am=${amount}&cu=INR&tn=Smaakenzzo+Order#Intent;scheme=paytmmp;package=net.one97.paytm;end`,
  },
  {
    name: "BHIM UPI",
    color: "#00558C",
    textColor: "white",
    icon: "/assets/generated/bhim-icon.png",
    emoji: "🇮🇳",
    scheme: (amount: number) =>
      `intent://pay?pa=smaakenzzo@upi&pn=Smaakenzzo&am=${amount}&cu=INR&tn=Smaakenzzo+Order#Intent;scheme=upi;package=in.org.npci.upiapp;end`,
  },
  {
    name: "Amazon Pay",
    color: "#FF9900",
    textColor: "#111111",
    icon: "/assets/generated/amazonpay-icon.png",
    emoji: "📦",
    scheme: (amount: number) =>
      `intent://pay?pa=smaakenzzo@apl&pn=Smaakenzzo&am=${amount}&cu=INR&tn=Smaakenzzo+Order#Intent;scheme=upi;package=in.amazon.mShop.android.shopping;end`,
  },
  {
    name: "Cred",
    color: "#1C1C1C",
    textColor: "#FFD700",
    icon: "/assets/generated/cred-icon.png",
    emoji: "💎",
    scheme: (amount: number) =>
      `intent://pay?pa=smaakenzzo@cred&pn=Smaakenzzo&am=${amount}&cu=INR&tn=Smaakenzzo+Order#Intent;scheme=upi;package=com.dreamplug.androidapp;end`,
  },
];

export default function PayBillPage() {
  const navigate = useNavigate();
  const { lastBill, cartItems, totalPrice } = useCart();

  // Show live cart if items exist, otherwise show last placed order bill
  const bill =
    cartItems.length > 0
      ? { items: cartItems, total: totalPrice }
      : lastBill
        ? { items: lastBill.items, total: lastBill.total }
        : null;

  const handlePay = (scheme: (amount: number) => string, amount: number) => {
    const url = scheme(amount);
    window.location.href = url;
  };

  if (!bill) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-[480px] mx-auto px-4 py-3">
            <h1 className="font-display text-2xl font-bold text-gold text-center">
              Pay Bill
            </h1>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[480px] mx-auto px-4 flex flex-col items-center justify-center py-20 gap-4"
          data-ocid="paybill.empty_state"
        >
          <Receipt size={56} className="text-gold opacity-30" />
          <h3 className="font-display text-xl font-semibold text-muted-foreground">
            No Bill Generated Yet
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Place an order first and your bill will appear here.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/menu" })}
            className="bg-gold-gradient text-foreground font-bold px-6 py-3 rounded-full shadow-gold"
            data-ocid="paybill.browse_menu.button"
          >
            Browse Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="font-display text-2xl font-bold text-gold text-center">
            Pay Bill
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        {/* Itemized Bill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden mb-6"
          data-ocid="paybill.bill.card"
        >
          <div className="bg-gold-gradient p-4">
            <div className="flex items-center gap-2">
              <Receipt size={20} />
              <h2 className="font-display text-lg font-bold">Itemized Bill</h2>
            </div>
          </div>
          <div className="p-4">
            {bill.items.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex justify-between py-2 border-b border-border last:border-0"
                data-ocid={`paybill.item.${i + 1}`}
              >
                <div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    × {item.quantity}
                  </span>
                </div>
                <span className="font-semibold text-sm">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-gold">
              <span className="font-display font-bold text-lg">
                Grand Total
              </span>
              <span className="font-display font-bold text-xl text-gold">
                ₹{bill.total}
              </span>
            </div>
          </div>
        </motion.div>

        {/* UPI Payment Options */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <h2 className="font-display text-lg font-semibold mb-1 text-center">
            Pay via UPI
          </h2>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Tap a platform to open the app and pay ₹{bill.total}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {UPI_PLATFORMS.map((platform, i) => (
              <motion.button
                type="button"
                key={platform.name}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * i + 0.2 }}
                onClick={() => handlePay(platform.scheme, bill.total)}
                className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl shadow-card font-bold text-sm transition-all active:scale-95 hover:scale-105 border border-transparent hover:border-gold/30"
                style={{
                  backgroundColor: platform.color,
                  color: platform.textColor,
                }}
                data-ocid={`paybill.${platform.name.toLowerCase().replace(" ", "_")}.button`}
              >
                <span className="text-2xl">{platform.emoji}</span>
                <span className="text-xs font-bold leading-tight text-center px-1">
                  {platform.name}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] opacity-80">
                  ₹{bill.total} <ExternalLink size={9} />
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground px-4 pb-4">
          Tapping a payment button will open the respective UPI app directly.
          After payment, show confirmation to staff.
        </p>
      </div>
    </div>
  );
}
