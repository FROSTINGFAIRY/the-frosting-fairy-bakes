import type { CartItem } from "./cart";
import { supabase } from "@/integrations/supabase/client";
import type { ShippingAddress } from "./address";

export type Customer = { name: string; phone: string; email?: string; notes?: string };
export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  customer: Customer;
  shippingAddress?: ShippingAddress;
  status: "pending" | "paid";
};

const KEY = "frosting-fairy-orders-v1";
const PENDING = "frosting-fairy-pending-order";

function readAll(): Order[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function writeAll(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export async function createOrder(
  items: CartItem[],
  customer: Customer,
  total: number,
  shippingAddress?: ShippingAddress,
): Promise<Order> {
  const id = `FF-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    items,
    subtotal: total,
    total,
    customer,
    shippingAddress,
    status: "pending",
  };
  // Persist to the database so the owner can see it in /admin/orders.
  const { error } = await supabase.from("orders").insert({
    order_code: id,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_email: customer.email || null,
    notes: customer.notes || null,
    items: JSON.parse(JSON.stringify(items)),
    total,
    status: "pending",
    shipping_address: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : null,
  });
  if (error) throw new Error(error.message);
  const all = readAll();
  all.push(order);
  writeAll(all);
  localStorage.setItem(PENDING, id);
  return order;
}

export function getOrder(id: string): Order | null {
  return readAll().find((o) => o.id === id) ?? null;
}

export function markOrderPaidLocal(id: string) {
  const all = readAll();
  const idx = all.findIndex((o) => o.id === id);
  if (idx >= 0) { all[idx].status = "paid"; writeAll(all); }
  localStorage.removeItem(PENDING);
}

export function getPendingOrderId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PENDING);
}