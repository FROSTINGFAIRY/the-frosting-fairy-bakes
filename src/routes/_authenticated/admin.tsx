import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllMenuItemsForAdmin,
  groupByCategory,
  type MenuItemRow,
} from "@/lib/menu-api";
import {
  updateMenuItem,
  uploadMenuItemImage,
  generateMenuItemImage,
} from "@/lib/admin.functions";
import { Loader2, LogOut, Sparkles, Upload, Save, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — The Frosting Fairy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-menu-items"],
    queryFn: fetchAllMenuItemsForAdmin,
  });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Verify admin role
  useMemo(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setIsAdmin(false);
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      setIsAdmin(!!roleRows?.some((r) => r.role === "admin"));
    });
  }, []);

  const grouped = useMemo(() => groupByCategory(items), [items]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === false) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h1 className="font-display text-3xl italic">You&apos;re signed in, but not an admin</h1>
        <p className="text-muted-foreground max-w-md">
          Only the bakery owner can edit menu items. Ask the owner to grant you admin access.
        </p>
        <button onClick={signOut} className="rounded-full border border-foreground px-5 py-2 text-[10px] uppercase tracking-widest font-bold">
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Owner Dashboard</p>
          <h1 className="font-display text-4xl italic">Manage your menu</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Edit prices, upload photos, or auto-generate a product photo for any item.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/menu"
            className="rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition"
          >
            View site
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </div>

      {isLoading || isAdmin === null ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-14">
          {grouped.map((cat) => (
            <section key={cat.category}>
              <h2 className="font-display text-2xl italic mb-6 border-b border-border pb-3">{cat.category}</h2>
              <div className="space-y-4">
                {cat.items.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function ItemRow({ item }: { item: MenuItemRow }) {
  const qc = useQueryClient();
  const update = useServerFn(updateMenuItem);
  const upload = useServerFn(uploadMenuItemImage);
  const generate = useServerFn(generateMenuItemImage);

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [priceValue, setPriceValue] = useState(String(item.price_value));
  const [saved, setSaved] = useState(false);

  const savePatch = useMutation({
    mutationFn: () =>
      update({
        data: {
          id: item.id,
          patch: {
            name,
            description,
            price,
            price_value: Number(priceValue) || 0,
          },
        },
      }),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      qc.invalidateQueries({ queryKey: ["admin-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(`Saved “${name}”`);
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const generateImg = useMutation({
    mutationFn: () =>
      generate({
        data: {
          id: item.id,
          slug: item.slug,
          name: item.name,
          description: item.description,
          category: item.category,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("New photo generated");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Generation failed"),
  });

  const uploadImg = useMutation({
    mutationFn: async (file: File) => {
      const buf = await file.arrayBuffer();
      // Convert to base64
      let binary = "";
      const bytes = new Uint8Array(buf);
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const base64 = btoa(binary);
      return upload({
        data: {
          id: item.id,
          slug: item.slug,
          base64,
          contentType: file.type || "image/png",
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Photo uploaded");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Upload failed"),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 items-start rounded-2xl border border-border p-4 bg-card">
      <div className="relative aspect-square w-full md:w-[120px] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground text-center px-2">No photo</span>
        )}
        {(generateImg.isPending || uploadImg.isPending) && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-display italic"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Display price</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
            placeholder="₹300"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Cart price (number)</span>
          <input
            type="number"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
          />
        </label>
      </div>

      <div className="flex flex-row md:flex-col gap-2 md:w-40">
        <button
          onClick={() => savePatch.mutate()}
          disabled={savePatch.isPending}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background px-3 py-2 text-[10px] uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-accent hover:text-accent-foreground transition"
        >
          {saved ? <><Check className="h-3 w-3" /> Saved</> : savePatch.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3" /> Save</>}
        </button>
        <button
          onClick={() => generateImg.mutate()}
          disabled={generateImg.isPending}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-[10px] uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-muted transition"
          title="Auto-generate an AI photo"
        >
          <Sparkles className="h-3 w-3" /> AI photo
        </button>
        <label className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-muted transition">
          <Upload className="h-3 w-3" /> Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImg.mutate(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}