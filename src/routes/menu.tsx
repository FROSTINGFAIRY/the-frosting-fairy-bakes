import { createFileRoute } from "@tanstack/react-router";
import cookieImg from "../assets/cookie.jpg";
import macaronImg from "../assets/macaron.jpg";
import lemonCakeImg from "../assets/lemon-cake.jpg";

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
      { name: "Bento Cakes", description: "Petite signature cream cake for one", price: "₹300", image: lemonCakeImg, imageAlt: "Bento cake" },
      { name: "Half Kg Cake", description: "Signature cream cake, half kilogram", price: "₹550" },
      { name: "Cupcakes", description: "Box of 6 — choose your flavours", price: "₹350", image: macaronImg, imageAlt: "Cupcakes" },
    ],
  },
  {
    category: "Brownies & Cookies",
    items: [
      { name: "Classic Brownies", description: "Box of 6 — fudgy chocolate squares", price: "₹300" },
      { name: "Brownies with Toppings", description: "Box of 6 — add your favourite topping", price: "₹350" },
      { name: "Cookies", description: "Box of 6 — soft-baked & buttery", price: "₹300", image: cookieImg, imageAlt: "Cookies" },
    ],
  },
  {
    category: "Cupcake Flavours",
    items: [
      { name: "Vanilla", description: "Classic vanilla bean cream", price: "—" },
      { name: "Choco Nutella", description: "Rich cocoa with Nutella swirl", price: "—" },
      { name: "Strawberry", description: "Fresh strawberry cream", price: "—" },
      { name: "Lemon", description: "Bright citrus with lemon curd", price: "—" },
      { name: "Red Velvet", description: "Cocoa sponge with cream cheese", price: "—" },
      { name: "Oreo", description: "Cookies & cream classic", price: "—" },
    ],
  },
  {
    category: "Choose Your Toppings",
    items: [
      { name: "Nutella", description: "Hazelnut cocoa spread", price: "—" },
      { name: "Pistachio", description: "Roasted & chopped", price: "—" },
      { name: "Triple Chocolate", description: "Dark, milk & white", price: "—" },
      { name: "KitKat", description: "Crunchy wafer pieces", price: "—" },
      { name: "Oreo", description: "Crushed cookie crumble", price: "—" },
      { name: "Lotus Biscoff", description: "Caramelised biscuit", price: "—" },
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
        </div>

        <div className="space-y-20">
          {menuItems.map((category) => (
            <div key={category.category} className="animate-reveal">
              <h2 className="font-display text-3xl italic mb-10 border-b border-border pb-4">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {category.items.map((item) => (
                  <div key={item.name} className="flex gap-4 group">
                    {item.image && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-200">
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
                        <h3 className="font-display text-lg">{item.name}</h3>
                        <span className="font-mono text-sm text-muted-foreground">{item.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
