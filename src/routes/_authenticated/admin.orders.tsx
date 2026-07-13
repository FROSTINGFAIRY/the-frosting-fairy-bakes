import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, ArrowLeft, Check, X, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — The Frosting Fairy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

type OrderRow = {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  items: Array<{ slug: string; name: string; price: string; priceValue: number; quantity: number; image?: string }>;
  total: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  updated_at: string;
};

type Filter = "all" | "pending" | "paid" | "cancelled";

async function fetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OrderRow[];
}

function OrdersPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const counts = useMemo(() => {
    const c = { all: orders.length, pending: 0, paid: 0, cancelled: 0 };
    for (const o of orders) c[o.status]++;
    return c;
  }, [orders]);

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderRow["status"] }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(vars.status === "paid" ? "Marked as paid" : vars.status === "cancelled" ? "Marked as cancelled" : "Reopened");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Owner Dashboard</p>
          <h1 className="font-display text-4xl italic">Incoming orders</h1>
          <p className="text-sm text-muted-foreground mt-2">Every order placed on your site shows up here.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition"
          >
            <ArrowLeft className="h-3 w-3" /> Menu
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(["all", "pending", "paid", "cancelled"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition ${
              filter === f
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:bg-muted"
            }`}
          >
            {f} <span className="ml-1 opacity-70">{counts[f]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : error ? (
        <p className="text-destructive text-sm">Couldn&apos;t load orders: {error instanceof Error ? error.message : "unknown error"}</p>
      ) : visible.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <p className="font-display text-2xl italic mb-2">No orders yet</p>
          <p className="text-sm text-muted-foreground">When a customer checks out, their order will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onMarkPaid={() => updateStatus.mutate({ id: o.id, status: "paid" })}
              onCancel={() => updateStatus.mutate({ id: o.id, status: "cancelled" })}
              onReopen={() => updateStatus.mutate({ id: o.id, status: "pending" })}
              isPending={updateStatus.isPending}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

function OrderCard({
  order, onMarkPaid, onCancel, onReopen, isPending,
}: {
  order: OrderRow;
  onMarkPaid: () => void;
  onCancel: () => void;
  onReopen: () => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const when = new Date(order.created_at);
  const badge =
    order.status === "paid"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : order.status === "cancelled"
      ? "bg-muted text-muted-foreground border-border line-through"
      : "bg-amber-100 text-amber-800 border-amber-200";

  return (
    <li className="rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 p-4 md:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="font-mono text-xs">{order.order_code}</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold ${badge}`}>
              {order.status}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {when.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>
          <p className="font-display text-lg italic truncate">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground truncate">
            <a href={`tel:${order.customer_phone}`} className="hover:underline">{order.customer_phone}</a>
            {order.customer_email && (<> · <a href={`mailto:${order.customer_email}`} className="hover:underline">{order.customer_email}</a></>)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <span className="font-mono text-lg">₹{Number(order.total).toFixed(2)}</span>
          {order.status !== "paid" && (
            <button
              onClick={onMarkPaid}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50"
            >
              <Check className="h-3 w-3" /> Mark paid
            </button>
          )}
          {order.status === "paid" && (
            <button
              onClick={onReopen}
              disabled={isPending}
              className="rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition disabled:opacity-50"
            >
              Reopen
            </button>
          )}
          {order.status !== "cancelled" && (
            <button
              onClick={onCancel}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition disabled:opacity-50"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-border p-1.5 hover:bg-muted transition"
            aria-label="Toggle details"
          >
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border p-4 md:p-5 bg-background/50 rounded-b-2xl space-y-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Items</p>
            <ul className="space-y-1.5 text-sm">
              {order.items.map((i) => (
                <li key={i.slug} className="flex justify-between gap-3">
                  <span className="truncate">{i.name} <span className="text-muted-foreground">× {i.quantity}</span></span>
                  <span className="font-mono">₹{i.priceValue * i.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
          {order.notes && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}