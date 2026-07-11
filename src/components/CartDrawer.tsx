import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../lib/cart";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal, clear } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Your Basket</p>
            <h2 className="font-display text-2xl italic">The Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 font-display text-xl italic">Your basket is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Sweet things are waiting on the menu.</p>
              <Link
                to="/menu"
                onClick={closeCart}
                className="mt-6 rounded-full border border-foreground px-5 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-display text-base">{item.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-border px-1">
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="p-1.5 hover:text-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="p-1.5 hover:text-accent transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-mono text-sm">₹{item.priceValue * item.quantity}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="uppercase tracking-widest text-muted-foreground">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Pickup & delivery calculated at checkout
            </p>
            <a
              href="/custom-orders"
              className="block w-full rounded-full bg-foreground text-background text-center py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Proceed to Checkout
            </a>
            <button
              onClick={clear}
              className="w-full text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear basket
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export function CartButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      className="relative rounded-full p-2 hover:bg-muted transition-colors"
      aria-label={`Open cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold font-mono">
          {itemCount}
        </span>
      )}
    </button>
  );
}