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
    category: "Pastries",
    items: [
      { name: "Salted Toffee Cloud", description: "Brown butter & hand-pulled toffee", price: "$4.50", image: cookieImg, imageAlt: "Salted toffee cookie" },
      { name: "Wild Rose Macaron", description: "Infused with local garden petals", price: "$3.75", image: macaronImg, imageAlt: "Pink rose macarons" },
      { name: "Honey-Glazed Croissant", description: "48-hour laminated dough with wildflower honey", price: "$5.50" },
      { name: "Burnt Lemon Meringue", description: "Tart citrus curd with torched meringue", price: "$6.25" },
    ],
  },
  {
    category: "Cakes",
    items: [
      { name: "Zesty Lemon Tower", description: "Triple-layered with citrus curd", price: "$7.00", image: lemonCakeImg, imageAlt: "Lemon layer cake" },
      { name: "Vanilla Bean Dream", description: "Madagascar vanilla bean frosting", price: "$6.50" },
      { name: "Chocolate Midnight", description: "Dark ganache with sea salt", price: "$7.50" },
      { name: "Carrot & Walnut", description: "Spiced carrot with cream cheese frosting", price: "$6.00" },
    ],
  },
  {
    category: "Cookies & Bars",
    items: [
      { name: "Oatmeal Brown Butter", description: "Toasted oats with browned butter", price: "$3.50" },
      { name: "Lavender Shortbread", description: "Fragrant lavender from the garden", price: "$3.25" },
      { name: "Pecan Blondie", description: "Chewy caramel pecan square", price: "$4.00" },
      { name: "Ginger Molasses", description: "Soft & spiced with crystallized ginger", price: "$3.50" },
    ],
  },
  {
    category: "Seasonal",
    items: [
      { name: "Peach Cobbler Muffin", description: "Fresh peaches with oat crumble", price: "$4.25" },
      { name: "Blueberry Lavender Scone", description: "Local berries with dried lavender", price: "$4.50" },
      { name: "Strawberry Rhubarb Tart", description: "Flaky pastry with seasonal fruit", price: "$6.75" },
      { name: "Honey-Lavender Crumb", description: "Spring specialty with local honey", price: "$5.00" },
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
