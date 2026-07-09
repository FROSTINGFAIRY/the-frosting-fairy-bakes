import { createFileRoute, Link } from "@tanstack/react-router";
import heroCupcakes from "../assets/hero-cupcakes.jpg";
import cookieImg from "../assets/cookie.jpg";
import macaronImg from "../assets/macaron.jpg";
import lemonCakeImg from "../assets/lemon-cake.jpg";
import bakerImg from "../assets/baker.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Soft pink background wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-background to-accent/[0.07]" />
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[80px]" />

        <div className="relative px-6 py-16 md:py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Handmade in small batches
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl italic leading-[0.9] text-balance mb-8 animate-swipe">
              Baking magic into every <span className="text-accent">single bite.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground leading-relaxed mb-10">
              Warm ovens, vanilla-scented air, and the gentle dusting of sugar. We believe the best treats are made with love, butter, and a sprinkle of fairy dust.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary-foreground rounded-full font-display italic text-lg shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Explore the menu
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                to="/visit"
                className="group inline-flex items-center gap-3 px-6 py-4 font-display italic text-lg text-foreground/80 hover:text-foreground transition-colors"
              >
                Plan your visit
                <span className="h-px w-8 bg-foreground/40 group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
              </Link>
            </div>
          </div>
          <div className="relative animate-reveal" style={{ animationDelay: "200ms" }}>
            <div className="aspect-[4/5] w-full bg-accent/5 rounded-t-[200px] rounded-b-lg overflow-hidden ring-1 ring-accent/10 ring-offset-4 ring-offset-background">
              <img
                src={heroCupcakes}
                alt="Artisanal cupcakes with pastel frosting and edible flowers"
                className="w-full h-full object-cover"
                width={1200}
                height={1500}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background/80 backdrop-blur-sm p-6 border border-accent/15 rounded-2xl shadow-sm max-w-[220px]">
              <p className="font-mono text-[9px] uppercase tracking-tighter mb-2 text-accent">Batch No. 402</p>
              <p className="text-sm italic font-display text-foreground">&ldquo;The Honey-Lavender Sprinkled Crumb is back for spring.&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Treats */}
      <section className="px-6 py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 animate-reveal">
            <h2 className="font-display text-4xl italic">Today&apos;s Favourites</h2>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Updated 06:00 AM</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link to="/menu" className="group animate-reveal" style={{ animationDelay: "100ms" }}>
          <div className="overflow-hidden rounded-2xl mb-6 bg-muted aspect-square">
                <img
                  src={cookieImg}
                  alt="Salted toffee cloud cookie"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl mb-1">Salted Toffee Cloud</h3>
                  <p className="text-xs text-muted-foreground">Brown butter &amp; hand-pulled toffee</p>
                </div>
                <span className="font-mono text-sm">$4.50</span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/menu" className="group animate-reveal" style={{ animationDelay: "200ms" }}>
          <div className="overflow-hidden rounded-2xl mb-6 bg-muted aspect-square">
                <img
                  src={macaronImg}
                  alt="Wild rose macaron stack"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl mb-1">Wild Rose Macaron</h3>
                  <p className="text-xs text-muted-foreground">Infused with local garden petals</p>
                </div>
                <span className="font-mono text-sm">$3.75</span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/menu" className="group animate-reveal" style={{ animationDelay: "300ms" }}>
          <div className="overflow-hidden rounded-2xl mb-6 bg-muted aspect-square">
                <img
                  src={lemonCakeImg}
                  alt="Zesty lemon tower cake"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl mb-1">Zesty Lemon Tower</h3>
                  <p className="text-xs text-muted-foreground">Triple-layered with citrus curd</p>
                </div>
                <span className="font-mono text-sm">$7.00</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center animate-reveal">
          <div className="md:col-span-5">
            <div className="aspect-[3/4] w-full rounded-lg overflow-hidden">
              <img
                src={bakerImg}
                alt="Baker dusting muffins with powdered sugar in a cozy kitchen"
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={1200}
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <h2 className="font-display text-4xl italic mb-6 text-pretty">
              &ldquo;It started in a tiny kitchen with a single whisk and a very messy dream.&rdquo;
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                The Frosting Fairy was born from Clara&apos;s obsession with the perfect crumb. After years of perfecting family recipes and testing every butter under the sun, she opened her doors to share that warmth with the neighborhood.
              </p>
              <p>
                Every morning at 4 AM, the ovens come to life. We don&apos;t use shortcuts, preservatives, or anything you can&apos;t pronounce. Just sugar, flour, and that elusive spark of magic.
              </p>
              <p className="font-display italic text-foreground text-xl">
                Stay sweet, <br />Clara
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/story"
                className="group inline-flex items-center gap-3 font-display italic text-lg"
              >
                Read our full story
                <span className="h-px w-8 bg-foreground group-hover:w-12 transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 py-24 border-t border-border">
        <div className="max-w-7xl mx-auto text-center animate-reveal">
          <h2 className="font-display text-5xl italic mb-8">Visit the Fairy</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4 text-accent">Find Us</p>
              <p className="text-lg">122 Willow Creek Lane<br />Sweetsville, NY 10012</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4 text-accent">Hours</p>
              <p className="text-lg">Tues &ndash; Sat: 8am &ndash; 4pm<br />Sun: 9am &ndash; 2pm</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4 text-accent">Say Hello</p>
              <p className="text-lg">hello@frostingfairy.com<br />(555) 012-3456</p>
            </div>
          </div>
          <div className="mt-12">
            <Link
              to="/visit"
              className="inline-flex items-center gap-3 px-6 py-3 border border-foreground rounded-full text-sm font-medium hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
