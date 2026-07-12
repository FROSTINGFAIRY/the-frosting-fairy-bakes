import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useCart } from "../lib/cart";
import { fetchMenuItemBySlug, fetchMenuItems, type MenuItemRow } from "../lib/menu-api";
import placeholderImg from "../assets/cookie.jpg";

const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["menu-item", slug],
    queryFn: () => fetchMenuItemBySlug(slug),
  });

const menuQueryOptions = queryOptions({
  queryKey: ["menu-items"],
  queryFn: fetchMenuItems,
});

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.slug));
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — The Frosting Fairy" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — The Frosting Fairy` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — The Frosting Fairy` },
        { property: "og:description", content: product.description },
        ...(product.image_url ? [{ property: "og:image", content: product.image_url }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Missing Item</p>
        <h1 className="font-display text-4xl italic mb-4">We couldn&apos;t find that treat</h1>
        <Link to="/menu" className="inline-block mt-4 rounded-full border border-foreground px-5 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all">
          Back to Menu
        </Link>
      </div>
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useQuery(productQueryOptions(slug));
  const { data: allItems = [] } = useQuery(menuQueryOptions);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const image = product.image_url || placeholderImg;

  const handleAdd = () => {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        priceValue: product.price_value,
        image,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const related: MenuItemRow[] = allItems
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  return (
    <main className="px-6 py-16 max-w-7xl mx-auto">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="animate-reveal">
          <div className="relative overflow-hidden rounded-3xl bg-muted ring-1 ring-accent/15 aspect-square">
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute top-5 left-5 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              {product.category}
            </span>
          </div>
        </div>

        <div className="animate-reveal lg:sticky lg:top-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
            Fresh · Small Batch
          </p>
          <h1 className="font-display text-4xl md:text-5xl italic mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-display text-3xl">{product.price}</span>
            {product.serving_size && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {product.serving_size}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.long_description || product.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:text-accent transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-mono text-sm w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 hover:text-accent transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-3.5 px-6 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground transition-all"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Basket
                </>
              )}
            </button>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-10">
            Please order at least 2 days in advance
          </p>

          <div className="space-y-6 border-t border-border pt-8">
            <section>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {(product.ingredients ?? []).map((i: string) => (
                  <span
                    key={i}
                    className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    {i}
                  </span>
                ))}
                {(!product.ingredients || product.ingredients.length === 0) && (
                  <span className="text-xs text-muted-foreground">Freshly baked with premium ingredients.</span>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">The Details</h2>
              <ul className="space-y-2">
                {(product.details ?? []).map((d: string) => (
                  <li key={d} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
                {(!product.details || product.details.length === 0) && (
                  <li className="text-sm text-muted-foreground">Baked fresh the morning of pickup · Please order 2 days in advance.</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t border-border pt-16">
          <h2 className="font-display text-3xl italic mb-10">You might also love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted mb-4">
                  <img
                    src={p.image_url || placeholderImg}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-display text-lg">{p.name}</h3>
                  <span className="font-mono text-sm text-muted-foreground">{p.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}