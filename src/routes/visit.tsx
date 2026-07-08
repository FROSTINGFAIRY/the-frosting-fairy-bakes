import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us — The Frosting Fairy" },
      { name: "description", content: "Find The Frosting Fairy bakery in Sweetsville, NY. Hours, location, and contact information." },
      { property: "og:title", content: "Visit Us — The Frosting Fairy" },
      { property: "og:description", content: "Find The Frosting Fairy bakery in Sweetsville, NY. Hours, location, and contact information." },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  return (
    <main>
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            Come Say Hello
          </p>
          <h1 className="font-display text-5xl md:text-7xl italic mb-8">
            Visit the Fairy
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 animate-reveal">
          <div className="space-y-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4 text-accent">Location</p>
              <p className="text-2xl font-display mb-2">122 Willow Creek Lane</p>
              <p className="text-lg text-muted-foreground">Sweetsville, NY 10012</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4 text-accent">Hours</p>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>Tuesday &ndash; Saturday</span>
                  <span className="text-muted-foreground">8:00 AM &ndash; 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">9:00 AM &ndash; 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4 text-accent">Contact</p>
              <div className="space-y-2">
                <a
                  href="mailto:hello@frostingfairy.com"
                  className="block text-lg hover:text-accent transition-colors"
                >
                  hello@frostingfairy.com
                </a>
                <a
                  href="tel:5550123456"
                  className="block text-lg hover:text-accent transition-colors"
                >
                  (555) 012-3456
                </a>
              </div>
            </div>
          </div>

          <div className="bg-accent/5 rounded-2xl p-8 border border-border">
            <h2 className="font-display text-2xl italic mb-6">A Few Notes</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We&apos;re a tiny shop with just a few tables. If you&apos;re planning a visit with a group, weekdays are usually quieter.
              </p>
              <p>
                Popular items sell out fast — we recommend arriving before 10 AM for the best selection. If you have your heart set on something specific, send us a message and we&apos;ll set one aside.
              </p>
              <p>
                Street parking is available on Willow Creek Lane and Maple Avenue. We&apos;re also a short walk from the Sweetsville train station.
              </p>
              <p>
                Well-behaved dogs are always welcome on the patio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
