import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Smartphone, ShieldCheck } from "lucide-react";
import { getOrder, markOrderPaidLocal } from "@/lib/order-store";
import { UPI_ID, PAYEE_NAME, buildUpiUri } from "@/lib/payment-config";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/payment/$orderId")({
  head: () => ({
    meta: [
      { title: "Pay via UPI — The Frosting Fairy" },
      { name: "description", content: "Complete your order securely using any UPI app." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const { clear } = useCart();
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(() => getOrder(orderId));

  useEffect(() => { setOrder(getOrder(orderId)); }, [orderId]);

  const upiUri = useMemo(
    () => (order ? buildUpiUri({ amount: order.total, orderId: order.id, note: `Order ${order.id}` }) : ""),
    [order],
  );

  if (!order) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h1 className="font-display text-3xl italic">Order not found</h1>
        <Link to="/menu" className="rounded-full border border-foreground px-5 py-2 text-[10px] uppercase tracking-widest font-bold">Back to menu</Link>
      </main>
    );
  }

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 1800);
    } catch { toast.error("Couldn't copy — please copy manually"); }
  }

  function markPaid() {
    markOrderPaidLocal(order!.id);
    clear();
    navigate({ to: "/payment-success/$orderId", params: { orderId: order!.id } });
  }

  return (
    <main className="px-6 py-12 max-w-xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Secure Payment</p>
      <h1 className="font-display text-4xl italic mb-8">Pay via UPI</h1>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-8">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Amount to pay</p>
          <p className="font-display text-5xl italic">₹{order.total.toFixed(2)}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Order {order.id}</p>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Pay to</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm truncate">{PAYEE_NAME}</p>
              <p className="font-mono text-sm truncate">{UPI_ID}</p>
            </div>
            <button
              onClick={copyUpi}
              className="shrink-0 flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition"
            >
              {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy UPI ID</>}
            </button>
          </div>
        </div>

        <a
          href={upiUri}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <Smartphone className="h-4 w-4" /> Pay via UPI
        </a>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Tapping the button opens your UPI app (GPay, PhonePe, Paytm, BHIM…) pre-filled with the amount.
          On desktop, scan the QR in your app or copy the UPI ID above.
        </p>

        <div className="border-t border-border pt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-3 text-center">Already paid?</p>
          <button
            onClick={markPaid}
            className="w-full rounded-full border border-foreground py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
          >
            I&apos;ve completed the payment
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" /> We&apos;ll verify with your bank reference before confirming.
          </p>
        </div>
      </div>
    </main>
  );
}