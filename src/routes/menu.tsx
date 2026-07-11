import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import cookieImg from "../assets/cookie.jpg";
import macaronImg from "../assets/macaron.jpg";
import lemonCakeImg from "../assets/lemon-cake.jpg";
import { products as productsData } from "../lib/products";
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

const menuItems = [
  {
    category: "Cakes & Bakes",
    items: [
      { name: "Bento Cakes", description: "Petite signature cream cake for one", price: "₹300", image: lemonCakeImg, imageAlt: "Bento cake", slug: "bento-cake" },
      { name: "Half Kg Cake", description: "Signature cream cake, half kilogram", price: "₹550", slug: "half-kg-cake" },
      { name: "Cupcakes", description: "Box of 6 — choose your flavours", price: "₹350", image: macaronImg, imageAlt: "Cupcakes", slug: "cupcakes-box" },
    ],
  },
  {
    category: "Signature Cakes (by weight)",
    items: [
      { name: "Classic Vanilla", description: "Freshly baked with premium ingredients", price: "₹500 / ₹900" },
      { name: "Chocolate", description: "Rich cocoa sponge with chocolate cream", price: "₹550 / ₹950" },
      { name: "Strawberry", description: "Fresh strawberry cream & sponge", price: "₹600 / ₹1,000" },
      { name: "Pineapple Swirl", description: "Light sponge with pineapple cream", price: "₹600 / ₹1,000" },
      { name: "Butterscotch", description: "Caramel crunch throughout", price: "₹650 / ₹1,100" },
      { name: "Whipped Caramel", description: "Silky whipped caramel layers", price: "₹650 / ₹1,100" },
      { name: "Choco Truffle", description: "Decadent chocolate truffle", price: "₹650 / ₹1,100" },
      { name: "Lemon Cream Cheese", description: "Bright lemon with cream cheese", price: "₹700 / ₹1,300" },
    ],
  },
  {
    category: "Cupcakes (Box of 6)",
    items: [
      { name: "Classic Vanilla", description: "Vanilla bean buttercream", price: "₹350", image: macaronImg, imageAlt: "Vanilla cupcake" },
      { name: "Strawberry", description: "Fresh strawberry cream", price: "₹350" },
      { name: "Lemon", description: "Bright citrus with lemon curd", price: "₹380" },
      { name: "Red Velvet", description: "Cocoa sponge, cream cheese frosting", price: "₹400" },
      { name: "Oreo", description: "Cookies & cream classic", price: "₹400" },
      { name: "Choco Nutella", description: "Rich cocoa with Nutella swirl", price: "₹420" },
    ],
  },
  {
    category: "Brownies (Box of 6)",
    items: [
      { name: "Classic Brownie", description: "Fudgy chocolate squares", price: "₹300" },
      { name: "Oreo Brownie", description: "Topped with crushed Oreo", price: "₹370" },
      { name: "Nutella Brownie", description: "Swirled with Nutella", price: "₹380" },
      { name: "KitKat Brownie", description: "Topped with KitKat pieces", price: "₹390" },
      { name: "Triple Chocolate Brownie", description: "Dark, milk & white chocolate", price: "₹400" },
      { name: "Biscoff Brownie", description: "Caramelised Lotus Biscoff topping", price: "₹410" },
      { name: "Pistachio Brownie", description: "Roasted pistachio topping", price: "₹420" },
    ],
  },
  {
    category: "Cookies (Box of 6)",
    items: [
      { name: "Classic Choco Chip", description: "Soft-baked with chocolate chips", price: "₹250", image: cookieImg, imageAlt: "Choco chip cookies", slug: "classic-choco-chip" },
      { name: "Double Chocolate", description: "Cocoa dough with chocolate chunks", price: "₹300" },
      { name: "Dark Chocolate Chunks", description: "Rich dark chocolate throughout", price: "₹330" },
      { name: "M&M Cookies", description: "Loaded with colourful M&Ms", price: "₹330" },
      { name: "Red Velvet + White Choco", description: "Red velvet with white chocolate chips", price: "₹390" },
    ],
  },
  {
    category: "New Additions (Box of 6)",
    items: [
      { name: "Classic Vanilla Custard Bombolonies", description: "Filled with vanilla custard", price: "₹420" },
      { name: "Choco Hazelnut Bombolonies", description: "Filled with choco hazelnut cream", price: "₹460" },
      { name: "Strawberry Burst Bombolonies", description: "Bursting with strawberry filling", price: "₹480" },
      { name: "Classic Glazed Donuts", description: "Soft glazed rings", price: "₹420", slug: "glazed-donuts" },
      { name: "Caramel Glazed Donuts", description: "Rich caramel glaze", price: "₹460" },
      { name: "Cookies & Cream Donuts", description: "Topped with cookies & cream", price: "₹500" },
      { name: "Classic Sugar Glaze Cinnamon Rolls", description: "Warm cinnamon, sugar glaze", price: "₹400", slug: "cinnamon-rolls" },
      { name: "Condensed Milk Glaze Cinnamon Rolls", description: "Sweet condensed milk drizzle", price: "₹440" },
      { name: "Cream Cheese Glaze Cinnamon Rolls", description: "Tangy cream cheese frosting", price: "₹480" },
    ],
  },
];

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
                      {"slug" in item && item.slug && (
                        <span className="mt-1 inline-block font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                          View Details →
                        </span>
                      )}
                    </div>
                    </div>
                  );
                  if ("slug" in item && item.slug) {
                    return (
                      <Link
                        key={item.name}
                        to="/product/$slug"
                        params={{ slug: item.slug }}
                        className="block"
                      >
                        {inner}
                      </Link>
                    );
                  }
                  return <div key={item.name}>{inner}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
