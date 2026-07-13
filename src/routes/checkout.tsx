import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/order-store";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Frosting Fairy" },
      { name: "description", content: "Review your order and proceed to secure UPI payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, closeCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground/60" />
        <h1 className="font-display text-3xl italic">Your basket is empty</h1>
        <Link to="/menu" className="rounded-full border border-foreground px-5 py-2 text-[10px] uppercase tracking-widest font-bold">Browse menu</Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const order = await createOrder(items, { name, phone, email, notes }, subtotal);
      closeCart();
      navigate({ to: "/payment/$orderId", params: { orderId: order.id } });
    } catch (err) {
      console.error(err);
      alert("Couldn't place order. Please try again.");
    }
  }

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Checkout</p>
      <h1 className="font-display text-4xl italic mb-10">Almost there</h1>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <h2 className="font-display text-xl italic mb-2">Your details</h2>
          <Field label="Full name" value={name} onChange={setName} required autoComplete="name" />
          <Field label="Phone number" value={phone} onChange={setPhone} required type="tel" autoComplete="tel" />
          <Field label="Email (optional)" value={email} onChange={setEmail} type="email" autoComplete="email" />
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Order notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Allergies, pickup time, personalisation…"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-foreground text-background py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition-all"
          >
            Place order & continue to payment
          </button>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 h-fit">
          <h2 className="font-display text-xl italic mb-4">Order summary</h2>
          <ul className="space-y-3 mb-4">
            {items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-3 text-sm">
                <span className="truncate">{i.name} <span className="text-muted-foreground">× {i.quantity}</span></span>
                <span className="font-mono">₹{i.priceValue * i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4 flex justify-between font-mono text-sm">
            <span className="uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-lg">₹{subtotal}</span>
          </div>
        </aside>
      </form>
    </main>
  );
}

function Field({
  label, value, onChange, type = "text", required, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}