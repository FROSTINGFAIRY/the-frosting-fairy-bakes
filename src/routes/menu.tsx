import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { products as productsData } from "../lib/products";
import { menuCategories } from "../lib/menu-items";
import board1 from "../assets/menu-boards-v2/07.13.22.jpeg.asset.json";
import board2 from "../assets/menu-boards-v2/07.13.25.jpeg.asset.json";
import board3 from "../assets/menu-boards-v2/07.13.24_1.jpeg.asset.json";
import board4 from "../assets/menu-boards-v2/07.13.23_1.jpeg.asset.json";
import board5 from "../assets/menu-boards-v2/07.13.24_2.jpeg.asset.json";
import board6 from "../assets/menu-boards-v2/07.13.24.jpeg.asset.json";
import board7 from "../assets/menu-boards-v2/07.13.25_1.jpeg.asset.json";
import board8 from "../assets/menu-boards-v2/07.13.23.jpeg.asset.json";

const menuBoards = [
  { src: board1.url, alt: "Full menu with pricing" },
  { src: board2.url, alt: "Cupcake menu" },
  { src: board3.url, alt: "Cupcake flavours" },
  { src: board4.url, alt: "Cake flavours menu" },
  { src: board5.url, alt: "Brownie menu" },
  { src: board6.url, alt: "Cookie menu" },
  { src: board7.url, alt: "Cake price list" },
  { src: board8.url, alt: "New additions — donuts, bombolonies & cinnamon rolls" },
];

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — The Frosting Fairy" },
      { name: "description", content: "Browse our daily selection of handmade pastries, cakes, cookies, and seasonal treats." },
      { property: "og:title", content: "Menu — The Frosting Fairy" },
      { property: "og:description", content: "Browse our daily selection of handmade pastries, cakes, cookies, and seasonal treats." },
    ],
  }),
  component: MenuPage,
});

const menuItems = menuCategories;

function MenuPage() {
  return (
    <main>
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            Fresh Daily
          </p>
          <h1 className="font-display text-5xl md:text-7xl italic mb-6">
            The Menu
          </h1>
          <p className="max-w-lg mx-auto text-muted-foreground leading-relaxed">
            Everything is baked in small batches each morning. When the display case is empty, we&apos;re sold out until tomorrow.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Orders taken 2 days in advance · Custom-designed & fondant cakes currently unavailable
          </p>
        </div>

        <div className="mb-20 animate-reveal">
          <h2 className="font-display text-3xl italic mb-8 text-center">Our Menu Boards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuBoards.map((b) => (
              <a
                key={b.src}
                href={b.src}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden bg-muted ring-1 ring-accent/15 hover:ring-accent/40 transition"
              >
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover object-top"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mb-16 animate-reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4 text-center">
            Featured · Shop Online
          </p>
          <h2 className="font-display text-3xl italic mb-10 text-center">Order in a click</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "bento-cake",
              "cupcakes-box",
              "classic-choco-chip",
              "classic-brownie",
              "glazed-donuts",
              "cinnamon-rolls",
            ].map((slug) => {
              const p = productsData.find((x) => x.slug === slug);
              if (!p) return null;
              return (
                <Link
                  key={p.slug}
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  className="group block rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-accent/40 transition"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-display text-lg">{p.name}</h3>
                      <span className="font-mono text-sm text-muted-foreground">{p.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-accent group-hover:text-foreground transition-colors">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-20">
          {menuItems.map((category) => (
            <div key={category.category} className="animate-reveal">
              <h2 className="font-display text-3xl italic mb-10 border-b border-border pb-4">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {category.items.map((item) => {
                  const inner = (
                    <div className="flex gap-4 group">
                    {item.image && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                        <img
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={80}
                          height={80}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-display text-lg group-hover:text-accent transition-colors">{item.name}</h3>
                        <span className="font-mono text-sm text-muted-foreground">{item.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <span className="mt-1 inline-block font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                        View Details →
                      </span>
                    </div>
                    </div>
                  );
                  return (
                    <Link
                      key={item.slug}
                      to="/product/$slug"
                      params={{ slug: item.slug }}
                      className="block"
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
