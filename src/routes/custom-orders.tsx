import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/custom-orders")({
  head: () => ({
    meta: [
      { title: "Custom Orders — The Frosting Fairy" },
      { name: "description", content: "Order custom cakes, cupcakes, and treats for weddings, birthdays, and special occasions." },
      { property: "og:title", content: "Custom Orders — The Frosting Fairy" },
      { property: "og:description", content: "Order custom cakes, cupcakes, and treats for weddings, birthdays, and special occasions." },
    ],
  }),
  component: CustomOrdersPage,
});

function CustomOrdersPage() {
  return (
    <main>
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-20 animate-reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            Made Just for You
          </p>
          <h1 className="font-display text-5xl md:text-7xl italic mb-6">
            Custom Orders
          </h1>
          <p className="max-w-lg mx-auto text-muted-foreground leading-relaxed">
            Whether it&apos;s a birthday, wedding, or just because — we love creating something uniquely yours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 animate-reveal">
          <div className="space-y-8">
            <h2 className="font-display text-3xl italic">How It Works</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-display text-lg text-foreground mb-2">1. Get in Touch</h3>
                <p>Reach out at least two weeks before your event. For weddings, we recommend three months in advance.</p>
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground mb-2">2. Share Your Vision</h3>
                <p>Tell us about flavors, colors, themes, and any dietary needs. We love Pinterest boards and inspiration photos.</p>
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground mb-2">3. Taste &amp; Design</h3>
                <p>We&apos;ll schedule a consultation to sample flavors and finalize the design together.</p>
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground mb-2">4. Pick Up &amp; Enjoy</h3>
                <p>Your creation will be ready for pickup on the morning of your event, fresh and beautiful.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="font-display text-3xl italic">Pricing Guide</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="font-display text-lg">Cupcakes (dozen)</span>
                <span className="font-mono">$48 &ndash; $72</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="font-display text-lg">6&Prime; Celebration Cake</span>
                <span className="font-mono">$85 &ndash; $120</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="font-display text-lg">8&Prime; Celebration Cake</span>
                <span className="font-mono">$140 &ndash; $200</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="font-display text-lg">Tiered Wedding Cake</span>
                <span className="font-mono">From $350</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="font-display text-lg">Cookie Favor Boxes</span>
                <span className="font-mono">$6 &ndash; $12 each</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="font-display text-lg">Macaron Towers</span>
                <span className="font-mono">From $150</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Final pricing depends on design complexity, flavors, and size. We&apos;re happy to work within your budget.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center animate-reveal">
          <h2 className="font-display text-3xl italic mb-6">Ready to Order?</h2>
          <p className="text-muted-foreground mb-8">
            Email us with your event details and we&apos;ll get back to you within 48 hours.
          </p>
          <a
            href="mailto:hello@frostingfairy.com"
            className="inline-flex items-center gap-3 px-8 py-3 border border-foreground rounded-full text-sm font-medium hover:bg-foreground hover:text-background transition-all duration-300"
          >
            hello@frostingfairy.com
          </a>
        </div>
      </section>
    </main>
  );
}
