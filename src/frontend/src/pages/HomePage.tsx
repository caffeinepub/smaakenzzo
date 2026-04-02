import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { MENU_CATEGORIES } from "../data/menuData";

const FEATURED_CATEGORIES = [
  "churros",
  "belgian-waffles",
  "bubble-waffles",
  "sundaes",
  "sizzlers",
  "premium-shakes",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();

  const featured = MENU_CATEGORIES.filter((c) =>
    FEATURED_CATEGORIES.includes(c.id),
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="w-8" />
          <h1 className="font-display text-2xl font-bold text-gold">
            Smaakenzzo
          </h1>
          <button
            type="button"
            onClick={() => navigate({ to: "/orders" })}
            className="relative p-2"
            data-ocid="header.cart_button"
          >
            <ShoppingCart size={22} className="text-gold" />
            {totalItems > 0 && (
              <span
                className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                style={{ background: "#D7A1AA", color: "#1F1F1F" }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[480px] mx-auto"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src="/assets/generated/churros.dim_400x300.jpg"
            alt="Smaakenzzo Churros"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-sm font-medium mb-1"
            >
              Welcome to
            </motion.p>
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-3xl font-bold text-white mb-2"
            >
              Indulge in Every Bite
            </motion.h2>
            <motion.button
              type="button"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate({ to: "/menu" })}
              className="w-fit bg-gold-gradient text-foreground font-bold text-sm px-5 py-2.5 rounded-full shadow-gold"
              data-ocid="hero.explore_menu.button"
            >
              Explore Menu
            </motion.button>
          </div>
        </div>
      </motion.section>

      <section className="max-w-[480px] mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-4"
        >
          <Star size={16} className="text-gold" fill="currentColor" />
          <h3 className="font-display text-xl font-semibold text-foreground">
            Popular Picks
          </h3>
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {featured.map((cat, i) => (
            <motion.button
              type="button"
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              onClick={() => navigate({ to: "/menu", search: { cat: cat.id } })}
              className="flex flex-col rounded-2xl overflow-hidden shadow-card bg-card"
              data-ocid={`category.item.${i + 1}`}
            >
              <div className="h-20 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-semibold text-center py-2 px-1 leading-tight">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="max-w-[480px] mx-auto px-4 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-5 shadow-card border border-border"
        >
          <h3 className="font-display text-lg font-semibold text-gold mb-2">
            About Smaakenzzo
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A luxury dessert café experience offering premium churros, Belgian
            waffles, artisan milkshakes, brownie sizzlers and much more. Every
            bite crafted with love.
          </p>
        </motion.div>
      </section>

      {totalItems > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="fixed bottom-[60px] left-0 right-0 z-30 max-w-[480px] mx-auto px-4"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/orders" })}
            className="w-full bg-gold-gradient text-foreground font-bold py-3 px-4 rounded-2xl shadow-gold flex items-center justify-between"
            data-ocid="cart_bar.view_order.button"
          >
            <span className="bg-foreground/20 text-foreground rounded-full px-2.5 py-0.5 text-sm">
              {totalItems} items
            </span>
            <span>View Order</span>
            <span className="font-bold">₹{totalPrice}</span>
          </button>
        </motion.div>
      )}

      <footer className="max-w-[480px] mx-auto px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
