import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { getProduct, products } from "../lib/products";
import { useCart } from "../lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
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
        { property: "og:image", content: product.image },
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
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        priceValue: product.priceValue,
        image: product.image,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

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
              src={product.image}
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
            {product.servingSize && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {product.servingSize}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.longDescription}
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
                {product.ingredients.map((i: string) => (
                  <span
                    key={i}
                    className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">The Details</h2>
              <ul className="space-y-2">
                {product.details.map((d: string) => (
                  <li key={d} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
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
                    src={p.image}
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