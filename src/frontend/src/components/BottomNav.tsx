import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, CreditCard, Home, UtensilsCrossed } from "lucide-react";
import { useCart } from "../context/CartContext";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/menu", icon: UtensilsCrossed, label: "Menu" },
  { path: "/orders", icon: ClipboardList, label: "Orders" },
  { path: "/pay-bill", icon: CreditCard, label: "Pay Bill" },
];

export default function BottomNav() {
  const { location } = useRouterState();
  const { totalItems } = useCart();
  const pathname = location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-nav-gradient"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-ocid="bottom_nav"
    >
      <div className="max-w-[480px] mx-auto flex items-stretch">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;
          const isOrders = path === "/orders";
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all relative ${
                isActive ? "opacity-100" : "opacity-70 hover:opacity-90"
              }`}
              data-ocid={`nav_${label.toLowerCase().replace(" ", "_")}.link`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  color="white"
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {isOrders && totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                    style={{ background: "#D7A1AA", color: "#1F1F1F" }}
                    data-ocid="orders.badge"
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] text-white font-medium ${isActive ? "font-bold" : ""}`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
