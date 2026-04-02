import { useNavigate, useSearch } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import {
  MENU_CATEGORIES,
  type MenuCategory,
  type MenuItem,
} from "../data/menuData";

function ItemCard({
  item,
  category,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  item: MenuItem;
  category: MenuCategory;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const itemImage = item.image ?? category.image;

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden flex flex-col">
      <div className="h-28 overflow-hidden">
        <img
          src={itemImage}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="font-semibold text-xs leading-tight mb-0.5">
          {item.name}
        </p>
        {item.customisable && (
          <span className="text-[9px] text-gold font-medium">Customisable</span>
        )}
        {item.description && (
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-sm text-gold">₹{item.price}</span>
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="bg-gold-gradient text-foreground text-xs font-bold px-3 py-1.5 rounded-full"
              data-ocid="menu.add_button"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-gold-gradient rounded-full px-1 py-0.5">
              <button
                type="button"
                onClick={onDecrease}
                className="w-6 h-6 flex items-center justify-center rounded-full"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                className="w-6 h-6 flex items-center justify-center rounded-full"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { cat?: string };
  const { cartItems, addToCart, updateQuantity, totalItems, totalPrice } =
    useCart();

  const [activeCat, setActiveCat] = useState(
    search.cat || MENU_CATEGORIES[0].id,
  );
  const catTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.cat) setActiveCat(search.cat);
  }, [search.cat]);

  useEffect(() => {
    const activeEl = catTabsRef.current?.querySelector(
      `[data-cat="${activeCat}"]`,
    );
    activeEl?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCat]);

  const activeCategory =
    MENU_CATEGORIES.find((c) => c.id === activeCat) ?? MENU_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="font-display text-2xl font-bold text-gold text-center">
            Menu
          </h1>
        </div>
        <div
          ref={catTabsRef}
          className="max-w-[480px] mx-auto flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide"
        >
          {MENU_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              data-cat={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCat === cat.id
                  ? "bg-gold-gradient text-foreground shadow-gold"
                  : "bg-card text-muted-foreground border border-border"
              }`}
              data-ocid="menu.tab"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCat}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-[480px] mx-auto px-4 pt-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl overflow-hidden">
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-display text-xl font-bold">
              {activeCategory.name}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3" data-ocid="menu.item.list">
            {activeCategory.items.map((item) => {
              const cartItem = cartItems.find((ci) => ci.id === item.id);
              const quantity = cartItem?.quantity ?? 0;
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  category={activeCategory}
                  quantity={quantity}
                  onAdd={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      categoryImage: item.image ?? activeCategory.image,
                    })
                  }
                  onIncrease={() => updateQuantity(item.id, quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, quantity - 1)}
                />
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

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
            data-ocid="menu.view_order.button"
          >
            <span className="bg-foreground/20 rounded-full px-2.5 py-0.5 text-sm flex items-center gap-1">
              <ShoppingBag size={14} />
              {totalItems}
            </span>
            <span>View Order</span>
            <span className="font-bold">₹{totalPrice}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
