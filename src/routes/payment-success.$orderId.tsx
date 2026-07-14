import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin } from "lucide-react";
import { getOrder } from "@/lib/order-store";
import { formatAddress } from "@/lib/address";

export const Route = createFileRoute("/payment-success/$orderId")({
  head: () => ({
    meta: [
      { title: "Payment Successful — The Frosting Fairy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { orderId } = Route.useParams();
  const order = getOrder(orderId);

  return (
    <main className="px-6 py-16 max-w-xl mx-auto">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent mb-6">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Payment Successful</p>
        <h1 className="font-display text-4xl italic mb-3">Thank you!</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Your order has been received. We&apos;ll message you shortly to confirm pickup or delivery details.
        </p>

        {order && (
          <div className="text-left rounded-2xl border border-border bg-background p-6 mb-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order</span>
              <span className="font-mono">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Placed by</span>
              <span>{order.customer.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Phone</span>
              <span className="font-mono">{order.customer.phone}</span>
            </div>
            {order.shippingAddress && (
              <div className="border-t border-border pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Delivering to
                </p>
                <p className="text-sm leading-relaxed">
                  {order.shippingAddress.formatted || formatAddress(order.shippingAddress)}
                </p>
                {order.shippingAddress.landmark && (
                  <p className="text-xs text-muted-foreground mt-1">Landmark: {order.shippingAddress.landmark}</p>
                )}
                {typeof order.shippingAddress.latitude === "number" && typeof order.shippingAddress.longitude === "number" && (
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {order.shippingAddress.latitude.toFixed(5)}, {order.shippingAddress.longitude.toFixed(5)}
                  </p>
                )}
              </div>
            )}
            <div className="border-t border-border pt-4">
              <ul className="space-y-2 mb-4">
                {order.items.map((i) => (
                  <li key={i.slug} className="flex justify-between text-sm">
                    <span className="truncate">{i.name} × {i.quantity}</span>
                    <span className="font-mono">₹{i.priceValue * i.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-mono text-sm border-t border-border pt-3">
                <span className="uppercase tracking-widest text-muted-foreground">Total paid</span>
                <span className="text-lg">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/menu" className="rounded-full bg-foreground text-background px-6 py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition-all">
            Order something else
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-full border border-foreground px-6 py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all"
          >
            Print receipt
          </button>
        </div>
      </div>
    </main>
  );
}