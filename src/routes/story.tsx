import { createFileRoute } from "@tanstack/react-router";
import bakerImg from "../assets/baker.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — The Frosting Fairy" },
      { name: "description", content: "How The Frosting Fairy bakery was born from a tiny kitchen and a love for the perfect crumb." },
      { property: "og:title", content: "Our Story — The Frosting Fairy" },
      { property: "og:description", content: "How The Frosting Fairy bakery was born from a tiny kitchen and a love for the perfect crumb." },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <main>
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            A Family Tradition
          </p>
          <h1 className="font-display text-5xl md:text-7xl italic mb-8">
            Our Story
          </h1>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start animate-reveal">
          <div className="md:col-span-5 md:sticky md:top-24">
            <div className="aspect-[3/4] w-full rounded-lg overflow-hidden">
              <img
                src={bakerImg}
                alt="Baker in a cozy sunlit kitchen dusting fresh muffins"
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={1200}
              />
            </div>
          </div>
          <div className="md:col-span-7 space-y-8 text-muted-foreground leading-relaxed">
            <p className="font-display italic text-foreground text-2xl">
              &ldquo;It started in a tiny kitchen with a single whisk and a very messy dream.&rdquo;
            </p>
            <p>
              The Frosting Fairy was born from Clara&apos;s obsession with the perfect crumb. After years of perfecting family recipes and testing every butter under the sun, she opened her doors to share that warmth with the neighborhood.
            </p>
            <p>
              Every morning at 4 AM, the ovens come to life. We don&apos;t use shortcuts, preservatives, or anything you can&apos;t pronounce. Just sugar, flour, and that elusive spark of magic.
            </p>
            <p>
              What began as weekend experiments for friends quickly grew into a cottage bakery beloved by locals. Clara&apos;s grandmother&apos;s handwritten recipe cards, stained with decades of use, still sit on the kitchen shelf — each one a reminder that the best things take time.
            </p>
            <p>
              Today, The Frosting Fairy remains a one-woman operation with an occasional helping hand from her sister, Maria. Every treat that leaves the kitchen has been mixed, shaped, baked, and decorated by hand. We source our flour from a heritage mill three towns over, our eggs from a free-range farm down the road, and our berries from the farmers market every Saturday morning.
            </p>
            <p className="font-display italic text-foreground text-xl">
              Stay sweet, <br />Clara
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
