import cookieImg from "../assets/cookie.jpg";
import macaronImg from "../assets/macaron.jpg";
import lemonCakeImg from "../assets/lemon-cake.jpg";
import brownieImg from "../assets/brownie.jpg";
import cinnamonRollImg from "../assets/cinnamon-roll.jpg";
import { getMenuItem } from "./menu-items";

export type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  priceValue: number;
  image: string;
  ingredients: string[];
  details: string[];
  servingSize?: string;
};

export const products: Product[] = [
  {
    slug: "bento-cake",
    name: "Bento Cake",
    category: "Cakes & Bakes",
    description: "Petite signature cream cake for one",
    longDescription:
      "Our signature Bento Cake is a beautifully personal treat — a mini cream cake designed for one, hand-piped with soft buttercream florals and a sweet little message. Perfect for surprises, solo celebrations, or simply because.",
    price: "₹300",
    priceValue: 300,
    image: lemonCakeImg,
    servingSize: "Serves 1–2",
    ingredients: ["Freshly whipped cream", "Vanilla sponge", "Pure vanilla bean", "European butter", "Free-range eggs"],
    details: [
      "Baked fresh the morning of pickup",
      "Comes in a keepsake bento-style box",
      "Custom short message included (up to 15 characters)",
      "Please order at least 2 days in advance",
    ],
  },
  {
    slug: "half-kg-cake",
    name: "Half Kg Signature Cake",
    category: "Cakes & Bakes",
    description: "Signature cream cake, half kilogram",
    longDescription:
      "A generous half-kilo of our signature cream cake — light sponge layers folded with silky whipped cream and finished with a soft, elegant hand-frosting. Choose your flavour when you order.",
    price: "₹550",
    priceValue: 550,
    image: lemonCakeImg,
    servingSize: "Serves 4–6",
    ingredients: ["Whipped cream", "Sponge (vanilla, chocolate, or seasonal)", "European butter", "Cane sugar", "Fresh eggs"],
    details: [
      "Choose your flavour at checkout",
      "Simple hand-finished styling",
      "Baked the morning of pickup",
      "Please order at least 2 days in advance",
    ],
  },
  {
    slug: "cupcakes-box",
    name: "Cupcakes (Box of 6)",
    category: "Cupcakes",
    description: "Box of 6 — choose your flavours",
    longDescription:
      "A curated box of six of our small-batch cupcakes, hand-piped with silky buttercream. Mix and match your favourite flavours — vanilla bean, strawberry, lemon, red velvet, Oreo, or choco Nutella.",
    price: "₹350",
    priceValue: 350,
    image: macaronImg,
    servingSize: "6 cupcakes",
    ingredients: ["Fresh cream", "European butter", "Cane sugar", "Free-range eggs", "Real vanilla"],
    details: [
      "Mix and match flavours",
      "Packaged in a signature bakery box",
      "Best enjoyed within 24 hours",
      "Baked the morning of pickup",
    ],
  },
  {
    slug: "classic-choco-chip",
    name: "Classic Choco Chip Cookies",
    category: "Cookies",
    description: "Soft-baked with chocolate chips (Box of 6)",
    longDescription:
      "Soft in the middle, golden at the edges, and packed with pools of melting chocolate. Our classic choco chip cookie is baked in small batches so every cookie is fresh, buttery, and just the right kind of chewy.",
    price: "₹250",
    priceValue: 250,
    image: cookieImg,
    servingSize: "6 cookies",
    ingredients: ["European butter", "Brown sugar", "Semi-sweet chocolate chips", "Free-range eggs", "Unbleached flour", "Sea salt"],
    details: [
      "Soft-baked, thick and chewy",
      "Packaged in a bakery box of 6",
      "Best within 3 days",
      "Contains dairy, eggs, gluten",
    ],
  },
  {
    slug: "classic-brownie",
    name: "Classic Fudgy Brownies",
    category: "Brownies",
    description: "Fudgy chocolate squares (Box of 6)",
    longDescription:
      "Dense, fudgy, and deeply chocolatey — our classic brownies have a crackle-top crust and a molten centre. Made with real dark chocolate and European butter, they're everything a brownie should be.",
    price: "₹300",
    priceValue: 300,
    image: brownieImg,
    servingSize: "6 brownies",
    ingredients: ["70% dark chocolate", "European butter", "Cane sugar", "Free-range eggs", "Unbleached flour", "Cocoa powder"],
    details: [
      "Dense, fudgy centre",
      "Signature crackle top",
      "Best within 4 days",
      "Contains dairy, eggs, gluten",
    ],
  },
  {
    slug: "glazed-donuts",
    name: "Classic Glazed Donuts",
    category: "New Additions",
    description: "Soft glazed rings (Box of 6)",
    longDescription:
      "Pillowy brioche-style donuts, hand-glazed and finished with a delicate sugar shell that cracks softly with each bite. Made fresh — never fried in advance.",
    price: "₹420",
    priceValue: 420,
    image: macaronImg,
    servingSize: "6 donuts",
    ingredients: ["Brioche dough", "European butter", "Vanilla glaze", "Cane sugar", "Free-range eggs"],
    details: [
      "Fried fresh the morning of pickup",
      "Best enjoyed same day",
      "Packaged in a bakery box of 6",
      "Contains dairy, eggs, gluten",
    ],
  },
  {
    slug: "cinnamon-rolls",
    name: "Sugar Glaze Cinnamon Rolls",
    category: "New Additions",
    description: "Warm cinnamon, sugar glaze (Box of 6)",
    longDescription:
      "Soft, buttery cinnamon rolls swirled with brown sugar and warm spice, finished with a classic sugar glaze that soaks into every layer. Comfort in a box.",
    price: "₹400",
    priceValue: 400,
    image: cinnamonRollImg,
    servingSize: "6 rolls",
    ingredients: ["Enriched brioche dough", "Ceylon cinnamon", "Brown sugar", "European butter", "Vanilla sugar glaze"],
    details: [
      "Best warmed slightly before serving",
      "Baked the morning of pickup",
      "Best within 2 days",
      "Contains dairy, eggs, gluten",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  const direct = products.find((p) => p.slug === slug);
  if (direct) return direct;
  const item = getMenuItem(slug);
  if (!item) return undefined;
  const priceValue = Number(item.price.replace(/[^0-9]/g, "").slice(0, item.price.includes("/") ? Math.floor(item.price.replace(/[^0-9]/g, "").length / 2) : undefined)) || 0;
  return {
    slug: item.slug,
    name: item.name,
    category: item.category,
    description: item.description,
    longDescription: `${item.name} — ${item.description}. Baked fresh in small batches the morning of pickup.`,
    price: item.price,
    priceValue,
    image: item.image ?? cookieImg,
    servingSize: item.category.includes("Box of 6") ? "6 pieces" : undefined,
    ingredients: ["European butter", "Free-range eggs", "Cane sugar", "Real vanilla", "Unbleached flour"],
    details: [
      "Baked fresh the morning of pickup",
      "Packaged in a signature bakery box",
      "Please order at least 2 days in advance",
      "Contains dairy, eggs, gluten",
    ],
  };
}