import cookieImg from "../assets/cookie.jpg";
import macaronImg from "../assets/macaron.jpg";
import lemonCakeImg from "../assets/lemon-cake.jpg";
import brownieImg from "../assets/brownie.jpg";
import cinnamonRollImg from "../assets/cinnamon-roll.jpg";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  slug: string;
  image?: string;
  imageAlt?: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Default category image fallback
const categoryImage: Record<string, string> = {
  "Cakes & Bakes": lemonCakeImg,
  "Signature Cakes (by weight)": lemonCakeImg,
  "Cupcakes (Box of 6)": macaronImg,
  "Brownies (Box of 6)": brownieImg,
  "Cookies (Box of 6)": cookieImg,
  "New Additions (Box of 6)": macaronImg,
};

const raw: { category: string; items: Omit<MenuItem, "slug" | "image"> & { slug?: string; image?: string; imageAlt?: string }[] extends never ? never : Array<{ name: string; description: string; price: string; slug?: string; image?: string; imageAlt?: string }> }[] = [
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
      { name: "Classic Brownie", description: "Fudgy chocolate squares", price: "₹300", image: brownieImg, imageAlt: "Classic brownie", slug: "classic-brownie" },
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
      { name: "Classic Sugar Glaze Cinnamon Rolls", description: "Warm cinnamon, sugar glaze", price: "₹400", image: cinnamonRollImg, imageAlt: "Cinnamon rolls", slug: "cinnamon-rolls" },
      { name: "Condensed Milk Glaze Cinnamon Rolls", description: "Sweet condensed milk drizzle", price: "₹440", image: cinnamonRollImg },
      { name: "Cream Cheese Glaze Cinnamon Rolls", description: "Tangy cream cheese frosting", price: "₹480", image: cinnamonRollImg },
    ],
  },
];

export const menuCategories: MenuCategory[] = raw.map((c) => ({
  category: c.category,
  items: c.items.map((it) => ({
    ...it,
    slug: it.slug ?? slugify(`${c.category}-${it.name}`),
    image: it.image ?? categoryImage[c.category],
  })),
}));

export const allMenuItems: (MenuItem & { category: string })[] = menuCategories.flatMap((c) =>
  c.items.map((i) => ({ ...i, category: c.category })),
);

export function getMenuItem(slug: string) {
  return allMenuItems.find((i) => i.slug === slug);
}