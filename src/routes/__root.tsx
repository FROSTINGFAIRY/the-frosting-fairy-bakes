import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import logoAsset from "../assets/frosting-fairy-logo.jpeg.asset.json";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Frosting Fairy — Artisanal Bakery" },
      { name: "description", content: "Handmade pastries, small-batch treats, and magical baked goods from The Frosting Fairy bakery." },
      { name: "author", content: "The Frosting Fairy" },
      { property: "og:title", content: "The Frosting Fairy — Artisanal Bakery" },
      { property: "og:description", content: "Handmade pastries, small-batch treats, and magical baked goods." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@frostingfairy" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@400;500&family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src={logoAsset.url} alt="The Frosting Fairy" className="h-12 w-12 rounded-full object-cover" />
        <span className="font-display italic text-2xl tracking-tight text-accent hidden sm:inline">the frosting fairy</span>
      </Link>
      <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium text-muted-foreground">
        <Link to="/menu" className="hover:text-foreground transition-colors">Menu</Link>
        <Link to="/story" className="hover:text-foreground transition-colors">Our Story</Link>
        <Link to="/custom-orders" className="hover:text-foreground transition-colors">Custom Orders</Link>
        <Link to="/visit" className="hover:text-foreground transition-colors">Visit</Link>
      </div>
      <Link
        to="/menu"
        className="px-5 py-2 rounded-full border border-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all duration-300"
      >
        Order Now
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-12 bg-foreground text-background/60 font-mono text-[10px] uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between items-center gap-6">
      <span>&copy; 2024 The Frosting Fairy</span>
      <div className="flex gap-8">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">Instagram</a>
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">Pinterest</a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">TikTok</a>
      </div>
      <span>Hand-crafted with butter</span>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
