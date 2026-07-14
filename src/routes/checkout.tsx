import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/order-store";
import { ShoppingBag, MapPin, Star, Trash2 } from "lucide-react";
import { AddressForm } from "@/components/AddressForm";
import { LocationPicker } from "@/components/LocationPicker";
import {
  emptyAddress,
  formatAddress,
  validateAddress,
  listSavedAddresses,
  saveAddress as persistAddress,
  deleteSavedAddress,
  getDefaultAddressId,
  setDefaultAddressId,
  type ShippingAddress,
  type SavedAddress,
  type AddressValidation,
} from "@/lib/address";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Frosting Fairy" },
      { name: "description", content: "Review your order, add a delivery address, and continue to secure UPI payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, closeCart } = useCart();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState<ShippingAddress>(() => emptyAddress());
  const [errors, setErrors] = useState<AddressValidation["errors"]>({});
  const [saveForNext, setSaveForNext] = useState(true);
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [defaultId, setDefaultId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const list = listSavedAddresses();
    setSaved(list);
    const def = getDefaultAddressId();
    setDefaultId(def);
    if (list.length && def) {
      const match = list.find((a) => a.id === def);
      if (match) {
        const { id: _id, ...rest } = match;
        setAddress(rest);
      }
    }
  }, []);

  const formatted = useMemo(() => formatAddress(address), [address]);

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
    const v = validateAddress(address);
    setErrors(v.errors);
    if (!v.ok) {
      toast.error("Please fill in the highlighted fields");
      const first = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    try {
      const finalAddress: ShippingAddress = { ...address, formatted };
      const order = await createOrder(
        items,
        {
          name: finalAddress.fullName,
          phone: finalAddress.phone,
          email: finalAddress.email || undefined,
          notes,
        },
        subtotal,
        finalAddress,
      );
      if (saveForNext) {
        const s = persistAddress(finalAddress);
        if (!defaultId) setDefaultAddressId(s.id);
      }
      closeCart();
      navigate({ to: "/payment/$orderId", params: { orderId: order.id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function pickSaved(a: SavedAddress) {
    const { id: _id, ...rest } = a;
    setAddress(rest);
    setErrors({});
    toast.success(`Loaded "${a.label ?? "address"}"`);
  }

  function makeDefault(id: string) {
    setDefaultAddressId(id);
    setDefaultId(id);
  }

  function removeSaved(id: string) {
    deleteSavedAddress(id);
    setSaved(listSavedAddresses());
    if (defaultId === id) setDefaultId(null);
  }

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Checkout</p>
      <h1 className="font-display text-4xl italic mb-10">Almost there</h1>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10 min-w-0">
          {saved.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl italic">Saved addresses</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {saved.map((a) => {
                  const isDefault = a.id === defaultId;
                  return (
                    <div
                      key={a.id}
                      className={`rounded-2xl border p-4 text-sm transition ${
                        isDefault ? "border-accent bg-accent/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {a.label ?? "Address"}
                        </span>
                        {isDefault && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent font-bold">
                            <Star className="h-3 w-3 fill-current" /> Default
                          </span>
                        )}
                      </div>
                      <p className="font-medium truncate">{a.fullName}</p>
                      <p className="text-muted-foreground text-[13px] leading-relaxed line-clamp-2">
                        {formatAddress(a)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => pickSaved(a)}
                          className="rounded-full border border-foreground px-3 py-1 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition"
                        >
                          Use this
                        </button>
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => makeDefault(a.id)}
                            className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
                          >
                            Set default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeSaved(a.id)}
                          className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div>
              <h2 className="font-display text-xl italic">Delivery location</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Use your GPS or drag the pin to pinpoint where we should deliver.
              </p>
            </div>
            <LocationPicker
              latitude={address.latitude}
              longitude={address.longitude}
              onPick={(r) => {
                setAddress((prev) => ({
                  ...prev,
                  house: r.house || prev.house,
                  street: r.street || prev.street,
                  area: r.area || prev.area,
                  city: r.city || prev.city,
                  state: r.state || prev.state,
                  postalCode: r.postalCode || prev.postalCode,
                  country: r.country || prev.country,
                  latitude: r.latitude,
                  longitude: r.longitude,
                  accuracy: r.accuracy,
                  formatted: r.formatted || prev.formatted,
                }));
              }}
            />
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl italic">Shipping address</h2>
            <AddressForm value={address} onChange={setAddress} errors={errors} />

            <label className="block">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Order notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={500}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="Allergies, pickup time, personalisation…"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={saveForNext}
                onChange={(e) => setSaveForNext(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              Save this address for next time
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-foreground text-background py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place order & continue to payment"}
            </button>
          </section>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-24 space-y-4">
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
          {formatted && (
            <div className="border-t border-border pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Delivering to
              </p>
              <p className="text-sm leading-relaxed">{formatted}</p>
              {typeof address.latitude === "number" && typeof address.longitude === "number" && (
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {address.latitude.toFixed(5)}, {address.longitude.toFixed(5)}
                </p>
              )}
            </div>
          )}
        </aside>
      </form>
    </main>
  );
}