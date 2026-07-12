import { supabase } from "@/integrations/supabase/client";

export type MenuItemRow = {
  id: string;
  slug: string;
  category: string;
  category_order: number;
  sort_order: number;
  name: string;
  description: string;
  long_description: string | null;
  price: string;
  price_value: number;
  image_url: string | null;
  serving_size: string | null;
  ingredients: string[];
  details: string[];
  available: boolean;
};

export type MenuCategory = {
  category: string;
  categoryOrder: number;
  items: MenuItemRow[];
};

export async function fetchMenuItems(): Promise<MenuItemRow[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("category_order", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MenuItemRow[];
}

export async function fetchAllMenuItemsForAdmin(): Promise<MenuItemRow[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category_order", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MenuItemRow[];
}

export async function fetchMenuItemBySlug(slug: string): Promise<MenuItemRow | null> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as MenuItemRow | null;
}

export function groupByCategory(items: MenuItemRow[]): MenuCategory[] {
  const map = new Map<string, MenuCategory>();
  for (const item of items) {
    const existing = map.get(item.category);
    if (existing) existing.items.push(item);
    else map.set(item.category, { category: item.category, categoryOrder: item.category_order, items: [item] });
  }
  return [...map.values()].sort((a, b) => a.categoryOrder - b.categoryOrder);
}